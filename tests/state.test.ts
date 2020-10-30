import {Hand} from '../src/common';
import {State, JugglerState, JugglerStateBeat} from '../src/state';

import * as chai from 'chai';

const expect = chai.expect;

describe('JugglerStateBeat', () => {
  it('Async toString', () => {
    const beat = new JugglerStateBeat(2, 0);
    expect(beat.toString(false)).equal('2');
    const beat2 = new JugglerStateBeat(0, 1);
    expect(beat2.toString(false)).equal('1');
    const beat3 = new JugglerStateBeat(1, 1);
    expect(() => beat3.toString(false)).to.throw();
  });

  it('Sync toString', () => {
    const beat = new JugglerStateBeat(2, 0);
    expect(beat.toString(true)).equal('(2,0)');
    const beat2 = new JugglerStateBeat(1, 1);
    expect(beat2.toString(true)).equal('(1,1)');
    const beat3 = new JugglerStateBeat(0, 0);
    expect(beat3.toString(true)).equal('(0,0)');
  });

  it('Sync test', () => {
    const beat = new JugglerStateBeat(2, 0);
    expect(beat.isSync()).equal(false);
    const beat2 = new JugglerStateBeat(1, 1);
    expect(beat2.isSync()).equal(true);
  });

  it('Empty test', () => {
    const beat = new JugglerStateBeat(2, 0);
    expect(beat.isEmpty()).equal(false);
    const beat2 = new JugglerStateBeat(0, 0);
    expect(beat2.isEmpty()).equal(true);
  });

  it('Increment test', () => {
    const beat = new JugglerStateBeat(1, 0);
    expect(beat.toString(true)).equal('(1,0)');
    beat.increment(Hand.Left);
    expect(beat.toString(true)).equal('(2,0)');
    beat.increment(Hand.Right);
    expect(beat.toString(true)).equal('(2,1)');
  });

  it('Flip test', () => {
    const beat = new JugglerStateBeat(1, 0);
    expect(beat.toString(true)).equal('(1,0)');
    expect(beat.flip().toString(true)).equal('(0,1)');
  });
});

describe('JugglerStateBeat', () => {
  it('Remove trailing zeros', () => {
    const state = new JugglerState([
      new JugglerStateBeat(1, 0),
      new JugglerStateBeat(1, 0),
      new JugglerStateBeat(1, 0),
      new JugglerStateBeat(0, 0),
      new JugglerStateBeat(0, 0),
    ]);
    state.removeTrailingZeros();
    expect(state.beats.length).equal(3);
  });

  it('Remove trailing zeros - all', () => {
    const state = new JugglerState([
      new JugglerStateBeat(0, 0),
      new JugglerStateBeat(0, 0),
      new JugglerStateBeat(0, 0),
      new JugglerStateBeat(0, 0),
      new JugglerStateBeat(0, 0),
    ]);
    state.removeTrailingZeros();
    expect(state.beats.length).equal(0);
  });

  it('Succeeding test for pure async LH', () => {
    const state = new JugglerState([
      new JugglerStateBeat(0, 0),
      new JugglerStateBeat(0, 0),
      new JugglerStateBeat(1, 0),
      new JugglerStateBeat(0, 1),
      new JugglerStateBeat(1, 0),
    ]);
    expect(state.isPureAsync()).equal(true);
  });

  it('Failing test for pure async LH', () => {
    const state = new JugglerState([
      new JugglerStateBeat(1, 0),
      new JugglerStateBeat(0, 0),
      new JugglerStateBeat(1, 0),
      new JugglerStateBeat(0, 0),
      new JugglerStateBeat(0, 1),
    ]);
    expect(state.isPureAsync()).equal(false);
  });

  it('Succeeding test for pure async RH', () => {
    const state = new JugglerState([
      new JugglerStateBeat(0, 0),
      new JugglerStateBeat(0, 0),
      new JugglerStateBeat(0, 1),
      new JugglerStateBeat(0, 0),
      new JugglerStateBeat(0, 1),
    ]);
    expect(state.isPureAsync()).equal(true);
  });

  it('Failing test for pure async', () => {
    const state = new JugglerState([
      new JugglerStateBeat(1, 0),
      new JugglerStateBeat(0, 0),
      new JugglerStateBeat(1, 0),
      new JugglerStateBeat(0, 0),
      new JugglerStateBeat(1, 1),
    ]);
    expect(state.isPureAsync()).equal(false);
  });

  it('toString 10101', () => {
    const state = new JugglerState([
      new JugglerStateBeat(1, 0),
      new JugglerStateBeat(0, 0),
      new JugglerStateBeat(1, 0),
      new JugglerStateBeat(0, 0),
      new JugglerStateBeat(1, 0),
    ]);
    expect(state.toString()).equal('10101');
  });

  it('toString (1,0)(0,1)(1,1)', () => {
    const state = new JugglerState([
      new JugglerStateBeat(1, 0),
      new JugglerStateBeat(0, 1),
      new JugglerStateBeat(1, 1),
    ]);
    expect(state.toString()).equal('(1,0)(0,1)(1,1)');
  });

  it('Empty state factory', () => {
    const state = JugglerState.Empty(5);
    expect(state.toString()).equal('00000');
  });
});

describe('State', () => {
  it('Async ground state', () => {
    const state = new State([
      new JugglerState([
        new JugglerStateBeat(1, 0),
        new JugglerStateBeat(0, 1),
        new JugglerStateBeat(1, 0),
        new JugglerStateBeat(0, 1),
        new JugglerStateBeat(1, 0),
        new JugglerStateBeat(0, 0),
        new JugglerStateBeat(0, 0),
      ]),
    ]);
    expect(state.toString()).equal('11111');
    expect(state.numObjects).equal(5);
    expect(state.numJugglers).equal(1);
    expect(state.isGround).equal(true);
  });

  it('Async excited state', () => {
    const state = new State([
      new JugglerState([
        new JugglerStateBeat(1, 0),
        new JugglerStateBeat(0, 0),
        new JugglerStateBeat(2, 0),
        new JugglerStateBeat(0, 0),
        new JugglerStateBeat(1, 0),
      ]),
    ]);
    expect(state.toString()).equal('10201');
    expect(state.numObjects).equal(4);
    expect(state.numJugglers).equal(1);
    expect(state.isGround).equal(false);
  });

  it('General solo state', () => {
    const state = new State([
      new JugglerState([
        new JugglerStateBeat(1, 1),
        new JugglerStateBeat(0, 0),
        new JugglerStateBeat(1, 2),
        new JugglerStateBeat(0, 0),
        new JugglerStateBeat(1, 0),
      ]),
    ]);
    expect(state.toString()).equal('(1,1)(0,0)(1,2)(0,0)(1,0)');
    expect(state.numObjects).equal(6);
    expect(state.numJugglers).equal(1);
    expect(state.isGround).equal(false);
  });

  it('Ground passing state', () => {
    const state = new State([
      new JugglerState([
        new JugglerStateBeat(1, 0),
        new JugglerStateBeat(0, 1),
        new JugglerStateBeat(1, 0),
      ]),
      new JugglerState([
        new JugglerStateBeat(0, 1),
        new JugglerStateBeat(1, 0),
        new JugglerStateBeat(0, 1),
        new JugglerStateBeat(1, 0),
      ]),
    ]);
    expect(state.toString()).equal('<111|1111>');
    expect(state.numObjects).equal(7);
    expect(state.numJugglers).equal(2);
    expect(state.isGround).equal(true);
  });

  it('Excited passing state', () => {
    const state = new State([
      new JugglerState([
        new JugglerStateBeat(1, 0),
        new JugglerStateBeat(0, 1),
      ]),
      new JugglerState([
        new JugglerStateBeat(0, 1),
        new JugglerStateBeat(1, 0),
        new JugglerStateBeat(0, 1),
        new JugglerStateBeat(1, 0),
      ]),
    ]);
    expect(state.toString()).equal('<11|1111>');
    expect(state.numObjects).equal(6);
    expect(state.numJugglers).equal(2);
    expect(state.isGround).equal(false);
  });

  it('General passing state', () => {
    const state = new State([
      new JugglerState([
        new JugglerStateBeat(1, 0),
        new JugglerStateBeat(0, 1),
        new JugglerStateBeat(0, 1),
      ]),
      new JugglerState([
        new JugglerStateBeat(0, 1),
        new JugglerStateBeat(1, 0),
        new JugglerStateBeat(0, 1),
        new JugglerStateBeat(1, 0),
      ]),
    ]);
    expect(state.toString()).equal('<(1,0)(0,1)(0,1)|1111>');
    expect(state.numObjects).equal(7);
    expect(state.numJugglers).equal(2);
    expect(state.isGround).equal(false);
  });
});
