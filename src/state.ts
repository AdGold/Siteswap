import {Hand} from './common';

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

  isSync() {
    return this.LH > 0 && this.RH > 0;
  }

  isEmpty() {
    return this.LH === 0 && this.RH === 0;
  }

  flip() {
    return new JugglerStateBeat(this.RH, this.LH);
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

  toString() {
    const isAsync = this.isPureAsync();
    return this.beats.map(b => b.toString(!isAsync)).join('');
  }
}

export class State {
  jugglers: JugglerState[];
  readonly isGround: boolean;
  readonly numObjects: number;
  readonly numJugglers: number;

  constructor(jugglers: JugglerState[]) {
    this.jugglers = jugglers;
    this.numJugglers = this.jugglers.length;
    for (const state of this.jugglers) {
      state.removeTrailingZeros();
    }

    this.numObjects = 0;
    this.isGround = true;
    const len = this.numJugglers > 0 ? this.jugglers[0].beats.length : 0;
    for (const state of this.jugglers) {
      // All jugglers must be within a margin or 1
      this.isGround &&= Math.abs(state.beats.length - len) <= 1;
      this.isGround &&= state.isPureAsync();
      for (const beat of state.beats) {
        this.numObjects += beat.LH + beat.RH;
        this.isGround &&= beat.LH + beat.RH === 1;
      }
    }
  }

  toString() {
    if (this.numJugglers === 1) return this.jugglers[0].toString();
    const stateStr = this.jugglers.map(j => j.toString()).join('|');
    return `<${stateStr}>`;
  }
  /*
    entry(from?: State) {
        if (!from) {
            from = State.GroundState(this.numObjects);
        }
        return State.ShortestTransition(from, this);
    }

    exit(to?: State) {
        if (!to) {
            to = State.GroundState(this.numObjects);
        }
        return State.ShortestTransition(this, to);
    }

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

    toString() {
        return this.state.join('');
    }

    static GroundState(numObjects: number, sync: boolean = false, numJugglers: number = 1) {
        return new State(new Array(numObjects).fill(1));
    }

    static ShortestTransitionLength(s1: State, s2: State) {
        if (s1.numObjects != s2.numObjects) {
            throw Error("States must be for the same number of throws.");
        }
        // Find the first shift where s2 is >= s1 at all points, e.g.
        // 11011
        //   11101
        let shift = Math.max(0, s1.state.length - s2.state.length);
        for (; shift < s1.state.length; shift++) {
            let valid = true;
            for (let i = 0; i < Math.min(s2.state.length, s1.state.length-shift); i++) {
                if (s2.state[i] < s1.state[shift + i]) {
                    valid = false;
                    break;
                }
            }
            if (valid) {
                return shift;
            }
        }
        // If they have the same number of objects, we should have found a valid shift.
        throw Error("Logic Error - this should never happen");
    }

    static FindLandingTimes(s1: State, s2: State, shift: number) {
        // Find landing positions needed
        // 11011
        //   11101
        // Lands: 2, 6
        let lands: number[] = [];
        for (let i = 0; i < s2.state.length; i++) {
            const alreadyLanding = shift + i >= s1.state.length ? 0 : s1.state[shift + i];
            for (let j = 0; j < s2.state[i] - alreadyLanding; j++) {
                lands.push(shift + i);
            }
        }
        return lands;
    }

    static AllTransitionsOfLength(s1: State, s2: State, length: number) {
        const lands = State.FindLandingTimes(s1, s2, length);
        // Find all valid (don't give negative throws) matchings between landing/throwing positions.
        // 0, 1 -> 2, 6  ::: 25 & 61
        const seen = new Map();
        // TODO
    }

    static ShortestTransition(s1: State, s2: State) {
        const length = State.ShortestTransitionLength(s1, s2);
        let lands = State.FindLandingTimes(s1, s2, length);
        // Match landing positions to throw positions to get throws.
        // 0 -> 2  :::  2
        // 1 -> 6  :::  5
        const ss: BasicBeat[] = [];
        for (let i = 0; i < length; i++) {
            const ths: BasicBeat = [];
            for (let j = 0; j < s1.state[i]; j++) {
                ths.push(lands[0] - i);
                lands = lands.slice(1);
            }
            ss.push(ths);
        }
        return new BasicSiteswap(ss);
    }
    //*/
}
