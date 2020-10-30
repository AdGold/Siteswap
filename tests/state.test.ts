import {Hand} from "../src/common";
import {State, JugglerState, JugglerStateBeat} from "../src/state";

import * as mocha from 'mocha';
import * as chai from 'chai';

const expect = chai.expect;

describe('JugglerStateBeat', function() {
    it('Async toString', function() {
        const beat = new JugglerStateBeat(2,0);
        expect(beat.toString(false)).equal('2');
        const beat2 = new JugglerStateBeat(0,1);
        expect(beat2.toString(false)).equal('1');
        const beat3 = new JugglerStateBeat(1,1);
        expect(() => beat3.toString(false)).to.throw();
    });

    it('Sync toString', function() {
        const beat = new JugglerStateBeat(2,0);
        expect(beat.toString(true)).equal('(2,0)');
        const beat2 = new JugglerStateBeat(1,1);
        expect(beat2.toString(true)).equal('(1,1)');
        const beat3 = new JugglerStateBeat(0,0);
        expect(beat3.toString(true)).equal('(0,0)');
    });

    it('Sync test', function() {
        const beat = new JugglerStateBeat(2,0);
        expect(beat.isSync()).equal(false);
        const beat2 = new JugglerStateBeat(1,1);
        expect(beat2.isSync()).equal(true);
    });

    it('Empty test', function() {
        const beat = new JugglerStateBeat(2,0);
        expect(beat.isEmpty()).equal(false);
        const beat2 = new JugglerStateBeat(0,0);
        expect(beat2.isEmpty()).equal(true);
    });

    it('Increment test', function() {
        const beat = new JugglerStateBeat(1,0);
        expect(beat.toString(true)).equal('(1,0)');
        beat.increment(Hand.Left);
        expect(beat.toString(true)).equal('(2,0)');
        beat.increment(Hand.Right);
        expect(beat.toString(true)).equal('(2,1)');
    });

    it('Flip test', function() {
        const beat = new JugglerStateBeat(1,0);
        expect(beat.toString(true)).equal('(1,0)');
        expect(beat.flip().toString(true)).equal('(0,1)');
    });
});

describe('JugglerStateBeat', function() {
    it('Remove trailing zeros', function() {
        const state = new JugglerState([
            new JugglerStateBeat(1,0),
            new JugglerStateBeat(1,0),
            new JugglerStateBeat(1,0),
            new JugglerStateBeat(0,0),
            new JugglerStateBeat(0,0),
        ]);
        state.removeTrailingZeros();
        expect(state.beats.length).equal(3);
    });

    it('Remove trailing zeros - all', function() {
        const state = new JugglerState([
            new JugglerStateBeat(0,0),
            new JugglerStateBeat(0,0),
            new JugglerStateBeat(0,0),
            new JugglerStateBeat(0,0),
            new JugglerStateBeat(0,0),
        ]);
        state.removeTrailingZeros();
        expect(state.beats.length).equal(0);
    });

    it('Succeeding test for pure async LH', function() {
        const state = new JugglerState([
            new JugglerStateBeat(0,0),
            new JugglerStateBeat(0,0),
            new JugglerStateBeat(1,0),
            new JugglerStateBeat(0,1),
            new JugglerStateBeat(1,0),
        ]);
        expect(state.isPureAsync()).equal(true);
    });

    it('Failing test for pure async LH', function() {
        const state = new JugglerState([
            new JugglerStateBeat(1,0),
            new JugglerStateBeat(0,0),
            new JugglerStateBeat(1,0),
            new JugglerStateBeat(0,0),
            new JugglerStateBeat(0,1),
        ]);
        expect(state.isPureAsync()).equal(false);
    });

    it('Succeeding test for pure async RH', function() {
        const state = new JugglerState([
            new JugglerStateBeat(0,0),
            new JugglerStateBeat(0,0),
            new JugglerStateBeat(0,1),
            new JugglerStateBeat(0,0),
            new JugglerStateBeat(0,1),
        ]);
        expect(state.isPureAsync()).equal(true);
    });

    it('Failing test for pure async', function() {
        const state = new JugglerState([
            new JugglerStateBeat(1,0),
            new JugglerStateBeat(0,0),
            new JugglerStateBeat(1,0),
            new JugglerStateBeat(0,0),
            new JugglerStateBeat(1,1),
        ]);
        expect(state.isPureAsync()).equal(false);
    });

    it('toString 10101', function() {
        const state = new JugglerState([
            new JugglerStateBeat(1,0),
            new JugglerStateBeat(0,0),
            new JugglerStateBeat(1,0),
            new JugglerStateBeat(0,0),
            new JugglerStateBeat(1,0),
        ]);
        expect(state.toString()).equal('10101');
    });

    it('toString (1,0)(0,1)(1,1)', function() {
        const state = new JugglerState([
            new JugglerStateBeat(1,0),
            new JugglerStateBeat(0,1),
            new JugglerStateBeat(1,1),
        ]);
        expect(state.toString()).equal('(1,0)(0,1)(1,1)');
    });

    it('Empty state factory', function() {
        const state = JugglerState.Empty(5);
        expect(state.toString()).equal('00000');
    });
});

describe('State', function() {
    it('Async ground state', function() {
        const state = new State([new JugglerState([
            new JugglerStateBeat(1,0),
            new JugglerStateBeat(0,1),
            new JugglerStateBeat(1,0),
            new JugglerStateBeat(0,1),
            new JugglerStateBeat(1,0),
            new JugglerStateBeat(0,0),
            new JugglerStateBeat(0,0),
        ])]);
        expect(state.toString()).equal('11111');
        expect(state.numObjects).equal(5);
        expect(state.numJugglers).equal(1);
        expect(state.isGround).equal(true);
    });

    it('Async excited state', function() {
        const state = new State([new JugglerState([
            new JugglerStateBeat(1,0),
            new JugglerStateBeat(0,0),
            new JugglerStateBeat(2,0),
            new JugglerStateBeat(0,0),
            new JugglerStateBeat(1,0),
        ])]);
        expect(state.toString()).equal('10201');
        expect(state.numObjects).equal(4);
        expect(state.numJugglers).equal(1);
        expect(state.isGround).equal(false);
    });

    it('General solo state', function() {
        const state = new State([new JugglerState([
            new JugglerStateBeat(1,1),
            new JugglerStateBeat(0,0),
            new JugglerStateBeat(1,2),
            new JugglerStateBeat(0,0),
            new JugglerStateBeat(1,0),
        ])]);
        expect(state.toString()).equal('(1,1)(0,0)(1,2)(0,0)(1,0)');
        expect(state.numObjects).equal(6);
        expect(state.numJugglers).equal(1);
        expect(state.isGround).equal(false);
    });

    it('Ground passing state', function() {
        const state = new State([new JugglerState([
            new JugglerStateBeat(1,0),
            new JugglerStateBeat(0,1),
            new JugglerStateBeat(1,0),
        ]),new JugglerState([
            new JugglerStateBeat(0,1),
            new JugglerStateBeat(1,0),
            new JugglerStateBeat(0,1),
            new JugglerStateBeat(1,0),
        ])]);
        expect(state.toString()).equal('<111|1111>');
        expect(state.numObjects).equal(7);
        expect(state.numJugglers).equal(2);
        expect(state.isGround).equal(true);
    });

    it('Excited passing state', function() {
        const state = new State([new JugglerState([
            new JugglerStateBeat(1,0),
            new JugglerStateBeat(0,1),
        ]),new JugglerState([
            new JugglerStateBeat(0,1),
            new JugglerStateBeat(1,0),
            new JugglerStateBeat(0,1),
            new JugglerStateBeat(1,0),
        ])]);
        expect(state.toString()).equal('<11|1111>');
        expect(state.numObjects).equal(6);
        expect(state.numJugglers).equal(2);
        expect(state.isGround).equal(false);
    });

    it('General passing state', function() {
        const state = new State([new JugglerState([
            new JugglerStateBeat(1,0),
            new JugglerStateBeat(0,1),
            new JugglerStateBeat(0,1),
        ]),new JugglerState([
            new JugglerStateBeat(0,1),
            new JugglerStateBeat(1,0),
            new JugglerStateBeat(0,1),
            new JugglerStateBeat(1,0),
        ])]);
        expect(state.toString()).equal('<(1,0)(0,1)(0,1)|1111>');
        expect(state.numObjects).equal(7);
        expect(state.numJugglers).equal(2);
        expect(state.isGround).equal(false);
    });

});
