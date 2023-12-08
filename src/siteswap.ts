import {
  allPositions,
  fixFraction,
  Hand,
  intToSS,
  JugglerBeats,
  Position,
  ssToInt,
  Throw,
  toLetter,
  unfixFraction
} from './common';
import { parse } from './parser';
import { State } from './state';
import { VanillaSiteswap } from './vanilla-siteswap';
import { JIFThrow, JIF } from './jif';

function np(a: number, b: number) {
  return `${a},${b}`;
}

function round3(num: number) {
  return Math.round( ( num + Number.EPSILON ) * 1000 ) / 1000;
}

function swapHand(time: number, period: number, implicitFlip: boolean) {
  const loops = Math.floor(time / period);
  return implicitFlip && loops % 2 === 1;
}

export class Siteswap {
  numObjects = 0;
  numJugglers = 0;
  period = 0;
  maxHeight = 0;

  maxMultiplex = 0;
  hasSync = false;
  hasAsync = false;
  hasPass = false;
  pureAsync = false;

  isValid = false;
  errorMessage = '';

  jugglers: JugglerBeats[];
  jugglerDelays: number[];

  state: State;

  _jugglerDelaysInferred = false;
  _implicitFlip = false;

  constructor(jugglers: JugglerBeats[], jugglerDelays?: number[]) {
    this.jugglers = jugglers;
    this.jugglerDelays = jugglerDelays ? jugglerDelays : new Array(jugglers.length).fill(-1);

    // If we have a multiple of 3 jugglers then fix and .3 and .6 throws
    if (this.jugglers.length % 3 === 0) {
      for (const juggler of this.jugglers) {
        for (const beat of juggler.beats) {
          for (const ths of [beat.LH, beat.RH]) {
            for (const th of ths) {
              th.height = fixFraction(th.dispHeight, /*allow36=*/ true);
            }
          }
        }
      }
    }

    if (this.jugglers.length > 0) {
      // Convert any delays of more than 1 to less and rotate the siteswap
      this.pureAsync = this.jugglers.every(juggler =>
        juggler.beats.every(beat => beat.isAsync())
      );
      // Pure async siteswaps of odd period automatically flip sides
      this._implicitFlip = this.pureAsync && this.jugglers[0].beats.length % 2 === 1;
      for (let i = 0; i < this.jugglerDelays.length; i++) {
        while (this.jugglerDelays[i] >= 1) {
          let lastBeat = this.jugglers[i].beats.pop()!;
          if (this._implicitFlip) lastBeat = lastBeat.flip();
          this.jugglers[i].beats.unshift(lastBeat);
          this.jugglerDelays[i]--;
        }
      }
    }

    // Make compiler happy
    this.state = new State([], true, jugglerDelays);
    this.validate();
  }

  inferJugglerDelays() {
    if (!this.jugglerDelays.every(x => x === -1)) {
      // We were given delays, don't infer them
      return true;
    }
    this.jugglerDelays[0] = 0;
    const allowed_jugglers = [0];
    while (allowed_jugglers.length > 0) {
      const juggler = allowed_jugglers.pop()!;
      for (let i = 0; i < this.period; i++) {
        for (const hand of [Hand.Right, Hand.Left]) {
          const pos: Position = { juggler: juggler, time: i, hand: hand };
          for (const th of this.throwsAt(pos)) {
            if (th.pass) {
              const to = th.passTo ? th.passTo : (juggler + 1) % this.numJugglers;
              const land_frac = (this.jugglerDelays[juggler] + th.height) % 1;
              if (this.jugglerDelays[to] === -1) {
                this.jugglerDelays[to] = land_frac;
                allowed_jugglers.push(to);
              } else if (Math.abs(this.jugglerDelays[to] - land_frac) > 1e-2) {
                const jugglerName = toLetter(juggler, 'A');
                this.errorMessage = `Cannot find consistent juggler delays: juggler ${jugglerName} has delays of ${this.jugglerDelays[to]} and ${land_frac}`;
                return false;
              }
            } else {
              if (th.height % 1 !== 0) {
                this.errorMessage = `Cannot find consistent juggler delays: self throw of height ${th.height}`;
                return false;
              }
            }
          }
        }
      }
    }
    this._jugglerDelaysInferred = true;
    return true;
  }

  throwsAt(position: Position) {
    const beat = this.jugglers[position.juggler].beats[position.time];
    return position.hand === Hand.Right ? beat.RH : beat.LH;
  }

  validate() {
    this.isValid = false;
    this.errorMessage = '';
    this.numJugglers = this.jugglers.length;
    if (this.numJugglers === 0) {
      this.errorMessage = 'No jugglers';
      return false;
    }

    this.period = this.jugglers[0].beats.length;
    if (!this.jugglers.every(juggler => juggler.beats.length === this.period)) {
      this.errorMessage = 'Mismatching juggler periods';
      return false;
    }

    if (!this.inferJugglerDelays()) {
      // Couldn't find consistent juggler delays
      return false;
    }

    // Convert .3 and .6 to 1/3 and 2/3 when we have a multiple of 3 jugglers
    const allow36 = this.numJugglers % 3 === 0;
    this.jugglerDelays = this.jugglerDelays.map(d => fixFraction(d, allow36));
    if (this.jugglerDelays.length !== this.numJugglers) {
      this.errorMessage = `Number of jugglers (${this.numJugglers}) not equal to number of delays (${this.jugglerDelays.length})`;
      return false;
    }

    this.maxMultiplex = Math.max(
      ...this.jugglers.map(j => Math.max(...j.beats.map(b => b.maxMultiplex())))
    );
    this.hasPass = this.jugglers.some(j => j.beats.some(b => b.hasPass()));
    this.hasSync = this.jugglers.some(j => j.beats.some(b => b.isSync()));
    this.hasAsync = this.jugglers.some(j => j.beats.some(b => b.isAsync()));

    this.maxHeight = 0;
    let sum = 0;
    // `check` stores the number of throws which should land for each juggler, beat and hand
    const check = State.Empty(this.numJugglers, this.period);
    for (const pos of allPositions(this.numJugglers, this.period)) {
      for (const th of this.throwsAt(pos)) {
        sum += th.height;
        this.maxHeight = Math.max(this.maxHeight, th.height);
        // Validate pass recipients
        if (th.passTo && th.passTo >= this.numJugglers) {
          const juggler = toLetter(th.passTo, 'A');
          this.errorMessage = `Invalid juggler ${juggler}, there are only ${this.numJugglers} jugglers`;
          return false;
        }
        check.inc(pos);
      }
    }

    this.numObjects = sum / this.period;
    // Be a bit more lax and round if we have juggler delays
    const rounded = Math.round(this.numObjects);
    if (
      this.jugglerDelays.some(d => d !== 0) &&
      Math.abs(this.numObjects - rounded) < 1e-2
    ) {
      this.numObjects = rounded;
    }
    if (this.numObjects % 1 !== 0) {
      this.errorMessage = 'Invalid pattern average';
      return false;
    }

    this.state = State.Empty(this.numJugglers, this.maxHeight);
    for (const pos of allPositions(this.numJugglers, this.period)) {
      for (const th of this.throwsAt(pos)) {
        const landJuggler = th.landJuggler(pos.juggler, this.numJugglers);
        const fractionDiff =
          this.jugglerDelays[pos.juggler] - this.jugglerDelays[landJuggler];
        let fullLandTime = pos.time + th.height + fractionDiff;
        const rounded = Math.round(fullLandTime);
        if (Math.abs(fullLandTime - rounded) < 1e-2) {
          fullLandTime = rounded;
        } else {
          this.errorMessage = `Throw ${th.dispHeight} lands at an invalid time for juggler ${landJuggler}`;
          return false;
        }
        const landTime = fullLandTime % this.period;
        const fullLandHand = th.throwSwapsHands() ? 1 - pos.hand : pos.hand;
        // We swap hands (again) if there is an implicit flip (e.g. odd period
        // vanilla siteswaps) and we looped around an odd number of times.
        // This isn't because the throw swapped hands but because the siteswap
        // should be repeating on the other side.
        const landHand = swapHand(fullLandTime, this.period, this._implicitFlip) ? 1 - fullLandHand : fullLandHand;
        const landPosition: Position = {
          juggler: landJuggler,
          time: landTime,
          hand: landHand,
        };
        // Check landing position
        if (check.at(landPosition) <= 0) {
          this.errorMessage = `Collision at juggler ${landJuggler}, time ${landTime}, hand ${landHand}`;
          return false;
        }
        check.dec(landPosition);
        // Add to state, first at original land time, ignoring those landing before the end of the siteswap
        let curTime = fullLandTime - this.period;
        let curHand = fullLandHand;
        while (curTime >= 0) {
          this.state.inc({ juggler: landJuggler, time: curTime, hand: curHand });
          // Back one period of the siteswap
          if (this._implicitFlip) curHand = 1 - curHand;
          curTime -= this.period;
        }
      }
    }
    this.state.trimZeros();
    this.state.recalc();
    this.isValid = true;
    return true;
  }

  toString() {
    if (this.jugglers.length === 1) {
      return this.jugglers[0].toString();
    } else {
      const jugglerStrings = this.jugglers.map(j => j.toString()).join('|');
      const allow36 = this.numJugglers % 3 === 0;
      let delays = '';
      if (this.jugglerDelays.some(d => d > 0) && !this._jugglerDelaysInferred) {
        delays = `{${this.jugglerDelays.map(d => unfixFraction(d, allow36)).join(',')}}`;
      }
      return `${delays}<${jugglerStrings}>`;
    }
  }

  flip() {
    return new Siteswap(this.jugglers.map(juggler => juggler.flip()));
  }

  toVanilla() {
    if (!this.pureAsync || this.numJugglers !== 1) {
      throw "Could not convert to vanilla siteswap: must be async and single juggler";
    }
    const throws: number[][] = [];
    for (const beat of this.jugglers[0].beats) {
      const ths = beat.LH.length > 0 ? beat.LH : beat.RH;
      throws.push(ths.map(th => th.height));
    }
    return new VanillaSiteswap(throws);
  }

  toJIF() {
    const RADIUS = this.numJugglers === 1 ? 0 : 1.5;
    const objectType = "club";
    const jugglers = [];
    const limbs = [];
    const props = [];
    for (let i = 0; i < this.numJugglers; i++) {
      limbs.push({juggler: i, type: 'right hand'});
      limbs.push({juggler: i, type: 'left hand'});
      const angle = i * 2 * Math.PI / this.numJugglers;
      jugglers.push({
        name: toLetter(i, 'A'),
        position: [round3(RADIUS * Math.cos(angle)), 0, round3(RADIUS * Math.sin(angle))],
        lookAt: [0, 0, this.numJugglers === 1 ? 1 : 0],
      });
    }
    for (let i = 0; i < this.numObjects; i++) {
        props.push({color: "#f45d20", type: objectType});
    }
    const events = [];
    for (const pos of allPositions(this.numJugglers, this.period)) {
      for (const th of this.throwsAt(pos)) {
        events.push({
          time: pos.time + this.jugglerDelays[pos.juggler],
          height: th.height,
          fromHand: pos.hand,
          toHand: th.throwSwapsHands() ? 1 - pos.hand : pos.hand,
          fromJuggler: pos.juggler,
          toJuggler: th.landJuggler(pos.juggler, this.numJugglers),
          label: th.toString(),
        });
      }
    }
    events.sort((a, b) => a.time - b.time);
    const throws = [];
    const positions: Map<string, number | undefined> = new Map();
    let timeOffset = 0;
    let nextProp = 0;
    const inits = [];
    while (true) {
      for (const event of events) {
        const time = event["time"] + timeOffset;
        const fromHand = swapHand(time, this.period, this._implicitFlip) ? 1 - event["fromHand"] : event["fromHand"];
        const toHand = swapHand(time, this.period, this._implicitFlip) ? 1 - event["toHand"] : event["toHand"];
        const th: JIFThrow = {
          time: time,
          from: event["fromJuggler"] * 2 + fromHand,
          to: event["toJuggler"] * 2 + toHand,
          duration: event["height"],
          label: event["label"],
        };
        if (positions.get(np(th.time, th.from)) == undefined) {
          positions.set(np(th.time, th.from), nextProp);
          inits.push([th.time, th.from, nextProp]);
          nextProp += 1;
        }
        th.prop = positions.get(np(th.time, th.from));
        positions.set(np(th.time + th.duration, th.to), positions.get(np(th.time, th.from)));
        positions.set(np(th.time, th.from), undefined);
        throws.push(th);
      }
      timeOffset += this.period;
      let equal = true;
      for (const [time, from, prop] of inits) {
        if (positions.get(np(time + timeOffset, from)) !== prop) {
          equal = false;
          break;
        }
      }
      if (equal) break;
      if (timeOffset > 500) {
        /* istanbul ignore next */
        throw "Could not find a repetition within 500 steps, giving up";
      }
    }
    const jif: JIF = {
      "meta": {
        "name": this.toString(),
        "type": "General siteswap",
        "description": this.toString(),
      },
      "timeStretchFactor": 1,
      "valid": true,
      "jugglers": jugglers,
      "limbs": limbs,
      "props": props,
      "throws": throws,
      "repetition": {"period": timeOffset},
    };
    return jif;
  }
  // static FromJif(jif: JSON) { }

  static Parse(input: string) {
    const parsed = parse(input);
    return new Siteswap(parsed[0], parsed[1]);
  }

  static ParseKHSS(input: string, hands: number = 2): Siteswap {
    return Siteswap.FromKHSS(VanillaSiteswap.Parse(input), hands);
  }

  static FromKHSS(input: VanillaSiteswap, hands: number = 2): Siteswap {
    if (input.maxMultiplex > 1) {
      throw "KHSS only implemented without multiplexes";
    }
    if (hands % 2 !== 0) {
      // A bit of a hack to deal with odd-handed siteswaps as they break that each juggler has an even rhythm,
      // instead make `hands` jugglers and only use one hand from each juggler.
      const doubled: number[][] = [];
      for (const th of input.throws) {
        doubled.push(th.map(c => c * 2));
        doubled.push([0]);
      }
      // const doubled = Array.from(input).map(c => intToSS(ssToInt(c) * 2) + '0').join('');
      return Siteswap.FromKHSS(new VanillaSiteswap(doubled), hands * 2);
    }
    const numJugglers = hands / 2;
    const fix36 = numJugglers % 3 === 0;
    const jugglers: Throw[][][] = [];
    for (let i = 0; i < numJugglers; i++) {
      jugglers.push([]);
    }
    let j = 0;
    let i = 0;
    while (i >= 0) {
      const fullThrow = input.throws[i][0];
      // Convert to local height and make more readable
      const height = unfixFraction(fullThrow / numJugglers, fix36);
      // Non multiples are passes
      const isPass = fullThrow % numJugglers !== 0;
      // This checks the parity of the number of times the throw height crosses the last juggler
      const hasX = isPass && (fullThrow + j) % hands < hands / 2;
      // If it's not a pass to the next juggler, add who it's passed to
      const passTo =
        isPass && fullThrow % numJugglers !== 1
          ? (fullThrow + j) % numJugglers
          : undefined;
      const th = new Throw(height, hasX, isPass, passTo);
      // The height use earlier is the nice one - this is the exact one for use internally
      th.height = fullThrow / numJugglers;
      jugglers[j].push([th]);
      j = (j + 1) % numJugglers;
      i = (i + 1) % input.throws.length;
      if (i === 0 && j === 0) {
        // We've reached the start after enough repetitions
        break;
      }
    }
    const jugglerBeats = jugglers.map(ths => new JugglerBeats(ths));
    const delays = Array.from(new Array(numJugglers), (x, i) => i / numJugglers);
    return new Siteswap(jugglerBeats, delays);
  }
}
