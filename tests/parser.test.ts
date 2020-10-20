import { parse } from "../src/parser";

import * as mocha from 'mocha';
import * as chai from 'chai';

const expect = chai.expect;

describe('Parse errors', function() {
    it('No input', function() {
        expect(() => parse('')).to.throw();
    });
    it('Unmatched brackets', function() {
        expect(() => parse('[4')).to.throw();
    });
    it('Unmatched parens', function() {
        expect(() => parse('(4,4')).to.throw();
    });
    it('No jugglers', function() {
        expect(() => parse('<>')).to.throw();
    });
    it('Empty multiplex', function() {
        expect(() => parse('[]')).to.throw();
    });
    it('Double hand spec', function() {
        expect(() => parse('RR3')).to.throw();
    });
    it('Bad float', function() {
        expect(() => parse('3.a')).to.throw();
    });
    it('Bad sync element', function() {
        expect(() => parse('(44,4)')).to.throw();
    });
    it('Invalid pass recipient', function() {
        expect(() => parse('<3p@|3p>')).to.throw();
    });
    it('Bad space', function() {
        expect(() => parse('(4 x,4)')).to.throw();
    });
    it('Bad multiplex', function() {
        expect(() => parse('[.]')).to.throw();
    });
    it('Extra characters', function() {
        expect(() => parse('531#')).to.throw();
    });
});
