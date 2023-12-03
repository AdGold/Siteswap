import { VanillaSiteswap, VanillaState } from '../src/vanilla-siteswap';

import * as chai from 'chai';

const expect = chai.expect;

describe('VanillaSiteswap examples', () => {
    describe('Validation and basic info', () => {
        it('97531', () => {
            const ss = VanillaSiteswap.Parse('97531');
            expect(ss.errorMessage).equals('');
            expect(ss.isValid).equals(true);
            expect(ss.numObjects).equals(5);
            expect(ss.period).equals(5);
            expect(ss.maxHeight).equals(9);
            expect(ss.toString()).equals('97531');
        });

        it('123456789', () => {
            const ss = VanillaSiteswap.Parse('123456789');
            expect(ss.errorMessage).equals('');
            expect(ss.isValid).equals(true);
            expect(ss.numObjects).equals(5);
            expect(ss.period).equals(9);
            expect(ss.maxHeight).equals(9);
            expect(ss.maxMultiplex).equals(1);
            expect(ss.toString()).equals('123456789');
        });

        it('b 0  1', () => {
            const ss = VanillaSiteswap.Parse('b 0  1');
            expect(ss.errorMessage).equals('');
            expect(ss.isValid).equals(true);
            expect(ss.numObjects).equals(4);
            expect(ss.period).equals(3);
            expect(ss.maxHeight).equals(11);
            expect(ss.maxMultiplex).equals(1);
            expect(ss.toString()).equals('b01');
        });

        it('432 - collision', () => {
            const ss = VanillaSiteswap.Parse('432');
            expect(ss.isValid).equals(false);
            expect(ss.errorMessage).equals('Collision at time 1');
        });

        it('443 - invalid average', () => {
            const ss = VanillaSiteswap.Parse('443');
            expect(ss.isValid).equals(false);
            expect(ss.errorMessage).equals('Invalid pattern average');
        });

        it('ABC - parse error', () => {
            expect(() => VanillaSiteswap.Parse('ABC')).to.throw();
        });

        it('x1 - valid', () => {
            const ss = VanillaSiteswap.Parse('x1');
            expect(ss.errorMessage).equals('');
            expect(ss.isValid).equals(true);
            expect(ss.numObjects).equals(17);
            expect(ss.period).equals(2);
            expect(ss.maxHeight).equals(33);
            expect(ss.maxMultiplex).equals(1);
            expect(ss.toString()).equals('x1');
        });

        it('1x - valid', () => {
            const ss = VanillaSiteswap.Parse('1x');
            expect(ss.errorMessage).equals('');
            expect(ss.isValid).equals(true);
            expect(ss.numObjects).equals(17);
            expect(ss.period).equals(2);
            expect(ss.maxHeight).equals(33);
            expect(ss.maxMultiplex).equals(1);
            expect(ss.toString()).equals('1x');
        });

        it('[43]23', () => {
            const ss = VanillaSiteswap.Parse('[43]23');
            expect(ss.errorMessage).equals('');
            expect(ss.isValid).equals(true);
            expect(ss.numObjects).equals(4);
            expect(ss.period).equals(3);
            expect(ss.maxHeight).equals(4);
            expect(ss.maxMultiplex).equals(2);
            expect(ss.toString()).equals('[43]23');
        });

        it('[12345]', () => {
            const ss = VanillaSiteswap.Parse('[12345]');
            expect(ss.errorMessage).equals('');
            expect(ss.isValid).equals(true);
            expect(ss.numObjects).equals(15);
            expect(ss.period).equals(1);
            expect(ss.maxHeight).equals(5);
            expect(ss.maxMultiplex).equals(5);
            expect(ss.toString()).equals('[12345]');
        });
    });
    describe('Stack notation conversion', () => {
        it('Siteswap -> stack: 531 -> 321', () => {
            const ss = VanillaSiteswap.Parse('531');
            expect(ss.toStackString()).equals('321');
        });

        it('Siteswap -> stack: b01 -> 401', () => {
            const ss = VanillaSiteswap.Parse('b01');
            expect(ss.toStackString()).equals('401');
        });

        it('Siteswap -> stack: complex', () => {
            const ss = VanillaSiteswap.Parse('638257149');
            expect(ss.toStackString()).equals('435245145');
        });

        it('Siteswap -> stack: multiplex', () => {
            const ss = VanillaSiteswap.Parse('[43]23');
            expect(() => ss.toStack()).to.throw();
        });

        it('Stack -> siteswap: 321 -> 531', () => {
            const ss = VanillaSiteswap.ParseStack('321');
            expect(ss.toString()).equals('531');
            expect(ss.toStackString()).equals('321');
        });

        it('Stack -> siteswap: 401 -> b01', () => {
            const ss = VanillaSiteswap.ParseStack('  4     01 ');
            expect(ss.toString()).equals('b01');
            expect(ss.toStackString()).equals('401');
        });

        it('Stack -> siteswap: over 10', () => {
            const ss = VanillaSiteswap.ParseStack('zz');
            expect(ss.toString()).equals('zz');
            expect(ss.toStackString()).equals('zz');
        });

        it('Stack -> siteswap: complex', () => {
            const ss = VanillaSiteswap.ParseStack('435245145');
            expect(ss.toString()).equals('638257149');
            expect(ss.toStackString()).equals('435245145');
        });

        it('Stack -> siteswap: invalid', () => {
            expect(() => VanillaSiteswap.ParseStack('[43]23')).to.throw();
        });
    });
});

describe('VanillaSiteswap state calculations', () => {
    it('State of 97531', () => {
        const ss = VanillaSiteswap.Parse('97531');
        expect(ss.state.toString()).equal('11111');
        expect(ss.state.numObjects).equal(5);
        expect(ss.state.isGround).equal(true);
    });

    it('State of 15', () => {
        const ss = VanillaSiteswap.Parse('15');
        expect(ss.state.toString()).equal('10101');
        expect(ss.state.numObjects).equal(3);
        expect(ss.state.isGround).equal(false);
    });

    it('State of 801', () => {
        const ss = VanillaSiteswap.Parse('801');
        expect(ss.state.toString()).equal('101001');
        expect(ss.state.numObjects).equal(3);
        expect(ss.state.isGround).equal(false);
    });

    it('State of b01', () => {
        const ss = VanillaSiteswap.Parse('b01');
        expect(ss.state.toString()).equal('101001001');
        expect(ss.state.numObjects).equal(4);
        expect(ss.state.isGround).equal(false);
    });

    it('State of 00555', () => {
        const ss = VanillaSiteswap.Parse('00555');
        expect(ss.state.toString()).equal('00111');
        expect(ss.state.numObjects).equal(3);
        expect(ss.state.isGround).equal(false);
    });

    it('State of [43]23', () => {
        const ss = VanillaSiteswap.Parse('[43]23');
        expect(ss.state.toString()).equal('211');
        expect(ss.state.numObjects).equal(4);
        expect(ss.state.isGround).equal(false);
    });

});

describe('VanillaState', () => {
    describe('Basic state tests', () => {
        it('Async ground state', () => {
            const state = new VanillaState([1, 1, 1, 1, 1, 0, 0]);
            expect(state.toString()).equal('11111');
            expect(state.numObjects).equal(5);
            expect(state.isGround).equal(true);
            expect(state.maxHeight).equal(5);
        });

        it('Async excited state', () => {
            const state = new VanillaState([1, 0, 2, 0, 1]);
            expect(state.toString()).equal('10201');
            expect(state.numObjects).equal(4);
            expect(state.isGround).equal(false);
            expect(state.maxHeight).equal(5);
        });


        it('Create async ground state', () => {
            const state = VanillaState.GroundState(5);
            expect(state.toString()).equal('11111');
            expect(state.isGround).equal(true);
        });
    });

    describe('Shortest state transitions', () => {
        it('Basic transition', () => {
            const state = new VanillaState([1, 0, 1, 0, 1]);
            expect(state.entry().toString()).equal('45');
            expect(state.exit().toString()).equal('30');
        });

        it('Basic transition - custom from/to', () => {
            const state = new VanillaState([1, 0, 1, 0, 1]);
            const other = new VanillaState([1, 1, 0, 1]);
            expect(state.entry(other).toString()).equal('5');
            expect(state.exit(other).toString()).equal('1');
        });

        it('Basic transition to b01', () => {
            const state = new VanillaState([1, 0, 1, 0, 0, 1, 0, 0, 1]);
            expect(state.entry().toString()).equal('579');
            expect(state.exit().toString()).equal('60500');
        });


        it('Invalid states - mismatched number of balls', () => {
            const state1 = new VanillaState([1, 1, 1]);
            const state2 = new VanillaState([1]);
            expect(() => VanillaState.ShortestTransition(state1, state2)).to.throw();
        });

    });

    describe('All state transitions', () => {
        it('Only one transition', () => {
            const state = new VanillaState([1, 0, 1, 0, 1]);
            const other = new VanillaState([1, 1, 0, 1]);
            expect(
                Array.from(VanillaState.AllTransitionsOfLength(other, state, 1)).map(s =>
                    s.toString()
                )
            ).to.have.members(['5']);
            expect(
                Array.from(VanillaState.AllTransitionsOfLength(state, other, 1)).map(s =>
                    s.toString()
                )
            ).to.have.members(['1']);
        });

        it('Two transitions', () => {
            const state = new VanillaState([1, 0, 1, 0, 1]);
            const other = new VanillaState([1, 1, 0, 1]);
            expect(
                Array.from(VanillaState.AllTransitionsOfLength(other, state, 3)).map(s =>
                    s.toString()
                )
            ).to.have.members(['560', '740']);
            expect(
                Array.from(VanillaState.AllTransitionsOfLength(state, other, 3)).map(s =>
                    s.toString()
                )
            ).to.have.members(['304', '601']);
        });

        it('No transitions', () => {
            const state = new VanillaState([1, 0, 1, 0, 1]);
            const other = new VanillaState([1, 1, 0, 1]);
            expect(
                Array.from(VanillaState.AllTransitionsOfLength(other, state, 2)).map(s =>
                    s.toString()
                )
            ).to.have.members([]);
            expect(
                Array.from(VanillaState.AllTransitionsOfLength(state, other, 2)).map(s =>
                    s.toString()
                )
            ).to.have.members([]);
        });

        it('Invalid states - mismatched number of balls', () => {
            const state1 = new VanillaState([1, 1, 1]);
            const state2 = new VanillaState([1]);
            expect(() =>
                Array.from(VanillaState.AllTransitionsOfLength(state1, state2, 1))
            ).to.throw();
        });

    });
});
