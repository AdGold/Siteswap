import { intToSS, ssToInt } from "./common";

function sum(arr: number[]) {
    return arr.reduce((a, b) => a + b, 0);
}

export class VanillaState {
    state: number[];
    isGround = false;
    numObjects = 0;
    maxHeight = 0;

    constructor(state: number[]) {
        this.state = state;
        while (this.state.length > 0) {
            const test = this.state.pop()!;
            if (test !== 0) {
                this.state.push(test);
                break;
            }
        }

        this.numObjects = sum(this.state);
        this.maxHeight = this.state.length;
        this.isGround = this.state.every(x => x === 1);
    }

    toString() {
        return this.state.join('');
    }

    entry(from?: VanillaState) {
        return VanillaState.ShortestTransition(from ? from : VanillaState.GroundState(this.numObjects), this);
    }

    exit(to?: VanillaState) {
        return VanillaState.ShortestTransition(this, to ? to : VanillaState.GroundState(this.numObjects));
    }

    static GroundState(numObjects: number) {
        return new VanillaState(new Array(numObjects).fill(1));
    }

    static IsShiftValid(s1: VanillaState, s2: VanillaState, shift: number) {
        // Shift is valid when s2 is >= s1 at all points
        for (let i = 0; i < Math.min(s2.maxHeight, s1.maxHeight - shift); i++) {
            if (i + shift < s1.state.length && s1.state[i + shift] > s2.state[i]) return false;
        }
        return true;
    }

    static ShortestTransitionLength(s1: VanillaState, s2: VanillaState) {
        if (s1.numObjects !== s2.numObjects) {
            throw Error('States must be for the same number of objects.');
        }
        let shift = Math.max(0, s1.maxHeight - s2.maxHeight);
        while (!this.IsShiftValid(s1, s2, shift)) shift++;
        return shift;
    }

    static FindLandings(s1: VanillaState, s2: VanillaState, shift: number) {
        const lands: number[] = [];
        for (let i = 0; i < s2.maxHeight; i++) {
            const newLanding = s2.state[i];
            const alreadyLanding = i + shift >= s1.maxHeight ? 0 : s1.state[i + shift];
            lands.push(...Array(newLanding - alreadyLanding).fill(i + shift));
        }
        return lands;
    }

    static GetTransition(s: VanillaState, length: number, land_times: number[]) {
        let upto = 0;
        const throws: number[][] = []
        for (let i = 0; i < length; i++) {
            const beat: number[] = []
            for (let k = 0; k < s.state[i]; k++) {
                beat.push(land_times[upto++] - i);
            }
            throws.push(beat.length > 0 ? beat : [0]);
        }
        return new VanillaSiteswap(throws);
    }

    static ShortestTransition(s1: VanillaState, s2: VanillaState) {
        const length = VanillaState.ShortestTransitionLength(s1, s2);
        const lands = VanillaState.FindLandings(s1, s2, length);
        return VanillaState.GetTransition(s1, length, lands);
    }

    static * AllTransitionsOfLength(s1: VanillaState, s2: VanillaState, length: number) {
        if (s1.numObjects !== s2.numObjects) {
            throw Error('States must be for the same number of objects.');
        }
        if (!VanillaState.IsShiftValid(s1, s2, length)) {
            return;
        }
        const land_times = VanillaState.FindLandings(s1, s2, length);
        yield VanillaState.GetTransition(s1, length, land_times);
        // Find all valid (don't give negative throws) matchings between landing/throwing positions.
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
                yield VanillaState.GetTransition(s1, length, land_times);
            } else {
                c[i] = 0;
                ++i;
            }
        }
    }
}

export class VanillaSiteswap {
    numObjects = 0;
    period = 0;
    maxHeight = 0;
    maxMultiplex = 0;

    isValid = false;
    errorMessage = '';

    throws: number[][];
    state: VanillaState;

    constructor(throws: number[][]) {
        this.throws = throws;
        this.state = new VanillaState([]); // Make compiler happy
        this.validate();
    }

    validate() {
        this.isValid = false;
        this.errorMessage = '';
        this.period = this.throws.length;
        this.maxMultiplex = Math.max(...this.throws.map(j => j.length));
        this.maxHeight = Math.max(...this.throws.map(j => Math.max(...j)));
        this.numObjects = sum(this.throws.map(sum)) / this.period;
        if (this.numObjects % 1 !== 0) {
            this.errorMessage = 'Invalid pattern average';
            return false;
        }

        // `check` stores the number of throws which should land for beat
        const check = this.throws.map(j => j.length);
        const state = new Array(this.maxHeight).fill(0);
        for (let i = 0; i < this.period; i++) {
            for (const th of this.throws[i]) {
                const landTime = (i + th) % this.period;
                // Check landing position
                if (check[landTime] === 0) {
                    this.errorMessage = `Collision at time ${landTime}`;
                    return false;
                }
                check[landTime]--;
                // Add to state, first at original land time, ignoring those landing before the end of the siteswap

                for (let curTime = i + th - this.period; curTime >= 0; curTime -= this.period) {
                    state[curTime]++;
                }
            }
        }
        this.state = new VanillaState(state);
        this.isValid = true;
        return true;
    }

    toString() {
        return this.throws.map(th => th.length === 1 ? intToSS(th[0]) : '[' + th.map(intToSS).join('') + ']').join('');
    }

    static Parse(input: string) {
        let multiplex = false;
        let throws: number[][] = [];
        let multiplexThrows: number[] = [];
        for (const i of input.replace(/ /g, '')) {
            if (i == '[') {
                multiplex = true;
                multiplexThrows = [];
            } else if (multiplex && i == ']') {
                multiplex = false;
                throws.push(multiplexThrows);
            } else if (multiplex) {
                multiplexThrows.push(ssToInt(i));
            } else {
                throws.push([ssToInt(i)]);
            }
        }
        return new VanillaSiteswap(throws);;
    }
}
