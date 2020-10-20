import { toLetter, fromLetter, intToSS, floatToSS, ssToInt, ssToFloat, fixFraction, Hand, Throw, JugglerBeat, JugglerBeats } from "../src/common";

import * as mocha from 'mocha';
import * as chai from 'chai';

const expect = chai.expect;

describe('Conversions', function() {
    describe('toLetter', function() {
        it('0 goes to a', function() {
            expect(toLetter(0, 'a')).equal('a');
        }); 
        it('25 goes to z', function() {
            expect(toLetter(25, 'a')).equal('z');
        }); 
        it('14 goes to O', function() {
            expect(toLetter(14, 'A')).equal('O');
        }); 
    });

    describe('fromLetter', function() {
        it('a goes to 0', function() {
            expect(fromLetter('a', 'a')).equal(0);
        }); 
        it('z goes to 25', function() {
            expect(fromLetter('z', 'a')).equal(25);
        }); 
        it('O goes to 14', function() {
            expect(fromLetter('O', 'A')).equal(14);
        }); 
    });

    describe('intToSS', function() {
        it('0 goes to 0', function() {
            expect(intToSS(0)).equal('0');
        }); 
        it('10 goes to a', function() {
            expect(intToSS(10)).equal('a');
        }); 
        it('35 goes to z', function() {
            expect(intToSS(35)).equal('z');
        }); 
        it('36 fails', function() {
            expect(() => intToSS(36)).to.throw();
        }); 
    });

    describe('floatToSS', function() {
        it('No decimal places', function() {
            expect(floatToSS(0)).equal('0');
            expect(floatToSS(10)).equal('a');
        }); 
        it('One decimal place', function() {
            expect(floatToSS(5.5)).equal('5.5');
            expect(floatToSS(10.5)).equal('a.5');
        }); 
        it('Two decimal places', function() {
            expect(floatToSS(9.33)).equal('9.33');
            expect(floatToSS(15.16)).equal('f.16');
        }); 
        it('Over 2 decimal places rounds', function() {
            expect(floatToSS(5.777)).equal('5.78');
            expect(floatToSS(9.999)).equal('a');
            expect(floatToSS(10.333)).equal('a.33');
        }); 
        it('35.999 fails', function() {
            expect(() => floatToSS(35.999)).to.throw();
        }); 
    });

    describe('ssToInt', function() {
        it('0 goes to 0', function() {
            expect(ssToInt('0')).equal(0);
        }); 
        it('a goes to 10', function() {
            expect(ssToInt('a')).equal(10);
        }); 
        it('z goes to 35', function() {
            expect(ssToInt('z')).equal(35);
        }); 
        it('Non lowercase/numbers fail', function() {
            expect(() => ssToInt('.')).to.throw();
            expect(() => ssToInt('A')).to.throw();
            expect(() => ssToInt(' ')).to.throw();
        }); 
        it('Strings over length 1 fail', function() {
            expect(() => ssToInt('1 ')).to.throw();
            expect(() => ssToInt('23')).to.throw();
        }); 
    });

    describe('ssToFloat', function() {
        it('No decimal places', function() {
            expect(ssToFloat('0')).equal(0);
            expect(ssToFloat('a')).equal(10);
        }); 
        it('One decimal place', function() {
            expect(ssToFloat('5.5')).equal(5.5);
            expect(ssToFloat('a.5')).equal(10.5);
        }); 
        it('Two decimal places', function() {
            expect(ssToFloat('9.33')).equal(9.33);
            expect(ssToFloat('f.16')).equal(15.16);
        }); 
        it('Bad decimals fail', function() {
            expect(() => ssToFloat('.3')).to.throw();
            expect(() => ssToFloat('3.')).to.throw();
            expect(() => ssToFloat('1.2.3')).to.throw();
        }); 
    });

    describe('fixFraction', function() {
        it('Whole numbers are not changed', function() {
            for (let i = 0; i < 36; i++) {
                expect(fixFraction(i)).equal(i);
            }
        });
        it('.3 goes to 1/3 when allowed', function() {
            expect(fixFraction(10.3, true)).equal(10 + 1/3);
        });
        it('.3 does not go to 1/3 when not allowed', function() {
            expect(fixFraction(10.3)).equal(10.3);
        });
        it('.6 goes to 2/3 when allowed', function() {
            expect(fixFraction(10.6, true)).equal(10 + 2/3);
        });
        it('.6 does not go to 2/3 when not allowed', function() {
            expect(fixFraction(1.6)).equal(1.6);
        });
        it('.16 goes to 1/6', function() {
            expect(fixFraction(1.16)).equal(1 + 1/6);
        });
        it('.66 goes to 2/3', function() {
            expect(fixFraction(1.66)).equal(1 + 2/3);
        });
        it('.44 goes to 4/9', function() {
            expect(fixFraction(1.44)).equal(1 + 4/9);
        });
        it('.47 remains unchanged', function() {
            expect(fixFraction(1.47)).equal(1.47);
        });
    });
});

describe('Throw', function() {
    it('Throw instance with an x', function() {
        const th = new Throw(5, true, false);
        expect(th.height).equal(5);
        expect(th.origHeight).equal(5);
        expect(th.x).equal(true);
        expect(th.pass).equal(false);
        expect(th.passTo).equal(undefined);
        expect(th.toString()).equal('5x');
    });

    it('Throw instance with a relative pass', function() {
        const th = new Throw(10, false, true);
        expect(th.height).equal(10);
        expect(th.origHeight).equal(10);
        expect(th.x).equal(false);
        expect(th.pass).equal(true);
        expect(th.passTo).equal(undefined);
        expect(th.toString()).equal('ap');
    });

    it('Throw instance with a fractional crossing absolute pass', function() {
        const th = new Throw(4.33, true, true, 3);
        expect(th.height).equal(4+1/3);
        expect(th.origHeight).equal(4.33);
        expect(th.x).equal(true);
        expect(th.pass).equal(true);
        expect(th.passTo).equal(3);
        expect(th.toString()).equal('4.33pxD');
    });
});

describe('JugglerBeat', function() {
    it('Async beat', function() {
        const beat = new JugglerBeat([new Throw(5, false, false)], []);
        expect(beat.isAsync()).equal(true);
        expect(beat.isSync()).equal(false);
        expect(beat.isEmpty()).equal(false);
        expect(beat.hasMultiplex()).equal(false);
        expect(beat.hasPass()).equal(false);
        expect(beat.toString(Hand.Left)).equal('5');
    });

    it('Sync beat', function() {
        const beat = new JugglerBeat(
            [new Throw(6, true, false)],
            [new Throw(4, false, false)]);
        expect(beat.isAsync()).equal(false);
        expect(beat.isSync()).equal(true);
        expect(beat.isEmpty()).equal(false);
        expect(beat.hasMultiplex()).equal(false);
        expect(beat.hasPass()).equal(false);
        expect(beat.toString(Hand.Right)).equal('(6x,4)');
    });

    it('Empty beat', function() {
        const beat = new JugglerBeat([], []);
        expect(beat.isAsync()).equal(false);
        expect(beat.isSync()).equal(false);
        expect(beat.isEmpty()).equal(true);
        expect(beat.hasMultiplex()).equal(false);
        expect(beat.hasPass()).equal(false);
        expect(beat.toString(Hand.Left)).equal('');
    });

    it('Multiplex sync beat', function() {
        const beat = new JugglerBeat(
            [new Throw(8, false, false),
            new Throw(4, false, false)],
            [new Throw(10, false, false),
            new Throw(6, false, false)]);
        expect(beat.isAsync()).equal(false);
        expect(beat.isSync()).equal(true);
        expect(beat.isEmpty()).equal(false);
        expect(beat.hasMultiplex()).equal(true);
        expect(beat.hasPass()).equal(false);
        expect(beat.toString(Hand.Left)).equal('([84],[a6])');
    });

    it('Beat with pass', function() {
        const beat = new JugglerBeat([new Throw(5, false, true, 1)], []);
        expect(beat.isAsync()).equal(true);
        expect(beat.isSync()).equal(false);
        expect(beat.isEmpty()).equal(false);
        expect(beat.hasMultiplex()).equal(false);
        expect(beat.hasPass()).equal(true);
        expect(beat.toString(Hand.Left)).equal('5pB');
    });

    it('Flip', function() {
        const beat = new JugglerBeat(
            [new Throw(6, true, false)],
            [new Throw(4, false, false)]);
        const flipped = beat.flip();
        expect(beat.toString(Hand.Left)).equal('(6x,4)');
        expect(flipped.toString(Hand.Left)).equal('(4,6x)');
    });

    it('Next hand', function() {
        const beat = new JugglerBeat([new Throw(5, false, false)], []);
        expect(beat.toString(Hand.Left)).equal('5');
        expect(beat.toString(Hand.Right)).equal('L5');
        const flipped = beat.flip();
        expect(flipped.toString(Hand.Left)).equal('R5');
        expect(flipped.toString(Hand.Right)).equal('5');
    });
});

describe('JugglerBeats', function() {
    it('All JugglerBeat constructor', function() {
        const beat1 = new JugglerBeat([], [new Throw(9, false, false)]);
        const beat2 = new JugglerBeat([new Throw(7, false, false)], []);
        const beat3 = new JugglerBeat([], [new Throw(5, false, false)]);
        const beats = new JugglerBeats([beat1, beat2, beat3]);
        expect(beats.toString()).equal('975');
    });

    it('Repeat flipped', function() {
        const beat1 = new JugglerBeat(
            [new Throw(6, true, false)],
            [new Throw(4, false, false)]);
        const beat2 = new JugglerBeat([], []);
        const beats = new JugglerBeats([beat1, beat2], true);
        expect(beats.beats.length).equal(4);
        expect(beats.toString()).equal('(6x,4)(4,6x)');
    });

    it('Flipping', function() {
        const beat1 = new JugglerBeat(
            [new Throw(6, false, false)],
            [new Throw(4, false, false)]);
        const beat2 = new JugglerBeat([], []);
        const beats = new JugglerBeats([beat1, beat2]);
        expect(beats.toString()).equal('(6,4)');
        expect(beats.flip().toString()).equal('(4,6)');
    });

    it('Auto-placement of raw Throws onto side - after RH', function() {
        const beat1 = new JugglerBeat([], [new Throw(9, false, false)]);
        const beat2 = [new Throw(7, false, false)];
        const beat3 = [new Throw(5, false, false)];
        const beats = new JugglerBeats([beat1, beat2, beat3]);
        expect(beats.beats[1].RH.length).equal(0);
        expect(beats.beats[1].LH).equal(beat2);
        expect(beats.beats[2].RH).equal(beat3);
        expect(beats.beats[2].LH.length).equal(0);
        expect(beats.toString()).equal('975');
    });

    it('Auto-placement of raw Throws onto side - after LH', function() {
        const beat1 = new JugglerBeat([new Throw(9, false, false)], []);
        const beat2 = [new Throw(7, false, false)];
        const beat3 = [new Throw(5, false, false)];
        const beats = new JugglerBeats([beat1, beat2, beat3]);
        expect(beats.beats[1].RH).equal(beat2);
        expect(beats.beats[1].LH.length).equal(0);
        expect(beats.beats[2].RH.length).equal(0);
        expect(beats.beats[2].LH).equal(beat3);
        expect(beats.toString()).equal('L975');
    });

    it('Auto-placement of raw Throws onto side - after sync', function() {
        const beat1 = new JugglerBeat(
            [new Throw(6, false, false)],
            [new Throw(4, false, false)]);
        const beat2 = [new Throw(5, false, false)];
        const beats = new JugglerBeats([beat1, beat2]);
        expect(beats.beats[1].RH).equal(beat2);
        expect(beats.beats[1].LH.length).equal(0);
        expect(beats.toString()).equal('(6,4)!5');
    });

    it('Auto-placement of raw Throws onto side - after empty', function() {
        const beat1 = new JugglerBeat(
            [new Throw(6, false, false)],
            [new Throw(4, false, false)]);
        const beat2 = new JugglerBeat([], []);
        const beat3 = [new Throw(5, false, false)];
        const beats = new JugglerBeats([beat1, beat2, beat3]);
        expect(beats.beats[2].RH).equal(beat3);
        expect(beats.beats[2].LH.length).equal(0);
        expect(beats.toString()).equal('(6,4)5');
    });

    it('Empty beat at start toString', function() {
        const beat1 = new JugglerBeat([], []);
        const beats = new JugglerBeats([beat1]);
        expect(beats.toString()).equal('(0,0)!');
    });

    it('Empty beat after async toString', function() {
        const beat1 = new JugglerBeat([], [new Throw(4, false, false)]);
        const beat2 = new JugglerBeat([], []);
        const beats = new JugglerBeats([beat1, beat2]);
        expect(beats.toString()).equal('4(0,0)!');
    });

    it('Double empty beat', function() {
        const beat1 = new JugglerBeat([], []);
        const beats = new JugglerBeats([beat1, beat1]);
        expect(beats.toString()).equal('(0,0)');
    });

    it('Triple empty beat', function() {
        const beat1 = new JugglerBeat([], []);
        const beats = new JugglerBeats([beat1, beat1, beat1]);
        expect(beats.toString()).equal('(0,0)(0,0)!');
    });

    it('Missing empty beat toString', function() {
        const beat1 = new JugglerBeat(
            [new Throw(6, false, false)],
            [new Throw(4, false, false)]);
        const beat2 = new JugglerBeat([], []);
        const beats = new JugglerBeats([beat1, beat1, beat2]);
        expect(beats.toString()).equal('(6,4)!(6,4)');
    });

    it('Missing empty beat at end toString', function() {
        const beat1 = new JugglerBeat(
            [new Throw(6, false, false)],
            [new Throw(4, false, false)]);
        const beats = new JugglerBeats([beat1]);
        expect(beats.toString()).equal('(6,4)!');
    });

    it('Explicit hand toString - after LH', function() {
        const beat1 = new JugglerBeat([], [new Throw(4, false, false)]);
        const beat2 = new JugglerBeat([new Throw(4, false, false)], []);
        const beats = new JugglerBeats([beat1, beat2, beat2]);
        expect(beats.toString()).equal('44L4');
    });
    
    it('Explicit hand toString - after RH', function() {
        const beat1 = new JugglerBeat([], [new Throw(4, false, false)]);
        const beats = new JugglerBeats([beat1, beat1]);
        expect(beats.toString()).equal('4R4');
    });
    
    it('Explicit hand toString - after empty', function() {
        const th4 = [new Throw(4, false, false)];
        const beat1 = new JugglerBeat(th4, th4);
        const beat2 = new JugglerBeat([], []);
        const beat3 = new JugglerBeat(th4, []);
        const beats = new JugglerBeats([beat1, beat2, beat3]);
        expect(beats.toString()).equal('(4,4)L4');
    });

    it('Explicit hand toString - after sync', function() {
        const th4 = [new Throw(4, false, false)];
        const beat1 = new JugglerBeat(th4, th4);
        const beat2 = new JugglerBeat(th4, []);
        const beats = new JugglerBeats([beat1, beat2]);
        expect(beats.toString()).equal('(4,4)!L4');
    });
});
