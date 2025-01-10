import { Siteswap } from '../src/siteswap';
import { VanillaSiteswap } from '../src/vanilla-siteswap';

import * as chai from 'chai';

const deepEqualInAnyOrder = require('deep-equal-in-any-order');
chai.use(deepEqualInAnyOrder);

const expect = chai.expect;

describe('Siteswap examples', () => {
  describe('Validation and basic info', () => {
    it('97531', () => {
      const ss = Siteswap.Parse('97531');
      expect(ss.errorMessage).equals('');
      expect(ss.isValid).equals(true);
      expect(ss.numJugglers).equals(1);
      expect(ss.numObjects).equals(5);
      expect(ss.period).equals(5);
      expect(ss.maxHeight).equals(9);
      expect(ss.maxMultiplex).equals(1);
      expect(ss.hasAsync).equals(true);
      expect(ss.hasSync).equals(false);
      expect(ss.hasPass).equals(false);
      expect(ss.toString()).equals('97531');
    });

    it('123456789', () => {
      const ss = Siteswap.Parse('123456789');
      expect(ss.errorMessage).equals('');
      expect(ss.isValid).equals(true);
      expect(ss.numJugglers).equals(1);
      expect(ss.numObjects).equals(5);
      expect(ss.period).equals(9);
      expect(ss.maxHeight).equals(9);
      expect(ss.maxMultiplex).equals(1);
      expect(ss.hasAsync).equals(true);
      expect(ss.hasSync).equals(false);
      expect(ss.hasPass).equals(false);
      expect(ss.toString()).equals('123456789');
    });

    it('b 0  1', () => {
      const ss = Siteswap.Parse('b 0  1');
      expect(ss.errorMessage).equals('');
      expect(ss.isValid).equals(true);
      expect(ss.numJugglers).equals(1);
      expect(ss.numObjects).equals(4);
      expect(ss.period).equals(3);
      expect(ss.maxHeight).equals(11);
      expect(ss.maxMultiplex).equals(1);
      expect(ss.hasAsync).equals(true);
      expect(ss.hasSync).equals(false);
      expect(ss.hasPass).equals(false);
      expect(ss.toString()).equals('b01');
    });

    it('432 - collision', () => {
      const ss = Siteswap.Parse('432');
      expect(ss.isValid).equals(false);
      expect(ss.errorMessage).equals('Collision at juggler 0, time 1, hand 1');
    });

    it('443 - invalid average', () => {
      const ss = Siteswap.Parse('443');
      expect(ss.isValid).equals(false);
      expect(ss.errorMessage).equals('Invalid pattern average');
    });

    it('ABC - parse error', () => {
      expect(() => Siteswap.Parse('ABC')).to.throw();
    });

    it('1x - invalid', () => {
      const ss = Siteswap.Parse('1x');
      expect(ss.errorMessage).equals('Collision at juggler 0, time 0, hand 1');
      expect(ss.isValid).equals(false);
      expect(ss.toString()).equals('1x');
    });

    it('x1 - valid', () => {
      const ss = Siteswap.Parse('x1');
      expect(ss.errorMessage).equals('');
      expect(ss.isValid).equals(true);
      expect(ss.numJugglers).equals(1);
      expect(ss.numObjects).equals(17);
      expect(ss.period).equals(2);
      expect(ss.maxHeight).equals(33);
      expect(ss.maxMultiplex).equals(1);
      expect(ss.hasAsync).equals(true);
      expect(ss.hasSync).equals(false);
      expect(ss.hasPass).equals(false);
      expect(ss.toString()).equals('x1');
    });

    it('1 x - valid', () => {
      const ss = Siteswap.Parse('1 x');
      expect(ss.errorMessage).equals('');
      expect(ss.isValid).equals(true);
      expect(ss.numJugglers).equals(1);
      expect(ss.numObjects).equals(17);
      expect(ss.period).equals(2);
      expect(ss.maxHeight).equals(33);
      expect(ss.maxMultiplex).equals(1);
      expect(ss.hasAsync).equals(true);
      expect(ss.hasSync).equals(false);
      expect(ss.hasPass).equals(false);
      expect(ss.toString()).equals('1 x');
    });

    it('1p - treated as period 1', () => {
      const ss = Siteswap.Parse('1p');
      expect(ss.isValid).equals(true);
      expect(ss.period).equals(1);
      expect(ss.toString()).equals('1p');
    });

    it('p1 - valid', () => {
      const ss = Siteswap.Parse('p1');
      expect(ss.errorMessage).equals('');
      expect(ss.isValid).equals(true);
      expect(ss.numJugglers).equals(1);
      expect(ss.numObjects).equals(13);
      expect(ss.period).equals(2);
      expect(ss.maxHeight).equals(25);
      expect(ss.maxMultiplex).equals(1);
      expect(ss.hasAsync).equals(true);
      expect(ss.hasSync).equals(false);
      expect(ss.hasPass).equals(false);
      expect(ss.toString()).equals('p1');
    });

    it('1 p - valid', () => {
      const ss = Siteswap.Parse('1 p');
      expect(ss.errorMessage).equals('');
      expect(ss.isValid).equals(true);
      expect(ss.numJugglers).equals(1);
      expect(ss.numObjects).equals(13);
      expect(ss.period).equals(2);
      expect(ss.maxHeight).equals(25);
      expect(ss.maxMultiplex).equals(1);
      expect(ss.hasAsync).equals(true);
      expect(ss.hasSync).equals(false);
      expect(ss.hasPass).equals(false);
      expect(ss.toString()).equals('1 p');
    });

    it('[43]23', () => {
      const ss = Siteswap.Parse('[43]23');
      expect(ss.errorMessage).equals('');
      expect(ss.isValid).equals(true);
      expect(ss.numJugglers).equals(1);
      expect(ss.numObjects).equals(4);
      expect(ss.period).equals(3);
      expect(ss.maxHeight).equals(4);
      expect(ss.maxMultiplex).equals(2);
      expect(ss.hasAsync).equals(true);
      expect(ss.hasSync).equals(false);
      expect(ss.hasPass).equals(false);
      expect(ss.toString()).equals('[43]23');
    });

    it('[12345]', () => {
      const ss = Siteswap.Parse('[12345]');
      expect(ss.errorMessage).equals('');
      expect(ss.isValid).equals(true);
      expect(ss.numJugglers).equals(1);
      expect(ss.numObjects).equals(15);
      expect(ss.period).equals(1);
      expect(ss.maxHeight).equals(5);
      expect(ss.maxMultiplex).equals(5);
      expect(ss.hasAsync).equals(true);
      expect(ss.hasSync).equals(false);
      expect(ss.hasPass).equals(false);
      expect(ss.toString()).equals('[12345]');
    });

    it('(6,4)(6x,4)*', () => {
      const ss = Siteswap.Parse('(6,4)(6x,4)*');
      expect(ss.errorMessage).equals('');
      expect(ss.isValid).equals(true);
      expect(ss.numJugglers).equals(1);
      expect(ss.numObjects).equals(5);
      expect(ss.period).equals(8);
      expect(ss.maxHeight).equals(6);
      expect(ss.maxMultiplex).equals(1);
      expect(ss.hasAsync).equals(false);
      expect(ss.hasSync).equals(true);
      expect(ss.hasPass).equals(false);
      expect(ss.toString()).equals('(6,4)(6x,4)(4,6)(4,6x)');
    });

    it('([44x], 2)*', () => {
      const ss = Siteswap.Parse('([44x], 2)*');
      expect(ss.errorMessage).equals('');
      expect(ss.isValid).equals(true);
      expect(ss.numJugglers).equals(1);
      expect(ss.numObjects).equals(5);
      expect(ss.period).equals(4);
      expect(ss.maxHeight).equals(4);
      expect(ss.maxMultiplex).equals(2);
      expect(ss.hasAsync).equals(false);
      expect(ss.hasSync).equals(true);
      expect(ss.hasPass).equals(false);
      expect(ss.toString()).equals('([44x],2)(2,[44x])');
    });

    it('(4,4)!', () => {
      const ss = Siteswap.Parse('(4,4)!');
      expect(ss.errorMessage).equals('');
      expect(ss.isValid).equals(true);
      expect(ss.numJugglers).equals(1);
      expect(ss.numObjects).equals(8);
      expect(ss.period).equals(1);
      expect(ss.maxHeight).equals(4);
      expect(ss.maxMultiplex).equals(1);
      expect(ss.hasAsync).equals(false);
      expect(ss.hasSync).equals(true);
      expect(ss.hasPass).equals(false);
      expect(ss.toString()).equals('(4,4)!');
    });

    it('3R3x*', () => {
      const ss = Siteswap.Parse('3R3x*');
      expect(ss.errorMessage).equals('');
      expect(ss.isValid).equals(true);
      expect(ss.numJugglers).equals(1);
      expect(ss.numObjects).equals(3);
      expect(ss.period).equals(4);
      expect(ss.maxHeight).equals(3);
      expect(ss.maxMultiplex).equals(1);
      expect(ss.hasAsync).equals(true);
      expect(ss.hasSync).equals(false);
      expect(ss.hasPass).equals(false);
      expect(ss.toString()).equals('3R3x3L3x');
    });

    it('4444  3x4x3  (4,4)(4,4)(4,4)  (4,3x)(4,3x)!', () => {
      const ss = Siteswap.Parse('4444  3x4x3  (4,4)(4,4)(4,4)  (4,3x)(4,3x)!');
      expect(ss.errorMessage).equals('');
      expect(ss.isValid).equals(true);
      expect(ss.numJugglers).equals(1);
      expect(ss.numObjects).equals(4);
      expect(ss.period).equals(16);
      expect(ss.maxHeight).equals(4);
      expect(ss.maxMultiplex).equals(1);
      expect(ss.hasAsync).equals(true);
      expect(ss.hasSync).equals(true);
      expect(ss.hasPass).equals(false);
      expect(ss.toString()).equals('44443x4x3(4,4)(4,4)(4,4)(4,3x)(4,3x)!');
    });

    it('<3>', () => {
      const ss = Siteswap.Parse('<3>');
      expect(ss.errorMessage).equals('');
      expect(ss.isValid).equals(true);
      expect(ss.numJugglers).equals(1);
      expect(ss.numObjects).equals(3);
      expect(ss.period).equals(1);
      expect(ss.maxHeight).equals(3);
      expect(ss.maxMultiplex).equals(1);
      expect(ss.hasAsync).equals(true);
      expect(ss.hasSync).equals(false);
      expect(ss.hasPass).equals(false);
      expect(ss.toString()).equals('3');
    });

    it('Basic passing <4p3|L34p>', () => {
      const ss = Siteswap.Parse('<4p3|L34p>');
      expect(ss.errorMessage).equals('');
      expect(ss.isValid).equals(true);
      expect(ss.numJugglers).equals(2);
      expect(ss.numObjects).equals(7);
      expect(ss.period).equals(2);
      expect(ss.maxHeight).equals(4);
      expect(ss.maxMultiplex).equals(1);
      expect(ss.hasAsync).equals(true);
      expect(ss.hasSync).equals(false);
      expect(ss.hasPass).equals(true);
      expect(ss.toString()).equals('<4p3|L34p>');
    });

    it('Relative passes <3p33 | 3p33 | 3p33>', () => {
      const ss = Siteswap.Parse('<3p33 | 3p33 | 3p33>');
      expect(ss.errorMessage).equals('');
      expect(ss.isValid).equals(true);
      expect(ss.numJugglers).equals(3);
      expect(ss.numObjects).equals(9);
      expect(ss.period).equals(3);
      expect(ss.maxHeight).equals(3);
      expect(ss.maxMultiplex).equals(1);
      expect(ss.hasAsync).equals(true);
      expect(ss.hasSync).equals(false);
      expect(ss.hasPass).equals(true);
      expect(ss.toString()).equals('<3p33|3p33|3p33>');
    });

    it('Absolute passes <3pC33 | 3pA33 | 3pB33>', () => {
      const ss = Siteswap.Parse('<3pC33 | 3pA33 | 3pB33>');
      expect(ss.errorMessage).equals('');
      expect(ss.isValid).equals(true);
      expect(ss.numJugglers).equals(3);
      expect(ss.numObjects).equals(9);
      expect(ss.period).equals(3);
      expect(ss.maxHeight).equals(3);
      expect(ss.maxMultiplex).equals(1);
      expect(ss.hasAsync).equals(true);
      expect(ss.hasSync).equals(false);
      expect(ss.hasPass).equals(true);
      expect(ss.toString()).equals('<3pC33|3pA33|3pB33>');
    });

    it('Delays {0,1}<4p3|4p3>', () => {
      const ss = Siteswap.Parse('{0,1}<4p3|4p3>');
      expect(ss.errorMessage).equals('');
      expect(ss.isValid).equals(true);
      expect(ss.numJugglers).equals(2);
      expect(ss.numObjects).equals(7);
      expect(ss.period).equals(2);
      expect(ss.maxHeight).equals(4);
      expect(ss.maxMultiplex).equals(1);
      expect(ss.hasAsync).equals(true);
      expect(ss.hasSync).equals(false);
      expect(ss.hasPass).equals(true);
      expect(ss.toString()).equals('<4p3|L34p>');
    });

    it('Delays {0,1}<5p34|L345p>', () => {
      const ss = Siteswap.Parse('{0,1}<5p34|L345p>');
      expect(ss.errorMessage).equals('');
      expect(ss.isValid).equals(true);
      expect(ss.numJugglers).equals(2);
      expect(ss.numObjects).equals(8);
      expect(ss.period).equals(3);
      expect(ss.maxHeight).equals(5);
      expect(ss.maxMultiplex).equals(1);
      expect(ss.hasAsync).equals(true);
      expect(ss.hasSync).equals(false);
      expect(ss.hasPass).equals(true);
      expect(ss.toString()).equals('<5p34|5p34>');
    });

    it('Complex example - 5 person popcorn star version 1', () => {
      const ss = Siteswap.Parse('<4pxC3353|33534pxD|3534pxE3|534pxA33|34pxB335>');
      expect(ss.errorMessage).equals('');
      expect(ss.isValid).equals(true);
      expect(ss.numJugglers).equals(5);
      expect(ss.numObjects).equals(18);
      expect(ss.period).equals(5);
      expect(ss.maxHeight).equals(5);
      expect(ss.maxMultiplex).equals(1);
      expect(ss.hasAsync).equals(true);
      expect(ss.hasSync).equals(false);
      expect(ss.hasPass).equals(true);
      expect(ss.toString()).equals('<4pxC3353|33534pxD|3534pxE3|534pxA33|34pxB335>');
    });

    it('Complex example - 5 person popcorn star version 2', () => {
      const ss = Siteswap.Parse('<4px3353|3534px3|34px335|33534px|534px33>');
      expect(ss.errorMessage).equals('');
      expect(ss.isValid).equals(true);
      expect(ss.numJugglers).equals(5);
      expect(ss.numObjects).equals(18);
      expect(ss.period).equals(5);
      expect(ss.maxHeight).equals(5);
      expect(ss.maxMultiplex).equals(1);
      expect(ss.hasAsync).equals(true);
      expect(ss.hasSync).equals(false);
      expect(ss.hasPass).equals(true);
      expect(ss.toString()).equals('<4px3353|3534px3|34px335|33534px|534px33>');
    });

    it('Fractional passes {0,0.5} <3.5p|3.5px>', () => {
      const ss = Siteswap.Parse('{0,0.5} <3.5p|3.5px>');
      expect(ss.errorMessage).equals('');
      expect(ss.isValid).equals(true);
      expect(ss.numJugglers).equals(2);
      expect(ss.numObjects).equals(7);
      expect(ss.period).equals(1);
      expect(ss.maxHeight).equals(3.5);
      expect(ss.maxMultiplex).equals(1);
      expect(ss.hasAsync).equals(true);
      expect(ss.hasSync).equals(false);
      expect(ss.hasPass).equals(true);
      expect(ss.toString()).equals('{0,0.5}<3.5p|3.5px>');
    });

    it('Inferred delays <3.5p|3.5px>', () => {
      const ss = Siteswap.Parse('<3.5p|3.5px>');
      expect(ss.errorMessage).equals('');
      expect(ss.isValid).equals(true);
      expect(ss.numJugglers).equals(2);
      expect(ss.numObjects).equals(7);
      expect(ss.period).equals(1);
      expect(ss.maxHeight).equals(3.5);
      expect(ss.maxMultiplex).equals(1);
      expect(ss.hasAsync).equals(true);
      expect(ss.hasSync).equals(false);
      expect(ss.hasPass).equals(true);
      expect(ss.toString()).equals('<3.5p|3.5px>');
      expect(ss.jugglerDelays).eqls([0, 0.5]);
    });

    it('Inferred delays 3 jugglers <3.3p3|3.3p3|4.3p3>', () => {
      const ss = Siteswap.Parse('<3.3p3|3.3p3|4.3p3>');
      expect(ss.errorMessage).equals('');
      expect(ss.isValid).equals(true);
      expect(ss.numJugglers).equals(3);
      expect(ss.numObjects).equals(10);
      expect(ss.period).equals(2);
      expect(ss.maxHeight).equals(4 + 1 / 3);
      expect(ss.maxMultiplex).equals(1);
      expect(ss.hasAsync).equals(true);
      expect(ss.hasSync).equals(false);
      expect(ss.hasPass).equals(true);
      expect(ss.toString()).equals('<3.3p3|3.3p3|4.3p3>');
      expect(ss.jugglerDelays[0]).approximately(0, 1e-6);
      expect(ss.jugglerDelays[1]).approximately(1 / 3, 1e-6);
      expect(ss.jugglerDelays[2]).approximately(2 / 3, 1e-6);
    });

    it('Invalid inferred delays <3.5|3.5>', () => {
      const ss = Siteswap.Parse('<3.5|3.5>');
      expect(ss.errorMessage).equals('Cannot find consistent juggler delays: self throw of height 3.5');
      expect(ss.isValid).equals(false);
    });

    it('Invalid inferred delays <3.5p|3px>', () => {
      const ss = Siteswap.Parse('<3.5p|3px>');
      expect(ss.errorMessage).equals('Cannot find consistent juggler delays: juggler B has delays of 0 and 0.5');
      expect(ss.isValid).equals(false);
    });

    it('Infer weird fractional passes {0,0.3} <3.3p|3.7px>', () => {
      const ss = Siteswap.Parse('<3.3p|3.7px>');
      expect(ss.errorMessage).equals('');
      expect(ss.isValid).equals(true);
      expect(ss.numJugglers).equals(2);
      expect(ss.numObjects).equals(7);
      expect(ss.period).equals(1);
      expect(ss.maxHeight).equals(3.7);
      expect(ss.maxMultiplex).equals(1);
      expect(ss.hasAsync).equals(true);
      expect(ss.hasSync).equals(false);
      expect(ss.hasPass).equals(true);
      expect(ss.toString()).equals('<3.3p|3.7px>');
      expect(ss.jugglerDelays[0]).approximately(0, 1e-6);
      expect(ss.jugglerDelays[1]).approximately(0.3, 1e-6);
    });

    it('Fractional passes 3 jugglers {0,0.3,0.6}<3.3p3|3.3p3|4.3p3>', () => {
      const ss = Siteswap.Parse('{0,0.3,0.6}<3.3p3|3.3p3|4.3p3>');
      expect(ss.errorMessage).equals('');
      expect(ss.isValid).equals(true);
      expect(ss.numJugglers).equals(3);
      expect(ss.numObjects).equals(10);
      expect(ss.period).equals(2);
      expect(ss.maxHeight).equals(4 + 1 / 3);
      expect(ss.maxMultiplex).equals(1);
      expect(ss.hasAsync).equals(true);
      expect(ss.hasSync).equals(false);
      expect(ss.hasPass).equals(true);
      expect(ss.toString()).equals('{0,0.3,0.6}<3.3p3|3.3p3|4.3p3>');
    });

    it('Complex delay inference', () => {
      const ss = Siteswap.Parse('<5.5pB5|6pxC5.5pxA|6pxB5.5pxD|5.5pC5>');
      expect(ss.errorMessage).equals('');
      expect(ss.isValid).equals(true);
      expect(ss.numJugglers).equals(4);
      expect(ss.numObjects).equals(22);
      expect(ss.period).equals(2);
      expect(ss.maxHeight).equals(6);
      expect(ss.maxMultiplex).equals(1);
      expect(ss.hasAsync).equals(true);
      expect(ss.hasSync).equals(false);
      expect(ss.hasPass).equals(true);
      expect(ss.toString()).equals('<5.5pB5|6pxC5.5pxA|6pxB5.5pxD|5.5pC5>');
    });

    it('Sync passing <(4p,4x)|(4p,4x)>', () => {
      const ss = Siteswap.Parse('<(4p,4x)|(4p,4x)>');
      expect(ss.errorMessage).equals('');
      expect(ss.isValid).equals(true);
      expect(ss.numJugglers).equals(2);
      expect(ss.numObjects).equals(8);
      expect(ss.period).equals(2);
      expect(ss.maxHeight).equals(4);
      expect(ss.maxMultiplex).equals(1);
      expect(ss.hasAsync).equals(false);
      expect(ss.hasSync).equals(true);
      expect(ss.hasPass).equals(true);
      expect(ss.toString()).equals('<(4p,4x)|(4p,4x)>');
    });

    it('Collision {0,0.5}<3.5px|3.5p>', () => {
      const ss = Siteswap.Parse('{0,0.5}<3.5px|3.5p>');
      expect(ss.errorMessage).equals('Collision at juggler 1, time 0, hand 1');
      expect(ss.isValid).equals(false);
    });

    it('Invalid fraction {0,0.5}<3.2px|3.8p>', () => {
      const ss = Siteswap.Parse('{0,0.5}<3.2px|3.8p>');
      expect(ss.errorMessage).equals(
        'Throw 3.2 lands at an invalid time for juggler 1'
      );
      expect(ss.isValid).equals(false);
    });

    it('Collision <3pA|3pA>', () => {
      const ss = Siteswap.Parse('<3pA|3pA>');
      expect(ss.errorMessage).equals('Collision at juggler 0, time 0, hand 1');
      expect(ss.isValid).equals(false);
    });

    it('Different periods <3p3|3p>', () => {
      const ss = Siteswap.Parse('<3p3|3p>');
      expect(ss.errorMessage).equals('Mismatching juggler periods');
      expect(ss.isValid).equals(false);
    });

    it('Pass to nonexistent juggler <3pC|3p>', () => {
      const ss = Siteswap.Parse('<3pC|3p>');
      expect(ss.errorMessage).equals(
        'Invalid juggler C, there are only 2 jugglers'
      );
      expect(ss.isValid).equals(false);
    });

    it('Mismatched delays {0}<3p|3p>', () => {
      const ss = Siteswap.Parse('{0}<3p|3p>');
      expect(ss.errorMessage).equals(
        'Number of jugglers (2) not equal to number of delays (1)'
      );
      expect(ss.isValid).equals(false);
    });

    it('No juggers', () => {
      const ss = new Siteswap([]);
      expect(ss.errorMessage).equals('No jugglers');
      expect(ss.isValid).equals(false);
    });

    it('Simple normal shortcut (m^20)1', () => {
      const ss = Siteswap.Parse('(m^20)1');
      expect(ss.toString()).equals('mmmmmmmmmmmmmmmmmmmm1');
      expect(ss.errorMessage).equals('');
      expect(ss.isValid).equals(true);
      expect(ss.numJugglers).equals(1);
      expect(ss.numObjects).equals(21);
      expect(ss.period).equals(21);
      expect(ss.maxHeight).equals(22);
      expect(ss.maxMultiplex).equals(1);
      expect(ss.hasAsync).equals(true);
      expect(ss.hasSync).equals(false);
      expect(ss.hasPass).equals(false);
    });

    it('More complex normal shortcut (97 ^ 4)1db97531', () => {
      const ss = Siteswap.Parse('(97^3)1db97531');
      expect(ss.toString()).equals('9797971db97531');
      expect(ss.errorMessage).equals('');
      expect(ss.isValid).equals(true);
      expect(ss.numJugglers).equals(1);
      expect(ss.numObjects).equals(7);
      expect(ss.period).equals(14);
      expect(ss.maxHeight).equals(13);
      expect(ss.maxMultiplex).equals(1);
      expect(ss.hasAsync).equals(true);
      expect(ss.hasSync).equals(false);
      expect(ss.hasPass).equals(false);
    });

    it('Simple passing shortcut <3p|^10>', () => {
      const ss = Siteswap.Parse('<3p|^10>');
      expect(ss.toString()).equals('<3p|3p|3p|3p|3p|3p|3p|3p|3p|3p>');
      expect(ss.errorMessage).equals('');
      expect(ss.isValid).equals(true);
      expect(ss.numJugglers).equals(10);
      expect(ss.numObjects).equals(30);
      expect(ss.period).equals(1);
      expect(ss.maxHeight).equals(3);
      expect(ss.maxMultiplex).equals(1);
      expect(ss.hasAsync).equals(true);
      expect(ss.hasSync).equals(false);
      expect(ss.hasPass).equals(true);
    });

    it('More complex passing shortcut <3p3|3p5|^2>', () => {
      const ss = Siteswap.Parse('<3p3|3p5|^2>');
      expect(ss.toString()).equals('<3p3|3p5|3p3|3p5>');
      expect(ss.errorMessage).equals('');
      expect(ss.isValid).equals(true);
      expect(ss.numJugglers).equals(4);
      expect(ss.numObjects).equals(14);
      expect(ss.period).equals(2);
      expect(ss.maxHeight).equals(5);
      expect(ss.maxMultiplex).equals(1);
      expect(ss.hasAsync).equals(true);
      expect(ss.hasSync).equals(false);
      expect(ss.hasPass).equals(true);
    });

    it('More complex passing shortcut with delays {0,3}<4p33353|^2>', () => {
      const ss2 = Siteswap.Parse('{0,3}<4p33353|4p33353>');
      const ss = Siteswap.Parse('{0,3}<4p33353|^2>');
      expect(ss.toString()).equals(ss2.toString());
      expect(ss.errorMessage).equals('');
      expect(ss.isValid).equals(true);
      expect(ss.numJugglers).equals(2);
      expect(ss.numObjects).equals(7);
      expect(ss.period).equals(6);
      expect(ss.maxHeight).equals(5);
      expect(ss.maxMultiplex).equals(1);
      expect(ss.hasAsync).equals(true);
      expect(ss.hasSync).equals(false);
      expect(ss.hasPass).equals(true);
    });
  });
});

describe('Siteswap manipulations', () => {
  it('Flip async', () => {
    const ss = Siteswap.Parse('97531');
    expect(ss.flip().toString()).equal('L97531');
  });
  it('Flip sync', () => {
    const ss = Siteswap.Parse('(8x,2x)');
    expect(ss.flip().toString()).equal('(2x,8x)');
  });
  it('Flip sync passing', () => {
    const ss = Siteswap.Parse('<(6,4)|(2,8)>');
    expect(ss.flip().toString()).equal('<(4,6)|(8,2)>');
  });
  it('Flip async passing', () => {
    const ss = Siteswap.Parse('<3p33|3p33>');
    expect(ss.flip().toString()).equal('<L3p33|L3p33>');
  });
});

describe('Siteswap state calculations', () => {
  it('State of 97531', () => {
    const ss = Siteswap.Parse('97531');
    expect(ss.state.toString()).equal('11111');
    expect(ss.state.numObjects).equal(5);
    expect(ss.state.numJugglers).equal(1);
    expect(ss.state.isGround).equal(true);
  });

  it('State of 15', () => {
    const ss = Siteswap.Parse('15');
    expect(ss.state.toString()).equal('10101');
    expect(ss.state.numObjects).equal(3);
    expect(ss.state.isGround).equal(false);
  });

  it('State of 801', () => {
    const ss = Siteswap.Parse('801');
    expect(ss.state.toString()).equal('101001');
    expect(ss.state.numObjects).equal(3);
    expect(ss.state.isGround).equal(false);
  });

  it('State of b01', () => {
    const ss = Siteswap.Parse('b01');
    expect(ss.state.toString()).equal('101001001');
    expect(ss.state.numObjects).equal(4);
    expect(ss.state.isGround).equal(false);
  });

  it('State of 00555', () => {
    const ss = Siteswap.Parse('00555');
    expect(ss.state.toString()).equal('00111');
    expect(ss.state.numObjects).equal(3);
    expect(ss.state.isGround).equal(false);
  });

  it('State of L00555', () => {
    const ss = Siteswap.Parse('L00555');
    expect(ss.state.toString()).equal('00111');
    expect(ss.state.numObjects).equal(3);
    expect(ss.state.isGround).equal(false);
  });

  it('State of [43]23', () => {
    const ss = Siteswap.Parse('[43]23');
    expect(ss.state.toString()).equal('211');
    expect(ss.state.numObjects).equal(4);
    expect(ss.state.isGround).equal(false);
  });

  it('State of (4,4)', () => {
    const ss = Siteswap.Parse('(4,4)');
    expect(ss.state.toString()).equal('(1,1)(0,0)(1,1)');
    expect(ss.state.numObjects).equal(4);
    expect(ss.state.isGround).equal(false);
  });

  it('State of (4,0)!', () => {
    const ss = Siteswap.Parse('(4,0)!');
    expect(ss.state.toString()).equal('(1,0)(1,0)(1,0)(1,0)');
    expect(ss.state.numObjects).equal(4);
    expect(ss.state.isGround).equal(false);
  });

  it('State of 3R3x*', () => {
    const ss = Siteswap.Parse('3R3x*');
    expect(ss.state.toString()).equal('(0,1)(0,1)(1,0)');
    expect(ss.state.numObjects).equal(3);
    expect(ss.state.isGround).equal(false);
  });

  it('State of <3p3|3p3>', () => {
    const ss = Siteswap.Parse('<3p3|3p3>');
    expect(ss.state.toString()).equal('<111|111>');
    expect(ss.state.numObjects).equal(6);
    expect(ss.state.isGround).equal(true);
  });

  it('State of <2|4> should not be ground', () => {
    const ss = Siteswap.Parse('<2|4>');
    expect(ss.state.toString()).equal('<11|1111>');
    expect(ss.state.numObjects).equal(6);
    expect(ss.state.isGround).equal(false);
  });

  it('State of {0,0.5}<3.5p|3.5px> should be ground', () => {
    const ss = Siteswap.Parse('{0,0.5}<3.5p|3.5px>');
    expect(ss.state.toString()).equal('<1111|111>');
    expect(ss.state.numObjects).equal(7);
    expect(ss.state.isGround).equal(true);
  });
});

describe('Conversion to VanillaSiteswap', () => {
  it('Basic: 97531', () => {
    const ss = Siteswap.Parse('97531');
    const vanilla = ss.toVanilla();
    expect(vanilla.toString()).equal('97531');
    expect(vanilla.errorMessage).equal('');
    expect(vanilla.isValid).equal(true);
  });

  it('Multiplex [43]23', () => {
    const ss = Siteswap.Parse('[43]23');
    const vanilla = ss.toVanilla();
    expect(vanilla.toString()).equal('[43]23');
    expect(vanilla.errorMessage).equal('');
    expect(vanilla.isValid).equal(true);
  });

  it('LH shower: L51', () => {
    const ss = Siteswap.Parse('L51');
    const vanilla = ss.toVanilla();
    expect(vanilla.toString()).equal('51');
    expect(vanilla.errorMessage).equal('');
    expect(vanilla.isValid).equal(true);
  });

  it('Sync: invalid', () => {
    const ss = Siteswap.Parse('(4,4)');
    expect(() => ss.toVanilla()).to.throw();
  });

  it('Passing: invalid', () => {
    const ss = Siteswap.Parse('<3p|3p>');
    expect(() => ss.toVanilla()).to.throw();
  });
});

describe('KHSS Parsing/conversion', () => {
  it('2 handed SS - test default', () => {
    const ss = Siteswap.ParseKHSS('97531');
    expect(ss.toString()).equal('97531');
    expect(ss.errorMessage).equal('');
    expect(ss.isValid).equal(true);
  });

  it('Even period 4 handed SS, no passes', () => {
    const ss = Siteswap.ParseKHSS('86', 4);
    expect(ss.toString()).equal('{0,0.5}<4|3>');
    expect(ss.errorMessage).equal('');
    expect(ss.isValid).equal(true);
  });

  it('Even period 4 handed SS, only passes', () => {
    const ss = Siteswap.ParseKHSS('79', 4);
    expect(ss.toString()).equal('{0,0.5}<3.5p|4.5p>');
    expect(ss.errorMessage).equal('');
    expect(ss.isValid).equal(true);
  });

  it('Even period 4 handed SS, only passes', () => {
    const ss = Siteswap.ParseKHSS('97', 4);
    expect(ss.toString()).equal('{0,0.5}<4.5px|3.5px>');
    expect(ss.errorMessage).equal('');
    expect(ss.isValid).equal(true);
  });

  it('Even period 4 handed SS, some passes', () => {
    const ss = Siteswap.ParseKHSS('966867', 4);
    expect(ss.toString()).equal('{0,0.5}<4.5px33|343.5px>');
    expect(ss.errorMessage).equal('');
    expect(ss.isValid).equal(true);
  });

  it('Period 1, 4 handed SS', () => {
    const ss = Siteswap.ParseKHSS('7', 4);
    expect(ss.toString()).equal('{0,0.5}<3.5p|3.5px>');
    expect(ss.errorMessage).equal('');
    expect(ss.isValid).equal(true);
  });

  it('Odd period 4 handed SS, some passes', () => {
    const ss = Siteswap.ParseKHSS('867', 4);
    expect(ss.toString()).equal('{0,0.5}<43.5p3|343.5px>');
    expect(ss.errorMessage).equal('');
    expect(ss.isValid).equal(true);
  });

  it('Odd period 4 handed SS, only passes', () => {
    const ss = Siteswap.ParseKHSS('975', 4);
    expect(ss.toString()).equal('{0,0.5}<4.5px2.5px3.5p|3.5px4.5p2.5p>');
    expect(ss.errorMessage).equal('');
    expect(ss.isValid).equal(true);
  });

  it('Simple 6 handed SS, period 1', () => {
    const ss = Siteswap.ParseKHSS('7', 6);
    expect(ss.toString()).equal('{0,0.3,0.6}<2.3px|2.3px|2.3p>');
    expect(ss.errorMessage).equal('');
    expect(ss.isValid).equal(true);
  });

  it('6 handed SS, period 3', () => {
    const ss = Siteswap.ParseKHSS('567', 6);
    expect(ss.toString()).equal('{0,0.3,0.6}<1.6pC|2|2.3p>');
    expect(ss.errorMessage).equal('');
    expect(ss.isValid).equal(true);
  });

  it('Simple 3 handed SS converted to 6hss', () => {
    const ss = Siteswap.ParseKHSS('3', 3);
    expect(ss.toString()).equal('{0,0.3,0.6}<20|02|20>');
    expect(ss.errorMessage).equal('');
    expect(ss.isValid).equal(true);
  });

  it('Complex 3 handed SS converted to 6hss', () => {
    const ss = Siteswap.ParseKHSS('5313', 3);
    expect(ss.toString()).equal('{0,0.3,0.6}<3.3p0200.6pxC020|00.6pA0203.3p02|203.3px0200.6pB0>');
    expect(ss.errorMessage).equal('');
    expect(ss.isValid).equal(true);
  });

  it('Invalid conversion from multiplex vanilla siteswap', () => {
    const vss = VanillaSiteswap.Parse('[43]23');
    expect(() => Siteswap.FromKHSS(vss)).to.throw();
  });
});

describe('JIF conversion', () => {
  describe('Siteswap to JIF conversion', () => {
    it('JIF for 3', () => {
      const ss = Siteswap.Parse('3');
      expect(ss.isValid).equal(true);
      expect(ss.toJIF()).to.deep.equalInAnyOrder({
        meta: { name: '3', type: 'General siteswap', description: '3', generator: "siteswap.js", version: "0.01"  },
        timeStretchFactor: 1,
        jugglers: [ { name: 'A', position: [0, 0, 0], lookAt: [0, 0, 1] } ],
        limbs: [
          { juggler: 0, type: 'left hand' },
          { juggler: 0, type: 'right hand' }
        ],
        props: [
          { color: '#f45d20', type: 'club' },
          { color: '#f45d20', type: 'club' },
          { color: '#f45d20', type: 'club' }
        ],
        throws: [
          { time: 0, from: 0, to: 1, duration: 3, label: '3', prop: 0 },
          { time: 1, from: 1, to: 0, duration: 3, label: '3', prop: 1 },
          { time: 2, from: 0, to: 1, duration: 3, label: '3', prop: 2 },
          { time: 3, from: 1, to: 0, duration: 3, label: '3', prop: 0 },
          { time: 4, from: 0, to: 1, duration: 3, label: '3', prop: 1 },
          { time: 5, from: 1, to: 0, duration: 3, label: '3', prop: 2 },
        ],
        repetition: { period: 6 }
      });
    });
    it('JIF for 531', () => {
      const ss = Siteswap.Parse('531');
      expect(ss.isValid).equal(true);
      expect(ss.toJIF()).to.deep.equalInAnyOrder({
        meta: { name: '531', type: 'General siteswap', description: '531', generator: "siteswap.js", version: "0.01"  },
        timeStretchFactor: 1,
        jugglers: [ { name: 'A', position: [0, 0, 0], lookAt: [0, 0, 1] } ],
        limbs: [
          { juggler: 0, type: 'left hand' },
          { juggler: 0, type: 'right hand' }
        ],
        props: [
          { color: '#f45d20', type: 'club' },
          { color: '#f45d20', type: 'club' },
          { color: '#f45d20', type: 'club' }
        ],
        throws: [
          { time: 0, from: 0, to: 1, duration: 5, label: '5', prop: 0 },
          { time: 1, from: 1, to: 0, duration: 3, label: '3', prop: 1 },
          { time: 2, from: 0, to: 1, duration: 1, label: '1', prop: 2 },
          { time: 3, from: 1, to: 0, duration: 5, label: '5', prop: 2 },
          { time: 4, from: 0, to: 1, duration: 3, label: '3', prop: 1 },
          { time: 5, from: 1, to: 0, duration: 1, label: '1', prop: 0 }
        ],
        repetition: { period: 6 }
      });
    });
    it('JIF for 53', () => {
      const ss = Siteswap.Parse('53');
      expect(ss.isValid).equal(true);
      expect(ss.toJIF()).to.deep.equalInAnyOrder({
        meta: { name: '53', type: 'General siteswap', description: '53', generator: "siteswap.js", version: "0.01"  },
        timeStretchFactor: 1,
        jugglers: [ { name: 'A', position: [0, 0, 0], lookAt: [0, 0, 1] } ],
        limbs: [
          { juggler: 0, type: 'left hand' },
          { juggler: 0, type: 'right hand' }
        ],
        props: [
          { color: '#f45d20', type: 'club' },
          { color: '#f45d20', type: 'club' },
          { color: '#f45d20', type: 'club' },
          { color: '#f45d20', type: 'club' }
        ],
        throws: [
          { time: 0, from: 0, to: 1, duration: 5, label: '5', prop: 0 },
          { time: 1, from: 1, to: 0, duration: 3, label: '3', prop: 1 },
          { time: 2, from: 0, to: 1, duration: 5, label: '5', prop: 2 },
          { time: 3, from: 1, to: 0, duration: 3, label: '3', prop: 3 },
          { time: 4, from: 0, to: 1, duration: 5, label: '5', prop: 1 },
          { time: 5, from: 1, to: 0, duration: 3, label: '3', prop: 0 },
          { time: 6, from: 0, to: 1, duration: 5, label: '5', prop: 3 },
          { time: 7, from: 1, to: 0, duration: 3, label: '3', prop: 2 }
        ],
        repetition: { period: 8 }
      });
    });

    it('JIF ignore 0s', () => {
      const ss1 = Siteswap.Parse('(0,5)!(5,0)!(0,5)!(1,0)!');
      expect(ss1.isValid).equal(true);
      const ss2 = Siteswap.Parse('5551');
      expect(ss2.isValid).equal(true);
      const jif1 = ss1.toJIF();
      const jif2 = ss2.toJIF();
      jif1.meta = {};
      jif2.meta = {};
      expect(jif1).to.deep.equalInAnyOrder(jif2);
    });

    it('JIF for 6 club 3 count', () => {
      const ss = Siteswap.Parse('<3p33|3p33>');
      expect(ss.isValid).equal(true);
      expect(ss.toJIF()).to.deep.equalInAnyOrder({
        meta: { name: '<3p33|3p33>', type: 'General siteswap', description: '<3p33|3p33>', generator: "siteswap.js", version: "0.01" },
        timeStretchFactor: 1,
        jugglers: [
          { name: 'A', position: [1.5, 0, 0], lookAt: [0, 0, 0] },
          { name: 'B', position: [-1.5, 0, 0], lookAt: [0, 0, 0] }
        ],
        limbs: [
          { juggler: 0, type: 'left hand' },
          { juggler: 0, type: 'right hand' },
          { juggler: 1, type: 'left hand' },
          { juggler: 1, type: 'right hand' }
        ],
        props: [
          { color: '#f45d20', type: 'club' },
          { color: '#f45d20', type: 'club' },
          { color: '#f45d20', type: 'club' },
          { color: '#f45d20', type: 'club' },
          { color: '#f45d20', type: 'club' },
          { color: '#f45d20', type: 'club' }
        ],
        throws: [
          { time: 0, from: 0, to: 3, duration: 3, label: '3p', prop: 0 },
          { time: 0, from: 2, to: 1, duration: 3, label: '3p', prop: 1 },
          { time: 1, from: 1, to: 0, duration: 3, label: '3', prop: 2 },
          { time: 1, from: 3, to: 2, duration: 3, label: '3', prop: 3 },
          { time: 2, from: 0, to: 1, duration: 3, label: '3', prop: 4 },
          { time: 2, from: 2, to: 3, duration: 3, label: '3', prop: 5 },
          { time: 3, from: 1, to: 2, duration: 3, label: '3p', prop: 1 },
          { time: 3, from: 3, to: 0, duration: 3, label: '3p', prop: 0 },
          { time: 4, from: 0, to: 1, duration: 3, label: '3', prop: 2 },
          { time: 4, from: 2, to: 3, duration: 3, label: '3', prop: 3 },
          { time: 5, from: 1, to: 0, duration: 3, label: '3', prop: 4 },
          { time: 5, from: 3, to: 2, duration: 3, label: '3', prop: 5 },
        ],
        repetition: { period: 6 }
      });
    });
  });
  describe('JIF to Siteswap conversion', () => {
    it('JIF with extra limbs', () => {
      const jif = {
        jugglers: [ { name: 'A', position: [0, 0, 0], lookAt: [0, 0, 1] } ],
        limbs: [
          { juggler: 0, type: 'left hand' },
          { juggler: 0, type: 'right hand' },
          { juggler: 0, type: 'right leg' }
        ],
        throws: [
          { time: 0, from: 1, to: 0, duration: 3, label: '3', prop: 0 },
        ],
        repetition: { period: 1 }
      };
      expect(() => Siteswap.FromJif(jif)).to.throw();
    });

    it('JIF with bad delays', () => {
      const jif = {
        jugglers: [ { name: 'A', position: [0, 0, 0], lookAt: [0, 0, 1] } ],
        timeStretchFactor: 1,
        limbs: [
          { juggler: 0, type: 'left hand' },
          { juggler: 0, type: 'right hand' }
        ],
        throws: [
          { time: 0.3, from: 1, to: 0, duration: 3, label: '3', prop: 0 },
          { time: 1.6, from: 0, to: 1, duration: 3, label: '3', prop: 0 },
        ],
        repetition: { period: 1 }
      };
      expect(() => Siteswap.FromJif(jif)).to.throw();
    });

    it('JIF for 531', () => {
      const jif = {
        meta: { name: '531', type: 'General siteswap', description: '531' },
        jugglers: [ { name: 'A', position: [0, 0, 0], lookAt: [0, 0, 1] } ],
        limbs: [
          { juggler: 0, type: 'left hand' },
          { juggler: 0, type: 'right hand' }
        ],
        throws: [
          { time: 0, from: 1, to: 0, duration: 5, label: '5', prop: 0 },
          { time: 1, from: 0, to: 1, duration: 3, label: '3', prop: 0 },
          { time: 2, from: 1, to: 0, duration: 1, label: '1', prop: 0 },
        ],
        repetition: { period: 3 }
      };
      const ss = Siteswap.FromJif(jif);
      expect(ss.isValid).equal(true);
      expect(ss.toString()).equal('531');
    });

    it('JIF for 7 1-count with timestretch', () => {
      const jif = {
        meta: { name: '7', type: 'General siteswap', description: '7 1-count' },
        timeStretchFactor: 2,
        jugglers: [
          { name: 'A', position: [0, 0, 0], lookAt: [0, 0, 1] },
          { name: 'B', position: [0, 0, 0], lookAt: [0, 0, 1] }
        ],
        limbs: [
          { juggler: 0, type: 'right hand' },
          { juggler: 0, type: 'left hand' },
          { juggler: 1, type: 'right hand' },
          { juggler: 1, type: 'left hand' }
        ],
        throws: [
          { time: 0, from: 0, to: 3, duration: 7, label: '7', prop: 0 },
          { time: 1, from: 2, to: 0, duration: 7, label: '7', prop: 0 },
        ],
        repetition: { period: 1 }
      };
      const ss = Siteswap.FromJif(jif);
      expect(ss.isValid).equal(true);
      expect(ss.toString()).equal('<3.5p|3.5px>');
    });

    it('JIF for 1 count feed', () => {
      const jif = {
        meta: { name: '1c feed', type: 'General siteswap', description: '1c feed' },
        timeStretchFactor: 1,
        jugglers: [
          { name: 'A', position: [0, 0, 0], lookAt: [0, 0, 1] },
          { name: 'B', position: [0, 0, 0], lookAt: [0, 0, 1] },
          { name: 'C', position: [0, 0, 0], lookAt: [0, 0, 1] },
        ],
        limbs: [
          { juggler: 0, type: 'right hand' },
          { juggler: 0, type: 'left hand' },
          { juggler: 1, type: 'right hand' },
          { juggler: 1, type: 'left hand' },
          { juggler: 2, type: 'right hand' },
          { juggler: 2, type: 'left hand' },
        ],
        throws: [
          { time: 0, from: 0, to: 3, duration: 3, label: '3' },
          { time: 1, from: 1, to: 4, duration: 3, label: '3' },
          { time: 0, from: 2, to: 1, duration: 3, label: '3' },
          { time: 1, from: 3, to: 2, duration: 3, label: '3' },
          { time: 0, from: 4, to: 5, duration: 3, label: '3' },
          { time: 1, from: 5, to: 0, duration: 3, label: '3' },
        ],
        repetition: { period: 2 }
      };
      const ss = Siteswap.FromJif(jif);
      expect(ss.toString()).equal('<3pB3pC|3pA3|33pA>');
      expect(ss.isValid).equal(true);
    });
  });
});
