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
    const floatStr = (n-intPart).toLocaleString(undefined, { maximumFractionDigits: 2 });
    if (floatStr === '1') {
        // Rounded up, e.g. was 4.999
        return intToSS(intPart+1);
    }
    return floatStr.replace(/^0/, intToSS(intPart));
}

export function ssToInt(ss: string) {
    if (ss.length === 1) {
        if ("0" <= ss && ss <= "9") {
            return parseInt(ss);
        } else if ("a" <= ss && ss <= "z") {
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
export function fixFraction(n: number, allow36: boolean = false) {
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

// A single throw, has a height, which juggler it's to and whether or not it has an 'x' (
export class Throw {
    origHeight: number;
    height: number;
    x: boolean;
    pass: boolean;
    passTo?: number;

    constructor(height: number, x: boolean, pass: boolean, passTo?: number) {
        this.origHeight = height;
        this.height = fixFraction(height, /*allow36=*/false);
        this.x = x;
        this.pass = pass;
        this.passTo = passTo;
    }

    toString() {
        return [
            floatToSS(this.origHeight),
            this.pass ? 'p' : '',
            this.x ? 'x' : '',
            this.passTo != null ? toLetter(this.passTo, 'A') : '',
        ].join('');
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
        return this.LH.length == 0 && this.RH.length == 0;
    }

    isAsync() {
        return !this.isSync() && !this.isEmpty();
    }

    hasMultiplex() {
        return this.LH.length > 1 || this.RH.length > 1;
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
            return nextHand == Hand.Left ? left : `L${left}`;
        } else if (right) {
            return nextHand == Hand.Right ? right : `R${right}`;
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
    constructor(beats: GeneralBeat[], repeatFlipped: boolean = false) {
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
        let prev = undefined;
        let prevSync = false;
        let result = '';
        for (const beat of this.beats) {
            if (prevSync && !beat.isEmpty()) {
                result += '!';
            }
            // LH when not at the start, and have only RH throwing previously
            const curHand = (prev && prev.isAsync() && prev.RH.length) ? Hand.Left : Hand.Right;
            result += beat.toString(curHand);
            prev = beat;
            // If we have an empty beat that isn't hidden
            if (beat.isEmpty() && (prev == null || !prevSync)) {
                result += '(0,0)';
                prevSync = true;
            } else {
                prevSync = beat.isSync();
            }
        }
        if (prevSync) {
            result += '!';
        }
        return result;
    }
}
