import {
  allPositions,
  Hand,
  JugglerBeat,
  JugglerBeats,
  Position,
  Throw,
} from './common';
import {Siteswap} from './siteswap';

export class JugglerStateBeat {
  LH: number;
  RH: number;

  constructor(LH = 0, RH = 0) {
    this.LH = LH;
    this.RH = RH;
  }

  increment(hand: Hand) {
    if (hand === Hand.Left) this.LH++;
    else this.RH++;
  }

  decrement(hand: Hand) {
    if (hand === Hand.Left) this.LH--;
    else this.RH--;
  }

  val(hand: Hand) {
    return hand === Hand.Left ? this.LH : this.RH;
  }

  isSync() {
    return this.LH > 0 && this.RH > 0;
  }

  isEmpty() {
    return this.LH === 0 && this.RH === 0;
  }

  flip() {
    return new JugglerStateBeat(this.RH, this.LH);
  }

  isLessOrEqual(other: JugglerStateBeat) {
    return this.LH <= other.LH && this.RH <= other.RH;
  }

  toString(sync: boolean) {
    if (sync) {
      return `(${this.LH},${this.RH})`;
    } else {
      if (this.isSync()) {
        throw new Error('Attempt to use async toString on sync beat');
      }
      // One of them must be zero so this is valid.
      return `${this.LH + this.RH}`;
    }
  }
}

export class JugglerState {
  beats: JugglerStateBeat[];

  constructor(beats: JugglerStateBeat[]) {
    this.beats = beats;
  }

  static Empty(maxHeight: number) {
    const beats = [];
    for (let i = 0; i < maxHeight; i++) {
      beats.push(new JugglerStateBeat());
    }
    return new JugglerState(beats);
  }

  removeTrailingZeros() {
    while (this.beats.length && this.beats[this.beats.length - 1].isEmpty()) {
      this.beats.pop();
    }
  }

  isPureAsync() {
    // Async patterns can start with either hand
    let curHand = -1;
    for (const beat of this.beats) {
      if (beat.isSync()) return false;
      if (beat.LH > 0) {
        if (curHand === Hand.Right) return false;
        curHand = Hand.Left;
      } else if (beat.RH > 0) {
        if (curHand === Hand.Left) return false;
        curHand = Hand.Right;
      }
      if (curHand !== -1) {
        curHand = 1 - curHand;
      }
    }
    return true;
  }

  flip() {
    return new JugglerState(this.beats.map(j => j.flip()));
  }

  toString() {
    const isAsync = this.isPureAsync();
    return this.beats.map(b => b.toString(!isAsync)).join('');
  }
}

function siteswapShorter(s1: Siteswap, s2: Siteswap) {
  return (
    s1.period < s2.period ||
    (s1.period === s2.period && s1.toString().length < s2.toString().length)
  );
}

export class State {
  jugglers: JugglerState[];
  jugglerDelays: number[];
  isGround = false;
  numObjects = 0;
  numJugglers = 0;
  maxHeight = 0;

  constructor(
    jugglers: JugglerState[],
    trimZeros = true,
    jugglerDelays?: number[]
  ) {
    this.jugglers = jugglers;
    this.numJugglers = this.jugglers.length;
    this.jugglerDelays = jugglerDelays
      ? jugglerDelays
      : new Array(jugglers.length).fill(0);
    if (trimZeros) this.trimZeros();
    this.recalc();
  }

  recalc() {
    this.numObjects = 0;
    this.maxHeight = 0;
    this.isGround = true;
    const len = this.numJugglers > 0 ? this.jugglers[0].beats.length : 0;
    for (const state of this.jugglers) {
      // All jugglers must be within a margin of 1
      this.isGround &&= Math.abs(state.beats.length - len) <= 1;
      this.isGround &&= state.isPureAsync();
      this.maxHeight = Math.max(this.maxHeight, state.beats.length);
      for (const beat of state.beats) {
        this.numObjects += beat.LH + beat.RH;
        this.isGround &&= beat.LH + beat.RH === 1;
      }
    }
  }

  trimZeros() {
    for (const state of this.jugglers) {
      state.removeTrailingZeros();
    }
  }

  at(position: Position) {
    const beat = this.jugglers[position.juggler].beats[position.time];
    return beat === undefined ? 0 : beat.val(position.hand);
  }

  inc(position: Position) {
    this.jugglers[position.juggler].beats[position.time].increment(
      position.hand
    );
  }

  dec(position: Position) {
    this.jugglers[position.juggler].beats[position.time].decrement(
      position.hand
    );
  }

  flip() {
    return new State(this.jugglers.map(j => j.flip()));
  }

  toString() {
    if (this.numJugglers === 1) return this.jugglers[0].toString();
    const stateStr = this.jugglers.map(j => j.toString()).join('|');
    return `<${stateStr}>`;
  }

  entry(from?: State, sync = false, allowFlipped = true) {
    if (!from) {
      from = State.GroundState(this.numObjects, sync, this.numJugglers);
    }
    return State.ShortestTransition(from, this, allowFlipped);
  }

  exit(to?: State, sync = false, allowFlipped = true) {
    if (!to) {
      to = State.GroundState(this.numObjects, sync, this.numJugglers);
    }
    return State.ShortestTransition(this, to, allowFlipped);
  }

  globalStateBeat(time: number) {
    return this.jugglers.map(state =>
      time < state.beats.length ? state.beats[time] : new JugglerStateBeat(0, 0)
    );
  }

  /*
    makeThrow(beat: JugglerBeat[]) {
        const front = this.state[0];
        const nonZeros = beat.reduce((tot, cur) => tot + (cur != 0 ? 1 : 0), 0);
        if (nonZeros != front) {
            throw Error(`${front} non-zero throws expected but ${nonZeros} given.`);
        }
        const newState = this.state.slice(1);
        for (const th of beat) {
            while (newState.length < th) {
                newState.push(0);
            }
            if (th != 0) {
                newState[th-1]++;
            }
        }
        return new State(newState);
    }
    */

  static GroundState(numObjects: number, sync = false, numJugglers = 1) {
    const jugglers = [];
    const minNumObjects = Math.floor(numObjects / numJugglers);
    const maxNumObjects = Math.ceil(numObjects / numJugglers);
    for (let i = 0; i < numJugglers; i++) {
      const n = i < numObjects % numJugglers ? maxNumObjects : minNumObjects;
      const state = JugglerState.Empty(n);
      if (sync) {
        for (let j = 0; j < n; j += 2) {
          state.beats[j].increment(Hand.Right);
          if (n % 2 === 0 || j !== n - 1) {
            state.beats[j].increment(Hand.Left);
          }
        }
      } else {
        let curHand = Hand.Left;
        for (let j = 0; j < n; j++) {
          state.beats[j].increment(curHand);
          curHand = 1 - curHand;
        }
      }
      jugglers.push(state);
    }
    return new State(jugglers);
  }

  static Empty(numJugglers: number, maxHeight: number) {
    const state: JugglerState[] = [];
    for (let j = 0; j < numJugglers; j++) {
      state.push(JugglerState.Empty(maxHeight));
    }
    return new State(state, /*trimZeros=*/ false);
  }

  static IsTransitionValid(s1: State, s2: State) {
    if (s1.numObjects !== s2.numObjects) {
      throw Error('States must be for the same number of objects.');
    }
    if (s1.numJugglers !== s2.numJugglers) {
      throw Error('States must be for the same number of jugglers.');
    }
    // TODO: there really should be a built in way of comparing arrays...
    if (!s1.jugglerDelays.every((v, i) => v === s2.jugglerDelays[i])) {
      throw Error(
        'Transitions between states with different juggler delays are not supported.'
      );
    }
  }

  static IsShiftValid(s1: State, s2: State, shift: number) {
    // Shift is valid when s2 is >= s1 at all points, e.g.
    // 11011
    //   11101
    for (let i = 0; i < Math.min(s2.maxHeight, s1.maxHeight - shift); i++) {
      const globalBeat1 = s1.globalStateBeat(shift + i);
      const globalBeat2 = s2.globalStateBeat(i);
      if (!globalBeat1.every((beat, i) => beat.isLessOrEqual(globalBeat2[i]))) {
        return false;
      }
    }
    return true;
  }

  static ShortestTransitionLength(s1: State, s2: State) {
    State.IsTransitionValid(s1, s2);
    let shift = Math.max(0, s1.maxHeight - s2.maxHeight);
    for (; shift <= s1.maxHeight; shift++) {
      if (State.IsShiftValid(s1, s2, shift)) {
        return shift;
      }
    }
    // If they have the same number of objects, we should have found a valid shift.
    /* istanbul ignore next */
    throw Error('Logic Error - this should never happen');
  }

  static FindLandings(s1: State, s2: State, shift: number) {
    // Find landing times/positions needed
    // 11011
    //   11101
    // Lands: 2, 6
    const lands: Position[] = [];
    for (const pos of allPositions(s1.numJugglers, s2.maxHeight)) {
      const newLanding = s2.at(pos);
      pos.time += shift;
      const alreadyLanding = pos.time >= s1.maxHeight ? 0 : s1.at(pos);
      for (let j = 0; j < newLanding - alreadyLanding; j++) {
        lands.push(pos);
      }
    }
    return lands;
  }

  static GetTransition(s: State, length: number, land_times: Position[]) {
    let upto = 0;
    const jugglers = [];
    for (let j = 0; j < s.numJugglers; j++) {
      const jugglerBeats = [];
      for (let i = 0; i < length; i++) {
        const beat: Throw[][] = [[], []];
        for (const hand of [Hand.Right, Hand.Left]) {
          for (let k = 0; k < s.jugglers[j].beats[i].val(hand); k++) {
            const start: Position = {juggler: j, time: i, hand: hand};
            beat[hand].push(Throw.FromPositions(start, land_times[upto]));
            upto++;
          }
        }
        jugglerBeats.push(new JugglerBeat(beat[0], beat[1]));
      }
      jugglers.push(new JugglerBeats(jugglerBeats));
    }
    return new Siteswap(jugglers);
  }

  static ShortestTransition(s1: State, s2: State, allowFlipped: boolean) {
    let best = State.BasicTransition(s1, s2);
    if (allowFlipped) {
      const flipA = State.BasicTransition(s1.flip(), s2);
      const flipB = State.BasicTransition(s1, s2.flip());
      const flipAB = State.BasicTransition(s1.flip(), s2.flip());
      if (siteswapShorter(flipA, best)) best = flipA;
      if (siteswapShorter(flipB, best)) best = flipB;
      if (siteswapShorter(flipAB, best)) best = flipAB;
    }
    return best;
  }

  static BasicTransition(s1: State, s2: State) {
    const length = State.ShortestTransitionLength(s1, s2);
    const lands = State.FindLandings(s1, s2, length);
    // Match landing positions to throw positions to get throws.
    // 0 -> 2  :::  2
    // 1 -> 6  :::  5
    return State.GetTransition(s1, length, lands);
  }

  static *AllTransitionsOfLength(s1: State, s2: State, length: number) {
    State.IsTransitionValid(s1, s2);
    if (!State.IsShiftValid(s1, s2, length)) {
      return;
    }
    const land_times = State.FindLandings(s1, s2, length);
    yield State.GetTransition(s1, length, land_times);
    // Find all valid (don't give negative throws) matchings between landing/throwing positions.
    // 0, 1 -> 2, 6  :::  25 & 61
    const perm_length = land_times.length;
    const c = new Array(perm_length).fill(0);
    let i = 1;

    while (i < perm_length) {
      if (c[i] < i) {
        const k = i % 2 && c[i];
        const p = land_times[i];
        land_times[i] = land_times[k];
        land_times[k] = p;
        ++c[i];
        i = 1;
        const t = State.GetTransition(s1, length, land_times);
        yield t;
      } else {
        c[i] = 0;
        ++i;
      }
    }
  }
}
