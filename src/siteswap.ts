import {
  JugglerBeats,
  Position,
  allPositions,
  Hand,
  fixFraction,
  toLetter,
} from './common';
import {State} from './state';
import {parse} from './parser';

export class Siteswap {
  numObjects = 0;
  numJugglers = 0;
  period = 0;
  maxHeight = 0;

  hasMultiplex = false;
  hasSync = false;
  hasAsync = false;
  hasPass = false;

  isValid = false;
  errorMessage = '';

  jugglers: JugglerBeats[];
  jugglerDelays: number[];

  state: State;

  constructor(jugglers: JugglerBeats[], jugglerDelays?: number[]) {
    this.jugglers = jugglers;
    // Default to all delays 0
    this.jugglerDelays = jugglerDelays
      ? jugglerDelays
      : new Array(jugglers.length).fill(0);
    // Make compiler happy
    this.state = new State([]);
    this.validate();
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

    // Convert .3 and .6 to 1/3 and 2/3 when we have a multiple of 3 jugglers
    const allow36 = this.numJugglers % 3 === 0;
    const jugglerDelays = this.jugglerDelays.map(d => fixFraction(d, allow36));
    if (jugglerDelays.length !== this.numJugglers) {
      this.errorMessage = `Number of jugglers (${this.numJugglers}) not equal to number of delays (${jugglerDelays.length})`;
      return false;
    }

    this.hasMultiplex = this.jugglers.some(j =>
      j.beats.some(b => b.hasMultiplex)
    );
    this.hasPass = this.jugglers.some(j => j.beats.some(b => b.hasPass));
    this.hasSync = this.jugglers.some(j => j.beats.some(b => b.isSync));
    this.hasAsync = this.jugglers.some(j => j.beats.some(b => b.isAsync));

    this.maxHeight = 0;
    let sum = 0;
    // check stores the number of throws which should land for each juggler, beat and hand
    // First index = juggler, second index = beat, third index = hand
    // const check: number[][][] = [];
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
      jugglerDelays.some(d => d !== 0) &&
      Math.abs(this.numObjects - rounded) < 1e-2
    ) {
      this.numObjects = rounded;
    }
    if (this.numObjects % 1 !== 0) {
      this.errorMessage = 'Invalid pattern average';
      return false;
    }

    this.state = State.Empty(this.numJugglers, this.maxHeight);
    const pureAsync = this.jugglers.every(juggler =>
      juggler.beats.every(beat => beat.isAsync())
    );
    // Pure async siteswaps of odd period automatically flip sides
    const implicitFlip = pureAsync && this.period % 2 === 1;
    for (const pos of allPositions(this.numJugglers, this.period)) {
      for (const th of this.throwsAt(pos)) {
        const landJuggler = th.landJuggler(pos.juggler, this.numJugglers);
        const fractionDiff =
          jugglerDelays[pos.juggler] - jugglerDelays[landJuggler];
        let fullLandTime = pos.time + th.height + fractionDiff;
        const rounded = Math.round(fullLandTime);
        if (Math.abs(fullLandTime - rounded) < 1e-2) {
          fullLandTime = rounded;
        } else {
          this.errorMessage = `Throw ${th.origHeight} lands at an invalid time for juggler ${landJuggler}`;
          return false;
        }
        const landTime = fullLandTime % this.period;
        const fullLandHand = th.throwSwapsHands() ? 1 - pos.hand : pos.hand;
        // We swap hands (again) if there is an implicit flip (e.g. odd period
        // vanilla siteswaps) and we looped around an odd number of times.
        // This isn't because the throw swapped hands but because the siteswap
        // should be repeating on the other side.
        const loops = Math.floor(fullLandTime / this.period);
        const landHand =
          implicitFlip && loops % 2 === 1 ? 1 - fullLandHand : fullLandHand;
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
          this.state.inc({juggler: landJuggler, time: curTime, hand: curHand});
          // Back one period of the siteswap
          if (implicitFlip) curHand = 1 - curHand;
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
      let delays = '';
      if (this.jugglerDelays.some(d => d > 0)) {
        delays = `{${this.jugglerDelays.join(',')}}`;
      }
      return `${delays}<${jugglerStrings}>`;
    }
  }

  flip() {
    return new Siteswap(this.jugglers.map(juggler => juggler.flip()));
  }

  // TODO JIF conversion
  // toJIF() { return {}; }
  // static FromJif(jif: JSON) { }

  static Parse(input: string) {
    const parsed = parse(input);
    // If we have a multiple of 3 jugglers then fix and .3 and .6 throws
    if (parsed[0].length % 3 === 0) {
      for (const juggler of parsed[0]) {
        for (const beat of juggler.beats) {
          for (const ths of [beat.LH, beat.RH]) {
            for (const th of ths) {
              th.height = fixFraction(th.origHeight, /*allow36=*/ true);
            }
          }
        }
      }
    }
    return new Siteswap(parsed[0], parsed[1]);
  }

  // TODO PasreFromKHSS
}
