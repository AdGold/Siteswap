export function toLetter(n: number, base: string) {
  return String.fromCharCode(base.charCodeAt(0) + n);
}

export function fromLetter(letter: string, base: string) {
  return letter.charCodeAt(0) - base.charCodeAt(0);
}

export function intToSS(n: number) {
  if (0 <= n && n < 10) {
    return n.toString();
  } else if (10 <= n && n < 36) {
    return toLetter(n - 10, 'a');
  }
  throw new Error('Only siteswaps up to height 35 are accepted');
}

export function floatToSS(n: number) {
  const intPart = Math.floor(n);
  const floatStr = (n - intPart).toLocaleString(undefined, {
    maximumFractionDigits: 2,
  });
  if (floatStr === '1') {
    // Rounded up, e.g. was 4.999
    return intToSS(intPart + 1);
  }
  return floatStr.replace(/^0/, intToSS(intPart));
}

export function ssToInt(ss: string) {
  if (ss.length === 1) {
    if ('0' <= ss && ss <= '9') {
      return parseInt(ss);
    } else if ('a' <= ss && ss <= 'z') {
      return fromLetter(ss, 'a') + 10;
    }
  }
  throw new Error('Unknown siteswap throw "' + ss + '"');
}

export function ssToFloat(ss: string) {
  const intPart = ssToInt(ss[0]);
  if (ss.length > 1) {
    const floatSS = ss.slice(1);
    if (!/^\.[0-9]+$/.test(floatSS)) {
      throw new Error('Unknown siteswap throw "' + ss + '"');
    }
    return intPart + parseFloat(floatSS);
  }
  return intPart;
}

export enum Hand {
  Right,
  Left,
}

const EPS = 1e-7;
// Lax epsilon to deal with inputs which are only 2 decimal places normally
const LAX_EPS = 1e-2;

// Deal with fractional throw heights
export function fixFraction(n: number, allow36 = false) {
  const whole = Math.floor(n);
  const frac = n % 1;
  if (frac === 0) return n;
  if (allow36 && Math.abs(frac - 0.3) < EPS) return whole + 1 / 3;
  if (allow36 && Math.abs(frac - 0.6) < EPS) return whole + 2 / 3;
  for (let i = 2; i < 10; i++) {
    for (let num = 1; num < i; num++) {
      if (Math.abs(frac - num / i) < LAX_EPS) {
        return whole + num / i;
      }
    }
  }
  return n;
}

export function unfixFraction(n: number, allow36 = false) {
  const whole = Math.floor(n);
  const frac = n % 1;
  if (frac === 0) return n;
  if (allow36 && Math.abs(frac - 1 / 3) < EPS) return whole + 0.3;
  if (allow36 && Math.abs(frac - 2 / 3) < EPS) return whole + 0.6;
  // Otherwise, just round to 2 decimal places
  return Math.round(n * 100) / 100;
}

export interface Position {
  juggler: number;
  time: number;
  hand: Hand;
}

export function allPositions(numJugglers: number, period: number) {
  const positions: Position[] = [];
  for (let j = 0; j < numJugglers; j++) {
    for (let i = 0; i < period; i++) {
      for (const hand of [Hand.Right, Hand.Left]) {
        positions.push({ juggler: j, time: i, hand: hand });
      }
    }
  }
  return positions;
}

// A single throw, has a height, which juggler it's to and whether or not it has an 'x'
export class Throw {
  dispHeight: number;
  height: number;
  x: boolean;
  pass: boolean;
  passTo?: number;

  constructor(height: number, x: boolean, pass: boolean, passTo?: number) {
    this.dispHeight = height;
    this.height = fixFraction(height, /*allow36=*/ false);
    this.x = x;
    this.pass = pass;
    this.passTo = passTo;
  }

  toString() {
    return [
      floatToSS(this.dispHeight),
      this.pass ? 'p' : '',
      this.x ? 'x' : '',
      this.passTo != null ? toLetter(this.passTo, 'A') : '',
    ].join('');
  }

  throwSwapsHands() {
    // Passes swap hands normally ('straight') and with an x they don't ('crossing')
    if (this.pass) return !this.x;
    // Normal throws swap hands if they're even with an x or odd with no x
    return (this.height % 2 === 0) === this.x;
  }

  landJuggler(startJuggler: number, numJugglers: number) {
    if (this.pass) {
      return this.passTo != null
        ? this.passTo
        : (startJuggler + 1) % numJugglers;
    }
    return startJuggler;
  }

  static FromPositions(p1: Position, p2: Position) {
    const height = p2.time - p1.time;
    const pass = p1.juggler !== p2.juggler;
    const passTo = pass ? p2.juggler : undefined;
    const swapsHands = p1.hand === p2.hand;
    const x = pass ? swapsHands : (height % 2 === 0) !== swapsHands;
    return new Throw(height, x, pass, passTo);
  }
}

// On a beat, each hand of a juggler can do a multiplex with any number of throws.
export class JugglerBeat {
  LH: Throw[];
  RH: Throw[];

  constructor(LH: Throw[], RH: Throw[]) {
    this.LH = LH;
    this.RH = RH;
  }

  isSync() {
    return this.LH.length > 0 && this.RH.length > 0;
  }

  isEmpty() {
    return this.LH.length === 0 && this.RH.length === 0;
  }

  isAsync() {
    return !this.isSync() && !this.isEmpty();
  }

  maxMultiplex() {
    return Math.max(this.LH.length, this.RH.length);
  }

  hasPass() {
    return this.LH.some(th => th.pass) || this.RH.some(th => th.pass);
  }

  flip() {
    return new JugglerBeat(this.RH, this.LH);
  }

  toString(nextHand: Hand) {
    const leftThrows = this.LH.map(th => th.toString()).join('');
    const rightThrows = this.RH.map(th => th.toString()).join('');
    const left = this.LH.length > 1 ? `[${leftThrows}]` : leftThrows;
    const right = this.RH.length > 1 ? `[${rightThrows}]` : rightThrows;
    if (left && right) {
      return `(${left},${right})`;
    } else if (left) {
      return nextHand === Hand.Left ? left : `L${left}`;
    } else if (right) {
      return nextHand === Hand.Right ? right : `R${right}`;
    } else {
      return '';
    }
  }
}

type GeneralBeat = Throw[] | JugglerBeat;

export class JugglerBeats {
  beats: JugglerBeat[];

  // Constructor deals with multiple types to make the parser cleaner.
  // If there is a Throw or Throw[], its hand is given as the opposite of the previous hand, resetting to RH at the beginning and after sync beats.
  constructor(beats: GeneralBeat[], repeatFlipped = false) {
    this.beats = [];
    for (const beat of beats) {
      if (beat instanceof JugglerBeat) {
        this.beats.push(beat);
      } else {
        const prev = this.beats.slice(-1)[0];
        // Must be not at the start, and have only RH throwing previously
        if (prev && prev.isAsync() && prev.RH.length) {
          this.beats.push(new JugglerBeat(beat, []));
        } else {
          this.beats.push(new JugglerBeat([], beat));
        }
      }
    }
    if (repeatFlipped) {
      this.beats.push(...this.beats.map(beat => beat.flip()));
    }
  }

  flip() {
    return new JugglerBeats(this.beats.map(beat => beat.flip()));
  }

  toString() {
    let prevSync = false;
    let result = '';
    let curHand = Hand.Right;
    for (const beat of this.beats) {
      if (prevSync && !beat.isEmpty()) {
        result += '!';
      }
      const curString = beat.toString(curHand);
      if ((curString === 'x' || curString === 'p') && result !== '') {
        result += ' ';
      }
      result += curString
      // If we have an empty beat that isn't hidden treat as async 0
      if (beat.isEmpty() && !prevSync) {
        result += '0';
        // Keep in line with whatever async was thrown previously
        curHand = 1 - curHand;
      } else if (beat.isEmpty()) {
        curHand = Hand.Right;
      } else if (beat.isSync()) {
        curHand = Hand.Right;
      } else if (beat.isAsync()) {
        curHand = beat.RH.length ? Hand.Left : Hand.Right;
      }
      prevSync = beat.isSync();
    }
    if (prevSync) {
      result += '!';
    }
    return result;
  }
}
