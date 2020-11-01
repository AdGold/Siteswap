import {
  toLetter,
  fromLetter,
  intToSS,
  floatToSS,
  ssToInt,
  ssToFloat,
  fixFraction,
  Hand,
  Throw,
  JugglerBeat,
  JugglerBeats,
} from '../src/common';

import * as chai from 'chai';

const expect = chai.expect;

describe('Conversions', () => {
  describe('toLetter', () => {
    it('0 goes to a', () => {
      expect(toLetter(0, 'a')).equal('a');
    });
    it('25 goes to z', () => {
      expect(toLetter(25, 'a')).equal('z');
    });
    it('14 goes to O', () => {
      expect(toLetter(14, 'A')).equal('O');
    });
  });

  describe('fromLetter', () => {
    it('a goes to 0', () => {
      expect(fromLetter('a', 'a')).equal(0);
    });
    it('z goes to 25', () => {
      expect(fromLetter('z', 'a')).equal(25);
    });
    it('O goes to 14', () => {
      expect(fromLetter('O', 'A')).equal(14);
    });
  });

  describe('intToSS', () => {
    it('0 goes to 0', () => {
      expect(intToSS(0)).equal('0');
    });
    it('10 goes to a', () => {
      expect(intToSS(10)).equal('a');
    });
    it('35 goes to z', () => {
      expect(intToSS(35)).equal('z');
    });
    it('36 fails', () => {
      expect(() => intToSS(36)).to.throw();
    });
  });

  describe('floatToSS', () => {
    it('No decimal places', () => {
      expect(floatToSS(0)).equal('0');
      expect(floatToSS(10)).equal('a');
    });
    it('One decimal place', () => {
      expect(floatToSS(5.5)).equal('5.5');
      expect(floatToSS(10.5)).equal('a.5');
    });
    it('Two decimal places', () => {
      expect(floatToSS(9.33)).equal('9.33');
      expect(floatToSS(15.16)).equal('f.16');
    });
    it('Over 2 decimal places rounds', () => {
      expect(floatToSS(5.777)).equal('5.78');
      expect(floatToSS(9.999)).equal('a');
      expect(floatToSS(10.333)).equal('a.33');
    });
    it('35.999 fails', () => {
      expect(() => floatToSS(35.999)).to.throw();
    });
  });

  describe('ssToInt', () => {
    it('0 goes to 0', () => {
      expect(ssToInt('0')).equal(0);
    });
    it('a goes to 10', () => {
      expect(ssToInt('a')).equal(10);
    });
    it('z goes to 35', () => {
      expect(ssToInt('z')).equal(35);
    });
    it('Non lowercase/numbers fail', () => {
      expect(() => ssToInt('.')).to.throw();
      expect(() => ssToInt('A')).to.throw();
      expect(() => ssToInt(' ')).to.throw();
    });
    it('Strings over length 1 fail', () => {
      expect(() => ssToInt('1 ')).to.throw();
      expect(() => ssToInt('23')).to.throw();
    });
  });

  describe('ssToFloat', () => {
    it('No decimal places', () => {
      expect(ssToFloat('0')).equal(0);
      expect(ssToFloat('a')).equal(10);
    });
    it('One decimal place', () => {
      expect(ssToFloat('5.5')).equal(5.5);
      expect(ssToFloat('a.5')).equal(10.5);
    });
    it('Two decimal places', () => {
      expect(ssToFloat('9.33')).equal(9.33);
      expect(ssToFloat('f.16')).equal(15.16);
    });
    it('Bad decimals fail', () => {
      expect(() => ssToFloat('.3')).to.throw();
      expect(() => ssToFloat('3.')).to.throw();
      expect(() => ssToFloat('1.2.3')).to.throw();
    });
  });

  describe('fixFraction', () => {
    it('Whole numbers are not changed', () => {
      for (let i = 0; i < 36; i++) {
        expect(fixFraction(i)).equal(i);
      }
    });
    it('.3 goes to 1/3 when allowed', () => {
      expect(fixFraction(10.3, true)).equal(10 + 1 / 3);
    });
    it('.3 does not go to 1/3 when not allowed', () => {
      expect(fixFraction(10.3)).equal(10.3);
    });
    it('.6 goes to 2/3 when allowed', () => {
      expect(fixFraction(10.6, true)).equal(10 + 2 / 3);
    });
    it('.6 does not go to 2/3 when not allowed', () => {
      expect(fixFraction(1.6)).equal(1.6);
    });
    it('.16 goes to 1/6', () => {
      expect(fixFraction(1.16)).equal(1 + 1 / 6);
    });
    it('.66 goes to 2/3', () => {
      expect(fixFraction(1.66)).equal(1 + 2 / 3);
    });
    it('.44 goes to 4/9', () => {
      expect(fixFraction(1.44)).equal(1 + 4 / 9);
    });
    it('.47 remains unchanged', () => {
      expect(fixFraction(1.47)).equal(1.47);
    });
  });
});

describe('Throw', () => {
  it('Throw instance with an x', () => {
    const th = new Throw(5, true, false);
    expect(th.height).equal(5);
    expect(th.origHeight).equal(5);
    expect(th.x).equal(true);
    expect(th.pass).equal(false);
    expect(th.passTo).equal(undefined);
    expect(th.toString()).equal('5x');
  });

  it('Throw instance with a relative pass', () => {
    const th = new Throw(10, false, true);
    expect(th.height).equal(10);
    expect(th.origHeight).equal(10);
    expect(th.x).equal(false);
    expect(th.pass).equal(true);
    expect(th.passTo).equal(undefined);
    expect(th.toString()).equal('ap');
  });

  it('Throw instance with a fractional crossing absolute pass', () => {
    const th = new Throw(4.33, true, true, 3);
    expect(th.height).equal(4 + 1 / 3);
    expect(th.origHeight).equal(4.33);
    expect(th.x).equal(true);
    expect(th.pass).equal(true);
    expect(th.passTo).equal(3);
    expect(th.toString()).equal('4.33pxD');
  });

  it('Throw swaps hands - self', () => {
    const th = new Throw(5, false, false);
    expect(th.throwSwapsHands()).equal(true);
    const th2 = new Throw(4, false, false);
    expect(th2.throwSwapsHands()).equal(false);
    const th3 = new Throw(5, true, false);
    expect(th3.throwSwapsHands()).equal(false);
    const th4 = new Throw(4, true, false);
    expect(th4.throwSwapsHands()).equal(true);
  });

  it('Throw swaps hands - pass', () => {
    const th = new Throw(5, true, true, 3);
    // 'crossing' pass - doesn't swap hands
    expect(th.throwSwapsHands()).equal(false);
    const th2 = new Throw(4, false, true);
    // 'straight' pass - does swap hands
    expect(th2.throwSwapsHands()).equal(true);
  });
});

describe('JugglerBeat', () => {
  it('Async beat', () => {
    const beat = new JugglerBeat([new Throw(5, false, false)], []);
    expect(beat.isAsync()).equal(true);
    expect(beat.isSync()).equal(false);
    expect(beat.isEmpty()).equal(false);
    expect(beat.hasMultiplex()).equal(false);
    expect(beat.hasPass()).equal(false);
    expect(beat.toString(Hand.Left)).equal('5');
  });

  it('Sync beat', () => {
    const beat = new JugglerBeat(
      [new Throw(6, true, false)],
      [new Throw(4, false, false)]
    );
    expect(beat.isAsync()).equal(false);
    expect(beat.isSync()).equal(true);
    expect(beat.isEmpty()).equal(false);
    expect(beat.hasMultiplex()).equal(false);
    expect(beat.hasPass()).equal(false);
    expect(beat.toString(Hand.Right)).equal('(6x,4)');
  });

  it('Empty beat', () => {
    const beat = new JugglerBeat([], []);
    expect(beat.isAsync()).equal(false);
    expect(beat.isSync()).equal(false);
    expect(beat.isEmpty()).equal(true);
    expect(beat.hasMultiplex()).equal(false);
    expect(beat.hasPass()).equal(false);
    expect(beat.toString(Hand.Left)).equal('');
  });

  it('Multiplex sync beat', () => {
    const beat = new JugglerBeat(
      [new Throw(8, false, false), new Throw(4, false, false)],
      [new Throw(10, false, false), new Throw(6, false, false)]
    );
    expect(beat.isAsync()).equal(false);
    expect(beat.isSync()).equal(true);
    expect(beat.isEmpty()).equal(false);
    expect(beat.hasMultiplex()).equal(true);
    expect(beat.hasPass()).equal(false);
    expect(beat.toString(Hand.Left)).equal('([84],[a6])');
  });

  it('Beat with pass', () => {
    const beat = new JugglerBeat([new Throw(5, false, true, 1)], []);
    expect(beat.isAsync()).equal(true);
    expect(beat.isSync()).equal(false);
    expect(beat.isEmpty()).equal(false);
    expect(beat.hasMultiplex()).equal(false);
    expect(beat.hasPass()).equal(true);
    expect(beat.toString(Hand.Left)).equal('5pB');
  });

  it('Flip', () => {
    const beat = new JugglerBeat(
      [new Throw(6, true, false)],
      [new Throw(4, false, false)]
    );
    const flipped = beat.flip();
    expect(beat.toString(Hand.Left)).equal('(6x,4)');
    expect(flipped.toString(Hand.Left)).equal('(4,6x)');
  });

  it('Next hand', () => {
    const beat = new JugglerBeat([new Throw(5, false, false)], []);
    expect(beat.toString(Hand.Left)).equal('5');
    expect(beat.toString(Hand.Right)).equal('L5');
    const flipped = beat.flip();
    expect(flipped.toString(Hand.Left)).equal('R5');
    expect(flipped.toString(Hand.Right)).equal('5');
  });
});

describe('JugglerBeats', () => {
  it('All JugglerBeat constructor', () => {
    const beat1 = new JugglerBeat([], [new Throw(9, false, false)]);
    const beat2 = new JugglerBeat([new Throw(7, false, false)], []);
    const beat3 = new JugglerBeat([], [new Throw(5, false, false)]);
    const beats = new JugglerBeats([beat1, beat2, beat3]);
    expect(beats.toString()).equal('975');
  });

  it('Repeat flipped', () => {
    const beat1 = new JugglerBeat(
      [new Throw(6, true, false)],
      [new Throw(4, false, false)]
    );
    const beat2 = new JugglerBeat([], []);
    const beats = new JugglerBeats([beat1, beat2], true);
    expect(beats.beats.length).equal(4);
    expect(beats.toString()).equal('(6x,4)(4,6x)');
  });

  it('Flipping', () => {
    const beat1 = new JugglerBeat(
      [new Throw(6, false, false)],
      [new Throw(4, false, false)]
    );
    const beat2 = new JugglerBeat([], []);
    const beats = new JugglerBeats([beat1, beat2]);
    expect(beats.toString()).equal('(6,4)');
    expect(beats.flip().toString()).equal('(4,6)');
  });

  it('Auto-placement of raw Throws onto side - after RH', () => {
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

  it('Auto-placement of raw Throws onto side - after LH', () => {
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

  it('Auto-placement of raw Throws onto side - after sync', () => {
    const beat1 = new JugglerBeat(
      [new Throw(6, false, false)],
      [new Throw(4, false, false)]
    );
    const beat2 = [new Throw(5, false, false)];
    const beats = new JugglerBeats([beat1, beat2]);
    expect(beats.beats[1].RH).equal(beat2);
    expect(beats.beats[1].LH.length).equal(0);
    expect(beats.toString()).equal('(6,4)!5');
  });

  it('Auto-placement of raw Throws onto side - after empty', () => {
    const beat1 = new JugglerBeat(
      [new Throw(6, false, false)],
      [new Throw(4, false, false)]
    );
    const beat2 = new JugglerBeat([], []);
    const beat3 = [new Throw(5, false, false)];
    const beats = new JugglerBeats([beat1, beat2, beat3]);
    expect(beats.beats[2].RH).equal(beat3);
    expect(beats.beats[2].LH.length).equal(0);
    expect(beats.toString()).equal('(6,4)5');
  });

  it('Empty beat at start toString', () => {
    const beat1 = new JugglerBeat([], []);
    const beats = new JugglerBeats([beat1]);
    expect(beats.toString()).equal('0');
  });

  it('Empty beat after async toString', () => {
    const beat1 = new JugglerBeat([], [new Throw(4, false, false)]);
    const beat2 = new JugglerBeat([], []);
    const beats = new JugglerBeats([beat1, beat2]);
    expect(beats.toString()).equal('40');
  });

  it('Double empty beat', () => {
    const beat1 = new JugglerBeat([], []);
    const beats = new JugglerBeats([beat1, beat1]);
    expect(beats.toString()).equal('00');
  });

  it('Triple empty beat', () => {
    const beat1 = new JugglerBeat([], []);
    const beats = new JugglerBeats([beat1, beat1, beat1]);
    expect(beats.toString()).equal('000');
  });

  it('Missing empty beat toString', () => {
    const beat1 = new JugglerBeat(
      [new Throw(6, false, false)],
      [new Throw(4, false, false)]
    );
    const beat2 = new JugglerBeat([], []);
    const beats = new JugglerBeats([beat1, beat1, beat2]);
    expect(beats.toString()).equal('(6,4)!(6,4)');
  });

  it('Missing empty beat at end toString', () => {
    const beat1 = new JugglerBeat(
      [new Throw(6, false, false)],
      [new Throw(4, false, false)]
    );
    const beats = new JugglerBeats([beat1]);
    expect(beats.toString()).equal('(6,4)!');
  });

  it('Explicit hand toString - after LH', () => {
    const beat1 = new JugglerBeat([], [new Throw(4, false, false)]);
    const beat2 = new JugglerBeat([new Throw(4, false, false)], []);
    const beats = new JugglerBeats([beat1, beat2, beat2]);
    expect(beats.toString()).equal('44L4');
  });

  it('Explicit hand toString - after RH', () => {
    const beat1 = new JugglerBeat([], [new Throw(4, false, false)]);
    const beats = new JugglerBeats([beat1, beat1]);
    expect(beats.toString()).equal('4R4');
  });

  it('Explicit hand toString - after empty', () => {
    const th4 = [new Throw(4, false, false)];
    const beat1 = new JugglerBeat(th4, th4);
    const beat2 = new JugglerBeat([], []);
    const beat3 = new JugglerBeat(th4, []);
    const beats = new JugglerBeats([beat1, beat2, beat3]);
    expect(beats.toString()).equal('(4,4)L4');
  });

  it('Explicit hand toString - after sync', () => {
    const th4 = [new Throw(4, false, false)];
    const beat1 = new JugglerBeat(th4, th4);
    const beat2 = new JugglerBeat(th4, []);
    const beats = new JugglerBeats([beat1, beat2]);
    expect(beats.toString()).equal('(4,4)!L4');
  });
});
