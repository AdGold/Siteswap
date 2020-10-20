import { JugglerBeats, Hand, fixFraction, toLetter } from "./common";
import { parse } from "./parser";

export default class Siteswap {
    numObjects: number = 0;
    numJugglers: number = 0;
    period: number = 0;
    maxHeight: number = 0;

    hasMultiplex: boolean = false;
    hasSync: boolean = false;
    hasAsync: boolean = false;
    hasPass: boolean = false;

    isValid: boolean = false;
    errorMessage: string = '';

    jugglers: JugglerBeats[];
    jugglerDelays: number[];

    constructor(jugglers: JugglerBeats[], jugglerDelays?: number[]) {
        this.jugglers = jugglers;
        // Default to all delays 0
        this.jugglerDelays = jugglerDelays ? jugglerDelays : jugglers.map(j => 0);
        this.validate();
    }

    reset() {
        this.numObjects = 0;
        this.numJugglers = 0;
        this.period = 0;
        this.maxHeight = 0;

        this.hasSync = false;
        this.hasAsync = false;
        this.hasMultiplex = false;
        this.hasPass = false;

        this.isValid = false;
        this.errorMessage = '';
    }

    validate() {
        this.reset();
        this.numJugglers = this.jugglers.length;
        if (this.numJugglers == 0) {
            this.errorMessage = "No jugglers";
            return false;
        }

        this.period = this.jugglers[0].beats.length;
        if (!this.jugglers.every(juggler => juggler.beats.length == this.period)) {
            this.errorMessage = "Mismatching juggler periods";
            return false;
        }

        // Convert .3 and .6 to 1/3 and 2/3 when we have a multiple of 3 jugglers
        const allow36 = this.numJugglers % 3 === 0;
        const jugglerDelays = this.jugglerDelays.map(d => fixFraction(d, allow36));
        if (jugglerDelays.length !== this.numJugglers) {
            this.errorMessage = `Number of jugglers (${this.numJugglers}) not equal to number of delays (${jugglerDelays.length})`;
            return false;
        }

        let sum = 0;
        // First index = juggler, second index = beat, third index = hand
        const check: number[][][] = [];
        for (const juggler of this.jugglers) {
            const jcheck = []
            for (const beat of juggler.beats) {
                this.hasMultiplex = this.hasMultiplex || beat.hasMultiplex();
                this.hasSync = this.hasSync || beat.isSync();
                this.hasAsync = this.hasAsync || beat.isAsync();
                this.hasPass = this.hasPass || beat.hasPass();

                const bcheck = [];
                for (const hand of [Hand.Right, Hand.Left]) {
                    const ths = (hand == Hand.Left) ? beat.LH : beat.RH;
                    for (const th of ths) {
                        sum += th.height;
                        this.maxHeight = Math.max(this.maxHeight, th.height);
                        // Validate pass recipients
                        if (th.passTo && th.passTo >= this.numJugglers) {
                            this.errorMessage = `Invalid juggler ${toLetter(th.passTo, 'A')}, there are only ${this.numJugglers} jugglers`;
                            return false;
                        }
                    }
                    bcheck.push(ths.length);
                }
                jcheck.push(bcheck);
            }
            check.push(jcheck);
        }

        this.numObjects = sum / this.period;
        // Be a bit more lax and round if we have juggler delays
        const rounded = Math.round(this.numObjects);
        if (jugglerDelays.some(d => d != 0) && Math.abs(this.numObjects - rounded) < 1e-2) {
            this.numObjects = rounded;
        }
        if (this.numObjects % 1 !== 0) {
            this.errorMessage = "Invalid pattern average";
            return false;
        }

        const pureAsync = this.jugglers.every(juggler => juggler.beats.every(beat => beat.isAsync()));
        const shouldFlip = pureAsync && (this.period%2 === 1);
        for (let jugglerId = 0; jugglerId < this.numJugglers; jugglerId++) {
            const juggler = this.jugglers[jugglerId];
            for (let i = 0; i < this.period; i++) {
                const beat = juggler.beats[i];
                for (const hand of [Hand.Right, Hand.Left]) {
                    const ths = (hand == Hand.Left) ? beat.LH : beat.RH;
                    for (const th of ths) {
                        const landJuggler = th.pass ? (th.passTo != null ? th.passTo : ((jugglerId + 1) % this.numJugglers)) : jugglerId;
                        const fractionDiff = jugglerDelays[jugglerId] - jugglerDelays[landJuggler];
                        let fullLandTime = i + th.height + fractionDiff;
                        const rounded = Math.round(fullLandTime);
                        if (Math.abs(fullLandTime - rounded) < 1e-2) {
                            fullLandTime = rounded;
                        }
                        const landTime = fullLandTime % this.period;
                        if (landTime % 1 !== 0) {
                            this.errorMessage = `Throw ${th.origHeight} lands at an invalid time for juggler ${landJuggler}`;
                            return false;
                        }
                        // Normal throws swap hands if they're even with an x or odd with no x
                        // Passes swap hands normally ('straight') and with an x they don't ('crossing')
                        const throwSwapsHands = th.pass ? !th.x : ((th.height % 2 === 0) === th.x);
                        // We swap hands (again) if it's async & odd period and
                        // we looped around an odd number of times.  This isn't
                        // because the throw swapped hands but because the
                        // siteswap should be repeating on the other side.
                        const loops = Math.floor(fullLandTime / this.period);
                        const swapHands = throwSwapsHands !== (shouldFlip && (loops % 2 == 1));
                        const landHand = swapHands ? 1-hand : hand;
                        if (check[landJuggler][landTime][landHand] <= 0) {
                            this.errorMessage = `Collision at juggler ${landJuggler}, time ${landTime}, hand ${landHand}`;
                            return false;
                        }
                        check[landJuggler][landTime][landHand]--;
                    }
                }
            }
        }
        this.isValid = true;
        return true;
    }

    toString() {
        if (this.jugglers.length == 1) {
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

    // TODO JIF stuff
    toJIF() {
        return {};
    }

    static FromJif(jif: JSON) {
    }

    static Parse(input: string) {
        const parsed = parse(input);
        // If we have a multiple of 3 jugglers then fix and .3 and .6 throws
        if (parsed[0].length % 3 === 0) {
            for (const juggler of parsed[0]) {
                for (const beat of juggler.beats) {
                    for (const ths of [beat.LH, beat.RH]) {
                        for (const th of ths) {
                            th.height = fixFraction(th.origHeight, /*allow36=*/true);
                        }
                    }
                }
            }
        }
        return new Siteswap(parsed[0], parsed[1]);
    }

    // TODO PasreFromKHSS
}

// TODO export State;
