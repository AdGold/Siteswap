import {Hand} from '../src/common';
import {JugglerState, JugglerStateBeat, State} from '../src/state';

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
  describe('Basic state tests', () => {
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
      expect(state.maxHeight).equal(5);
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
      expect(state.maxHeight).equal(5);
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
      expect(state.maxHeight).equal(5);
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
      expect(state.maxHeight).equal(4);
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
      expect(state.maxHeight).equal(4);
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
      expect(state.maxHeight).equal(4);
    });

    it('Create async ground state', () => {
      const state = State.GroundState(5);
      expect(state.toString()).equal('11111');
      expect(state.isGround).equal(true);
    });

    it('Create even sync ground state', () => {
      const state = State.GroundState(4, true);
      expect(state.toString()).equal('(1,1)(0,0)(1,1)');
      expect(state.isGround).equal(false); // Checks for async ground
    });

    it('Create odd sync ground state', () => {
      const state = State.GroundState(5, true);
      expect(state.toString()).equal('(1,1)(0,0)(1,1)(0,0)(0,1)');
      expect(state.isGround).equal(false); // Checks for async ground
    });

    it('Create passing async ground state', () => {
      const state = State.GroundState(7, false, 2);
      expect(state.toString()).equal('<1111|111>');
      expect(state.isGround).equal(true);
    });

    it('Create passing sync ground state', () => {
      const state = State.GroundState(8, true, 3);
      expect(state.toString()).equal('<(1,1)(0,0)(0,1)|(1,1)(0,0)(0,1)|(1,1)>');
      expect(state.isGround).equal(false);
    });
  });

  describe('Shortest state transitions', () => {
    it('Basic transition', () => {
      const state = new State([
        new JugglerState([
          new JugglerStateBeat(1, 0),
          new JugglerStateBeat(0, 0),
          new JugglerStateBeat(1, 0),
          new JugglerStateBeat(0, 0),
          new JugglerStateBeat(1, 0),
        ]),
      ]);
      expect(state.entry().toString()).equal('45');
      expect(state.exit().toString()).equal('30');
    });

    it('Basic transition - custom from/to', () => {
      const state = new State([
        new JugglerState([
          new JugglerStateBeat(1, 0),
          new JugglerStateBeat(0, 0),
          new JugglerStateBeat(1, 0),
          new JugglerStateBeat(0, 0),
          new JugglerStateBeat(1, 0),
        ]),
      ]);
      const other = new State([
        new JugglerState([
          new JugglerStateBeat(0, 1),
          new JugglerStateBeat(1, 0),
          new JugglerStateBeat(0, 0),
          new JugglerStateBeat(1, 0),
        ]),
      ]);
      expect(state.entry(other).toString()).equal('5');
      expect(state.exit(other).toString()).equal('1');
    });

    it('Basic transition - other hand', () => {
      const state = new State([
        new JugglerState([
          new JugglerStateBeat(0, 1),
          new JugglerStateBeat(0, 0),
          new JugglerStateBeat(0, 1),
          new JugglerStateBeat(0, 0),
          new JugglerStateBeat(0, 1),
        ]),
      ]);
      expect(state.entry(undefined, false, false).toString()).equal('345');
    });

    it('Basic transition to b01', () => {
      const state = new State([
        new JugglerState([
          new JugglerStateBeat(0, 1),
          new JugglerStateBeat(0, 0),
          new JugglerStateBeat(0, 1),
          new JugglerStateBeat(0, 0),
          new JugglerStateBeat(0, 0),
          new JugglerStateBeat(1, 0),
          new JugglerStateBeat(0, 0),
          new JugglerStateBeat(0, 0),
          new JugglerStateBeat(0, 1),
        ]),
      ]);
      expect(state.entry().toString()).equal('579');
      expect(state.exit().toString()).equal('60500');
    });

    it('Sync to sync transition', () => {
      const state = new State([
        new JugglerState([
          new JugglerStateBeat(1, 1),
          new JugglerStateBeat(0, 0),
          new JugglerStateBeat(1, 1),
          new JugglerStateBeat(0, 0),
          new JugglerStateBeat(1, 0),
        ]),
      ]);
      const other = new State([
        new JugglerState([
          new JugglerStateBeat(1, 1),
          new JugglerStateBeat(0, 0),
          new JugglerStateBeat(1, 1),
          new JugglerStateBeat(0, 0),
          new JugglerStateBeat(0, 1),
        ]),
      ]);
      // Shortest transition includes flips so is empty
      expect(state.entry(other).toString()).equal('');
      expect(state.exit(other).toString()).equal('');
      // Not allowing flips forces throws
      expect(State.ShortestTransition(other, state, false).toString()).equal(
        '(4x,6)'
      );
      expect(State.ShortestTransition(state, other, false).toString()).equal(
        '(4,6x)'
      );
    });

    it('Async to sync transition', () => {
      const state = new State([
        new JugglerState([
          new JugglerStateBeat(1, 1),
          new JugglerStateBeat(0, 0),
          new JugglerStateBeat(1, 1),
          new JugglerStateBeat(0, 0),
          new JugglerStateBeat(1, 0),
        ]),
      ]);
      expect(state.entry().toString()).equal('4x5x45');
      expect(state.exit().toString()).equal('(3,5x)(4,5x)!');
    });

    it('Passing state transition', () => {
      const state = new State([
        new JugglerState([
          new JugglerStateBeat(1, 0),
          new JugglerStateBeat(0, 1),
          new JugglerStateBeat(1, 0),
          new JugglerStateBeat(0, 0),
        ]),
        new JugglerState([
          new JugglerStateBeat(0, 1),
          new JugglerStateBeat(1, 0),
          new JugglerStateBeat(0, 1),
          new JugglerStateBeat(1, 0),
        ]),
      ]);
      const other = new State([
        new JugglerState([
          new JugglerStateBeat(0, 1),
          new JugglerStateBeat(1, 0),
          new JugglerStateBeat(0, 1),
          new JugglerStateBeat(1, 0),
        ]),
        new JugglerState([
          new JugglerStateBeat(1, 0),
          new JugglerStateBeat(0, 1),
          new JugglerStateBeat(1, 0),
          new JugglerStateBeat(0, 0),
        ]),
      ]);
      expect(State.BasicTransition(state, other).toString()).equal('<3|L4pA>');
      expect(State.BasicTransition(other, state).toString()).equal('<L3pxB|4>');
    });

    it('Shortest transition needs a flip', () => {
      const state1 = new State([
        new JugglerState([
          new JugglerStateBeat(0, 1),
          new JugglerStateBeat(1, 0),
          new JugglerStateBeat(0, 1),
        ]),
      ]);
      const state2 = new State([
        new JugglerState([
          new JugglerStateBeat(1, 0),
          new JugglerStateBeat(0, 0),
          new JugglerStateBeat(1, 0),
          new JugglerStateBeat(0, 0),
          new JugglerStateBeat(1, 0),
        ]),
      ]);
      expect(State.ShortestTransition(state1, state2, true).toString()).equal(
        '45'
      );
      expect(State.ShortestTransition(state1, state2, false).toString()).equal(
        'L345'
      );
      // Requires second state to be flipped rather than first
      expect(
        State.ShortestTransition(state1.flip(), state2.flip(), true).toString()
      ).equal('45');
    });

    it('Invalid states - mismatched number of balls', () => {
      const state1 = new State([
        new JugglerState([
          new JugglerStateBeat(0, 1),
          new JugglerStateBeat(1, 0),
          new JugglerStateBeat(0, 1),
        ]),
      ]);
      const state2 = new State([
        new JugglerState([new JugglerStateBeat(1, 0)]),
      ]);
      expect(() => State.ShortestTransition(state1, state2, true)).to.throw();
    });

    it('Invalid states - mismatched number of jugglers', () => {
      const state1 = new State([
        new JugglerState([
          new JugglerStateBeat(0, 1),
          new JugglerStateBeat(1, 0),
          new JugglerStateBeat(0, 1),
        ]),
      ]);
      const state2 = new State([
        new JugglerState([
          new JugglerStateBeat(1, 0),
          new JugglerStateBeat(0, 1),
        ]),
        new JugglerState([
          new JugglerStateBeat(1, 0),
          new JugglerStateBeat(0, 0),
        ]),
      ]);
      expect(() => State.ShortestTransition(state1, state2, true)).to.throw();
    });

    it('Invalid states - different juggler delays', () => {
      const state = new State(
        [
          new JugglerState([new JugglerStateBeat(1, 0)]),
          new JugglerState([new JugglerStateBeat(0, 1)]),
        ],
        true,
        [0, 0.5]
      );
      expect(() => state.entry().toString()).to.throw();
      expect(() => state.exit().toString()).to.throw();
    });
  });

  describe('All state transitions', () => {
    it('Only one transition', () => {
      const state = new State([
        new JugglerState([
          new JugglerStateBeat(1, 0),
          new JugglerStateBeat(0, 0),
          new JugglerStateBeat(1, 0),
          new JugglerStateBeat(0, 0),
          new JugglerStateBeat(1, 0),
        ]),
      ]);
      const other = new State([
        new JugglerState([
          new JugglerStateBeat(0, 1),
          new JugglerStateBeat(1, 0),
          new JugglerStateBeat(0, 0),
          new JugglerStateBeat(1, 0),
        ]),
      ]);
      expect(
        Array.from(State.AllTransitionsOfLength(other, state, 1)).map(s =>
          s.toString()
        )
      ).to.have.members(['L5']);
      expect(
        Array.from(State.AllTransitionsOfLength(state, other, 1)).map(s =>
          s.toString()
        )
      ).to.have.members(['1']);
    });

    it('Two transitions', () => {
      const state = new State([
        new JugglerState([
          new JugglerStateBeat(1, 0),
          new JugglerStateBeat(0, 0),
          new JugglerStateBeat(1, 0),
          new JugglerStateBeat(0, 0),
          new JugglerStateBeat(1, 0),
        ]),
      ]);
      const other = new State([
        new JugglerState([
          new JugglerStateBeat(0, 1),
          new JugglerStateBeat(1, 0),
          new JugglerStateBeat(0, 0),
          new JugglerStateBeat(1, 0),
        ]),
      ]);
      expect(
        Array.from(State.AllTransitionsOfLength(other, state, 3)).map(s =>
          s.toString()
        )
      ).to.have.members(['L560', 'L740']);
      expect(
        Array.from(State.AllTransitionsOfLength(state, other, 3)).map(s =>
          s.toString()
        )
      ).to.have.members(['304', '601']);
    });

    it('No transitions', () => {
      const state = new State([
        new JugglerState([
          new JugglerStateBeat(1, 0),
          new JugglerStateBeat(0, 0),
          new JugglerStateBeat(1, 0),
          new JugglerStateBeat(0, 0),
          new JugglerStateBeat(1, 0),
        ]),
      ]);
      const other = new State([
        new JugglerState([
          new JugglerStateBeat(0, 1),
          new JugglerStateBeat(1, 0),
          new JugglerStateBeat(0, 0),
          new JugglerStateBeat(1, 0),
        ]),
      ]);
      expect(
        Array.from(State.AllTransitionsOfLength(other, state, 2)).map(s =>
          s.toString()
        )
      ).to.have.members([]);
      expect(
        Array.from(State.AllTransitionsOfLength(state, other, 2)).map(s =>
          s.toString()
        )
      ).to.have.members([]);
    });

    it('Invalid states - mismatched number of balls', () => {
      const state1 = new State([
        new JugglerState([
          new JugglerStateBeat(0, 1),
          new JugglerStateBeat(1, 0),
          new JugglerStateBeat(0, 1),
        ]),
      ]);
      const state2 = new State([
        new JugglerState([new JugglerStateBeat(1, 0)]),
      ]);
      expect(() =>
        Array.from(State.AllTransitionsOfLength(state1, state2, 1))
      ).to.throw();
    });

    it('Invalid states - mismatched number of jugglers', () => {
      const state1 = new State([
        new JugglerState([
          new JugglerStateBeat(0, 1),
          new JugglerStateBeat(1, 0),
          new JugglerStateBeat(0, 1),
        ]),
      ]);
      const state2 = new State([
        new JugglerState([
          new JugglerStateBeat(1, 0),
          new JugglerStateBeat(0, 1),
        ]),
        new JugglerState([
          new JugglerStateBeat(1, 0),
          new JugglerStateBeat(0, 0),
        ]),
      ]);
      expect(() =>
        Array.from(State.AllTransitionsOfLength(state1, state2, 1))
      ).to.throw();
    });
  });
});
