import {parse} from '../src/parser';

import * as chai from 'chai';

const expect = chai.expect;

describe('Parse errors', () => {
  it('No input', () => {
    expect(() => parse('')).to.throw();
  });
  it('Unmatched brackets', () => {
    expect(() => parse('[4')).to.throw();
  });
  it('Unmatched parens', () => {
    expect(() => parse('(4,4')).to.throw();
  });
  it('Unmatched angled', () => {
    expect(() => parse('<4|4')).to.throw();
  });
  it('No jugglers', () => {
    expect(() => parse('<>')).to.throw();
  });
  it('Missing second juggler', () => {
    expect(() => parse('<1|>')).to.throw();
  });
  it('Empty multiplex', () => {
    expect(() => parse('[]')).to.throw();
  });
  it('Double hand spec', () => {
    expect(() => parse('RR3')).to.throw();
  });
  it('Bad float', () => {
    expect(() => parse('3.a')).to.throw();
  });
  it('Bad sync element', () => {
    expect(() => parse('(44,4)')).to.throw();
  });
  it('Invalid pass recipient', () => {
    expect(() => parse('<3p@|3p>')).to.throw();
  });
  it('Bad space', () => {
    expect(() => parse('(4 x,4)')).to.throw();
  });
  it('Bad multiplex', () => {
    expect(() => parse('[.]')).to.throw();
  });
  it('Extra characters', () => {
    expect(() => parse('531#')).to.throw();
  });
  it('Bad characters', () => {
    expect(() => parse('\x03')).to.throw();
    expect(() => parse('\x13')).to.throw();
  });
});
