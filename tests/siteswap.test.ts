import Siteswap from "../src/siteswap";

import * as mocha from 'mocha';
import * as chai from 'chai';

const expect = chai.expect;

describe('Siteswap examples', function() {
    describe('Validation and basic info', function() {
        it('97531', function() {
            const ss = Siteswap.Parse('97531');
            expect(ss.errorMessage).equals('');
            expect(ss.isValid).equals(true);
            expect(ss.numJugglers).equals(1);
            expect(ss.numObjects).equals(5);
            expect(ss.period).equals(5);
            expect(ss.maxHeight).equals(9);
            expect(ss.toString()).equals('97531');
        });

        it('123456789', function() {
            const ss = Siteswap.Parse('123456789');
            expect(ss.errorMessage).equals('');
            expect(ss.isValid).equals(true);
            expect(ss.numJugglers).equals(1);
            expect(ss.numObjects).equals(5);
            expect(ss.period).equals(9);
            expect(ss.maxHeight).equals(9);
            expect(ss.toString()).equals('123456789');
        });

        it('b 0  1', function() {
            const ss = Siteswap.Parse('b 0  1');
            expect(ss.errorMessage).equals('');
            expect(ss.isValid).equals(true);
            expect(ss.numJugglers).equals(1);
            expect(ss.numObjects).equals(4);
            expect(ss.period).equals(3);
            expect(ss.maxHeight).equals(11);
            expect(ss.toString()).equals('b01');
        });

        it('432 - collision', function() {
            const ss = Siteswap.Parse('432');
            expect(ss.isValid).equals(false);
            expect(ss.errorMessage).equals('Collision at juggler 0, time 1, hand 1');
        });

        it('443 - invalid average', function() {
            const ss = Siteswap.Parse('443');
            expect(ss.isValid).equals(false);
            expect(ss.errorMessage).equals('Invalid pattern average');
        });

        it('ABC - parse error', function() {
            expect(() => Siteswap.Parse('ABC')).to.throw();
        });

        it('[43]23', function() {
            const ss = Siteswap.Parse('[43]23');
            expect(ss.errorMessage).equals('');
            expect(ss.isValid).equals(true);
            expect(ss.numJugglers).equals(1);
            expect(ss.numObjects).equals(4);
            expect(ss.period).equals(3);
            expect(ss.maxHeight).equals(4);
            expect(ss.toString()).equals('[43]23');
        });

        it('[12345]', function() {
            const ss = Siteswap.Parse('[12345]');
            expect(ss.errorMessage).equals('');
            expect(ss.isValid).equals(true);
            expect(ss.numJugglers).equals(1);
            expect(ss.numObjects).equals(15);
            expect(ss.period).equals(1);
            expect(ss.maxHeight).equals(5);
            expect(ss.toString()).equals('[12345]');
        });

        it('(6,4)(6x,4)*', function() {
            const ss = Siteswap.Parse('(6,4)(6x,4)*');
            expect(ss.errorMessage).equals('');
            expect(ss.isValid).equals(true);
            expect(ss.numJugglers).equals(1);
            expect(ss.numObjects).equals(5);
            expect(ss.period).equals(8);
            expect(ss.maxHeight).equals(6);
            expect(ss.toString()).equals('(6,4)(6x,4)(4,6)(4,6x)');
        });

        it('([44x], 2)*', function() {
            const ss = Siteswap.Parse('([44x], 2)*');
            expect(ss.errorMessage).equals('');
            expect(ss.isValid).equals(true);
            expect(ss.numJugglers).equals(1);
            expect(ss.numObjects).equals(5);
            expect(ss.period).equals(4);
            expect(ss.maxHeight).equals(4);
            expect(ss.toString()).equals('([44x],2)(2,[44x])');
        });

        it('(4,4)!', function() {
            const ss = Siteswap.Parse('(4,4)!');
            expect(ss.errorMessage).equals('');
            expect(ss.isValid).equals(true);
            expect(ss.numJugglers).equals(1);
            expect(ss.numObjects).equals(8);
            expect(ss.period).equals(1);
            expect(ss.maxHeight).equals(4);
            expect(ss.toString()).equals('(4,4)!');
        });

        it('3R3x*', function() {
            const ss = Siteswap.Parse('3R3x*');
            expect(ss.errorMessage).equals('');
            expect(ss.isValid).equals(true);
            expect(ss.numJugglers).equals(1);
            expect(ss.numObjects).equals(3);
            expect(ss.period).equals(4);
            expect(ss.maxHeight).equals(3);
            expect(ss.toString()).equals('3R3x3L3x');
        });

        it('4444  3x4x3  (4,4)(4,4)(4,4)  (4,3x)(4,3x)!', function() {
            const ss = Siteswap.Parse('4444  3x4x3  (4,4)(4,4)(4,4)  (4,3x)(4,3x)!');
            expect(ss.errorMessage).equals('');
            expect(ss.isValid).equals(true);
            expect(ss.numJugglers).equals(1);
            expect(ss.numObjects).equals(4);
            expect(ss.period).equals(16);
            expect(ss.maxHeight).equals(4);
            expect(ss.toString()).equals('44443x4x3(4,4)(4,4)(4,4)(4,3x)(4,3x)!');
        });

        it('<3>', function() {
            const ss = Siteswap.Parse('<3>');
            expect(ss.errorMessage).equals('');
            expect(ss.isValid).equals(true);
            expect(ss.numJugglers).equals(1);
            expect(ss.numObjects).equals(3);
            expect(ss.period).equals(1);
            expect(ss.maxHeight).equals(3);
            expect(ss.toString()).equals('3');
        });

        it('Basic passing <4p3|L34p>', function() {
            const ss = Siteswap.Parse('<4p3|L34p>');
            expect(ss.errorMessage).equals('');
            expect(ss.isValid).equals(true);
            expect(ss.numJugglers).equals(2);
            expect(ss.numObjects).equals(7);
            expect(ss.period).equals(2);
            expect(ss.maxHeight).equals(4);
            expect(ss.toString()).equals('<4p3|L34p>');
        });

        it('Relative passes <3p33 | 3p33 | 3p33>', function() {
            const ss = Siteswap.Parse('<3p33 | 3p33 | 3p33>');
            expect(ss.errorMessage).equals('');
            expect(ss.isValid).equals(true);
            expect(ss.numJugglers).equals(3);
            expect(ss.numObjects).equals(9);
            expect(ss.period).equals(3);
            expect(ss.maxHeight).equals(3);
            expect(ss.toString()).equals('<3p33|3p33|3p33>');
        });

        it('Absolute passes <3pC33 | 3pA33 | 3pB33>', function() {
            const ss = Siteswap.Parse('<3pC33 | 3pA33 | 3pB33>');
            expect(ss.errorMessage).equals('');
            expect(ss.isValid).equals(true);
            expect(ss.numJugglers).equals(3);
            expect(ss.numObjects).equals(9);
            expect(ss.period).equals(3);
            expect(ss.maxHeight).equals(3);
            expect(ss.toString()).equals('<3pC33|3pA33|3pB33>');
        });

        it('Delays {0,1}<4p3|4p3>', function() {
            const ss = Siteswap.Parse('{0,1}<4p3|4p3>');
            expect(ss.errorMessage).equals('');
            expect(ss.isValid).equals(true);
            expect(ss.numJugglers).equals(2);
            expect(ss.numObjects).equals(7);
            expect(ss.period).equals(2);
            expect(ss.maxHeight).equals(4);
            expect(ss.toString()).equals('{0,1}<4p3|4p3>');
        });

        it('Fractional passes {0,0.5} <3.5p|3.5px>', function() {
            const ss = Siteswap.Parse('{0,0.5} <3.5p|3.5px>');
            expect(ss.errorMessage).equals('');
            expect(ss.isValid).equals(true);
            expect(ss.numJugglers).equals(2);
            expect(ss.numObjects).equals(7);
            expect(ss.period).equals(1);
            expect(ss.maxHeight).equals(3.5);
            expect(ss.toString()).equals('{0,0.5}<3.5p|3.5px>');
        });

        it('Weird fractional passes {0,0.3} <3.3p|3.7px>', function() {
            const ss = Siteswap.Parse('{0,0.3} <3.3p|3.7px>');
            expect(ss.errorMessage).equals('');
            expect(ss.isValid).equals(true);
            expect(ss.numJugglers).equals(2);
            expect(ss.numObjects).equals(7);
            expect(ss.period).equals(1);
            expect(ss.maxHeight).equals(3.7);
            expect(ss.toString()).equals('{0,0.3}<3.3p|3.7px>');
        });

        it('Fractional passes 3 jugglers {0,0.3,0.6}<3.3p3|3.3p3|4.3p3>', function() {
            const ss = Siteswap.Parse('{0,0.3,0.6}<3.3p3|3.3p3|4.3p3>');
            expect(ss.errorMessage).equals('');
            expect(ss.isValid).equals(true);
            expect(ss.numJugglers).equals(3);
            expect(ss.numObjects).equals(10);
            expect(ss.period).equals(2);
            expect(ss.maxHeight).equals(4+1/3);
            expect(ss.toString()).equals('{0,0.3,0.6}<3.3p3|3.3p3|4.3p3>');
        });

        it('Sync passing <(4p,4x)|(4p,4x)>', function() {
            const ss = Siteswap.Parse('<(4p,4x)|(4p,4x)>');
            expect(ss.errorMessage).equals('');
            expect(ss.isValid).equals(true);
            expect(ss.numJugglers).equals(2);
            expect(ss.numObjects).equals(8);
            expect(ss.period).equals(2);
            expect(ss.maxHeight).equals(4);
            expect(ss.toString()).equals('<(4p,4x)|(4p,4x)>');
        });

        it('Collision {0,0.5}<3.5px|3.5p>', function() {
            const ss = Siteswap.Parse('{0,0.5}<3.5px|3.5p>');
            expect(ss.errorMessage).equals('Collision at juggler 1, time 0, hand 1');
            expect(ss.isValid).equals(false);
        });

        it('Invalid fraction {0,0.5}<3.2px|3.8p>', function() {
            const ss = Siteswap.Parse('{0,0.5}<3.2px|3.8p>');
            expect(ss.errorMessage).equals('Throw 3.2 lands at an invalid time for juggler 1');
            expect(ss.isValid).equals(false);
        });

        it('Collision <3pA|3pA>', function() {
            const ss = Siteswap.Parse('<3pA|3pA>');
            expect(ss.errorMessage).equals('Collision at juggler 0, time 0, hand 0');
            expect(ss.isValid).equals(false);
        });

        it('Different periods <3p3|3p>', function() {
            const ss = Siteswap.Parse('<3p3|3p>');
            expect(ss.errorMessage).equals('Mismatching juggler periods');
            expect(ss.isValid).equals(false);
        });

        it('Pass to nonexistent juggler <3pC|3p>', function() {
            const ss = Siteswap.Parse('<3pC|3p>');
            expect(ss.errorMessage).equals('Invalid juggler C, there are only 2 jugglers');
            expect(ss.isValid).equals(false);
        });

        it('Mismatched delays {0}<3p|3p>', function() {
            const ss = Siteswap.Parse('{0}<3p|3p>');
            expect(ss.errorMessage).equals('Number of jugglers (2) not equal to number of delays (1)');
            expect(ss.isValid).equals(false);
        });

        it('No juggers', function() {
            const ss = new Siteswap([]);
            expect(ss.errorMessage).equals('No jugglers');
            expect(ss.isValid).equals(false);
        });

    });
});

describe('Siteswap manipulations', function() {
    it('Flip', function() {
        const ss = Siteswap.Parse('<(6,4)|(2,8)>');
        expect(ss.flip().toString()).equal('<(4,6)|(8,2)>');
    });
});

describe('Siteswap state calculations', function() {
    it('State of 97531', function() {
        const ss = Siteswap.Parse('97531');
        expect(ss.state.toString()).equal('11111');
        expect(ss.state.numObjects).equal(5);
        expect(ss.state.numJugglers).equal(1);
        expect(ss.state.isGround).equal(true);
    });

    it('State of 15', function() {
        const ss = Siteswap.Parse('15');
        expect(ss.state.toString()).equal('10101');
        expect(ss.state.numObjects).equal(3);
        expect(ss.state.isGround).equal(false);
    });

    it('State of 00555', function() {
        const ss = Siteswap.Parse('00555');
        expect(ss.state.toString()).equal('00111');
        expect(ss.state.numObjects).equal(3);
        expect(ss.state.isGround).equal(false);
    });

    it('State of L00555', function() {
        const ss = Siteswap.Parse('L00555');
        expect(ss.state.toString()).equal('00111');
        expect(ss.state.numObjects).equal(3);
        expect(ss.state.isGround).equal(false);
    });

    it('State of [43]23', function() {
        const ss = Siteswap.Parse('[43]23');
        expect(ss.state.toString()).equal('211');
        expect(ss.state.numObjects).equal(4);
        expect(ss.state.isGround).equal(false);
    });

    it('State of (4,4)', function() {
        const ss = Siteswap.Parse('(4,4)');
        expect(ss.state.toString()).equal('(1,1)(0,0)(1,1)');
        expect(ss.state.numObjects).equal(4);
        expect(ss.state.isGround).equal(false);
    });

    it('State of (4,0)!', function() {
        const ss = Siteswap.Parse('(4,0)!');
        expect(ss.state.toString()).equal('(1,0)(1,0)(1,0)(1,0)');
        expect(ss.state.numObjects).equal(4);
        expect(ss.state.isGround).equal(false);
    });

    it('State of 3R3x*', function() {
        const ss = Siteswap.Parse('3R3x*');
        expect(ss.state.toString()).equal('(0,1)(0,1)(1,0)');
        expect(ss.state.numObjects).equal(3);
        expect(ss.state.isGround).equal(false);
    });

    it('State of <3p3|3p3>', function() {
        const ss = Siteswap.Parse('<3p3|3p3>');
        expect(ss.state.toString()).equal('<111|111>');
        expect(ss.state.numObjects).equal(6);
        expect(ss.state.isGround).equal(true);
    });

    it('State of <2|4> should not be ground', function() {
        const ss = Siteswap.Parse('<2|4>');
        expect(ss.state.toString()).equal('<11|1111>');
        expect(ss.state.numObjects).equal(6);
        expect(ss.state.isGround).equal(false);
    });

    it('State of {0,0.5}<3.5p|3.5px> should be ground', function() {
        const ss = Siteswap.Parse('{0,0.5}<3.5p|3.5px>');
        expect(ss.state.toString()).equal('<1111|111>');
        expect(ss.state.numObjects).equal(7);
        expect(ss.state.isGround).equal(true);
    });

});
