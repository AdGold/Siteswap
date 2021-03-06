import { ssToFloat, Hand, Throw, JugglerBeat, JugglerBeats, fromLetter } from './common';
// tslint:disable:only-arrow-functions
// tslint:disable:object-literal-shorthand
// tslint:disable:trailing-comma
// tslint:disable:object-literal-sort-keys
// tslint:disable:one-variable-per-declaration
// tslint:disable:max-line-length
// tslint:disable:no-consecutive-blank-lines
// tslint:disable:align


// Generated by PEG.js v. 0.10.0 (ts-pegjs plugin v. 0.2.7 )
//
// https://pegjs.org/   https://github.com/metadevpro/ts-pegjs

"use strict";

export interface IFilePosition {
  offset: number;
  line: number;
  column: number;
}

export interface IFileRange {
  start: IFilePosition;
  end: IFilePosition;
}

export interface ILiteralExpectation {
  type: "literal";
  text: string;
  ignoreCase: boolean;
}

export interface IClassParts extends Array<string | IClassParts> {}

export interface IClassExpectation {
  type: "class";
  parts: IClassParts;
  inverted: boolean;
  ignoreCase: boolean;
}

export interface IAnyExpectation {
  type: "any";
}

export interface IEndExpectation {
  type: "end";
}

export interface IOtherExpectation {
  type: "other";
  description: string;
}

export type Expectation = ILiteralExpectation | IClassExpectation | IAnyExpectation | IEndExpectation | IOtherExpectation;

export class SyntaxError extends Error {
  public static buildMessage(expected: Expectation[], found: string | null) {
    function hex(ch: string): string {
      return ch.charCodeAt(0).toString(16).toUpperCase();
    }

    function literalEscape(s: string): string {
      return s
        .replace(/\\/g, "\\\\")
        .replace(/"/g,  "\\\"")
        .replace(/\0/g, "\\0")
        .replace(/\t/g, "\\t")
        .replace(/\n/g, "\\n")
        .replace(/\r/g, "\\r")
        .replace(/[\x00-\x0F]/g,            (ch) => "\\x0" + hex(ch) )
        .replace(/[\x10-\x1F\x7F-\x9F]/g, (ch) => "\\x"  + hex(ch) );
    }

    function classEscape(s: string): string {
      return s
        .replace(/\\/g, "\\\\")
        .replace(/\]/g, "\\]")
        .replace(/\^/g, "\\^")
        .replace(/-/g,  "\\-")
        .replace(/\0/g, "\\0")
        .replace(/\t/g, "\\t")
        .replace(/\n/g, "\\n")
        .replace(/\r/g, "\\r")
        .replace(/[\x00-\x0F]/g,            (ch) => "\\x0" + hex(ch) )
        .replace(/[\x10-\x1F\x7F-\x9F]/g, (ch) => "\\x"  + hex(ch) );
    }

    function describeExpectation(expectation: Expectation) {
      switch (expectation.type) {
        case "literal":
          return "\"" + literalEscape(expectation.text) + "\"";
        case "class":
          const escapedParts = expectation.parts.map((part) => {
            return Array.isArray(part)
              ? classEscape(part[0] as string) + "-" + classEscape(part[1] as string)
              : classEscape(part);
          });

          return "[" + (expectation.inverted ? "^" : "") + escapedParts + "]";
        case "any":
          return "any character";
        case "end":
          return "end of input";
        case "other":
          return expectation.description;
      }
    }

    function describeExpected(expected1: Expectation[]) {
      const descriptions = expected1.map(describeExpectation);
      let i: number;
      let j: number;

      descriptions.sort();

      if (descriptions.length > 0) {
        for (i = 1, j = 1; i < descriptions.length; i++) {
          if (descriptions[i - 1] !== descriptions[i]) {
            descriptions[j] = descriptions[i];
            j++;
          }
        }
        descriptions.length = j;
      }

      switch (descriptions.length) {
        case 1:
          return descriptions[0];

        case 2:
          return descriptions[0] + " or " + descriptions[1];

        default:
          return descriptions.slice(0, -1).join(", ")
            + ", or "
            + descriptions[descriptions.length - 1];
      }
    }

    function describeFound(found1: string | null) {
      return found1 ? "\"" + literalEscape(found1) + "\"" : "end of input";
    }

    return "Expected " + describeExpected(expected) + " but " + describeFound(found) + " found.";
  }

  public message: string;
  public expected: Expectation[];
  public found: string | null;
  public location: IFileRange;
  public name: string;

  constructor(message: string, expected: Expectation[], found: string | null, location: IFileRange) {
    super();
    this.message = message;
    this.expected = expected;
    this.found = found;
    this.location = location;
    this.name = "SyntaxError";

    if (typeof (Error as any).captureStackTrace === "function") {
      (Error as any).captureStackTrace(this, SyntaxError);
    }
  }
}

export interface ICached {
  nextPos: number;
  result: any;
}

function peg$parse(input: string, options?: IParseOptions) {
  options = options !== undefined ? options : {};

  const peg$FAILED: Readonly<{}> = {};

  const peg$startRuleFunctions: {[id: string]: any} = { start: peg$parsestart };
  let peg$startRuleFunction: () => any = peg$parsestart;

  const peg$c0 = function(solo: any): any {
      return [[solo]];
  };
  const peg$c1 = "<";
  const peg$c2 = peg$literalExpectation("<", false);
  const peg$c3 = "|";
  const peg$c4 = peg$literalExpectation("|", false);
  const peg$c5 = ">";
  const peg$c6 = peg$literalExpectation(">", false);
  const peg$c7 = function(delays: any, head: any, tail: any): any {
      const jugglers = [head];
      jugglers.push(...tail.map((j: any) => j[2]));
      return [jugglers, delays];
  };
  const peg$c8 = "{";
  const peg$c9 = peg$literalExpectation("{", false);
  const peg$c10 = ",";
  const peg$c11 = peg$literalExpectation(",", false);
  const peg$c12 = "}";
  const peg$c13 = peg$literalExpectation("}", false);
  const peg$c14 = function(head: any, tail: any): any {
      const delays = [head];
      delays.push(...tail.map((d: any) => d[2]));
      return delays;
  };
  const peg$c15 = /^[0-9]/;
  const peg$c16 = peg$classExpectation([["0", "9"]], false, false);
  const peg$c17 = ".";
  const peg$c18 = peg$literalExpectation(".", false);
  const peg$c19 = function(val: any): any {
      return parseFloat(val);
  };
  const peg$c20 = "*";
  const peg$c21 = peg$literalExpectation("*", false);
  const peg$c22 = function(beats: any, asterix: any): any {
      const allBeats = []
      for (const beat of beats) {
          if (beat[0] instanceof JugglerBeat) allBeats.push(...beat);
          else allBeats.push(beat);
      }
      return new JugglerBeats(allBeats, asterix !== null);
  };
  const peg$c23 = /^[RL]/;
  const peg$c24 = peg$classExpectation(["R", "L"], false, false);
  const peg$c25 = function(hand: any, async: any): any {
      if (hand === 'L') return new JugglerBeat(async, []);
      if (hand === 'R') return new JugglerBeat([], async);
      return async;
  };
  const peg$c26 = "(";
  const peg$c27 = peg$literalExpectation("(", false);
  const peg$c28 = ")";
  const peg$c29 = peg$literalExpectation(")", false);
  const peg$c30 = "!";
  const peg$c31 = peg$literalExpectation("!", false);
  const peg$c32 = function(left: any, right: any, skipEmpty: any): any {
      const beats = [new JugglerBeat(left, right)];
      if (!skipEmpty) beats.push(new JugglerBeat([], []));
      return beats;
  };
  const peg$c33 = "[";
  const peg$c34 = peg$literalExpectation("[", false);
  const peg$c35 = "]";
  const peg$c36 = peg$literalExpectation("]", false);
  const peg$c37 = function(multiplex: any): any {
      return multiplex.map((th: any) => th[0]);
  };
  const peg$c38 = function(height: any, modifiers: any): any {
      const x = modifiers[0] !== null;
      const pass = modifiers[1] !== null;
      const passTo = modifiers[2];
      return [new Throw(height, x, pass, passTo)];
  };
  const peg$c39 = "x";
  const peg$c40 = peg$literalExpectation("x", false);
  const peg$c41 = function(x: any): any { return [x, null, null]; };
  const peg$c42 = "p";
  const peg$c43 = peg$literalExpectation("p", false);
  const peg$c44 = /^[A-Z]/;
  const peg$c45 = peg$classExpectation([["A", "Z"]], false, false);
  const peg$c46 = function(pass: any, x: any, passTo: any): any {
      return [x, pass, passTo ? fromLetter(passTo, 'A') : passTo];
  };
  const peg$c47 = /^[0-9a-z]/;
  const peg$c48 = peg$classExpectation([["0", "9"], ["a", "z"]], false, false);
  const peg$c49 = function(height: any): any {
      return ssToFloat(height);
  };
  const peg$c50 = " ";
  const peg$c51 = peg$literalExpectation(" ", false);

  let peg$currPos = 0;
  let peg$savedPos = 0;
  const peg$posDetailsCache = [{ line: 1, column: 1 }];
  let peg$maxFailPos = 0;
  let peg$maxFailExpected: Expectation[] = [];
  let peg$silentFails = 0;

  const peg$resultsCache: {[id: number]: ICached} = {};

  let peg$result;

  if (options.startRule !== undefined) {
    if (!(options.startRule in peg$startRuleFunctions)) {
      throw new Error("Can't start parsing from rule \"" + options.startRule + "\".");
    }

    peg$startRuleFunction = peg$startRuleFunctions[options.startRule];
  }

  function text(): string {
    return input.substring(peg$savedPos, peg$currPos);
  }

  function location(): IFileRange {
    return peg$computeLocation(peg$savedPos, peg$currPos);
  }

  function expected(description: string, location1?: IFileRange) {
    location1 = location1 !== undefined
      ? location1
      : peg$computeLocation(peg$savedPos, peg$currPos);

    throw peg$buildStructuredError(
      [peg$otherExpectation(description)],
      input.substring(peg$savedPos, peg$currPos),
      location1
    );
  }

  function error(message: string, location1?: IFileRange) {
    location1 = location1 !== undefined
      ? location1
      : peg$computeLocation(peg$savedPos, peg$currPos);

    throw peg$buildSimpleError(message, location1);
  }

  function peg$literalExpectation(text1: string, ignoreCase: boolean): ILiteralExpectation {
    return { type: "literal", text: text1, ignoreCase: ignoreCase };
  }

  function peg$classExpectation(parts: IClassParts, inverted: boolean, ignoreCase: boolean): IClassExpectation {
    return { type: "class", parts: parts, inverted: inverted, ignoreCase: ignoreCase };
  }

  function peg$anyExpectation(): IAnyExpectation {
    return { type: "any" };
  }

  function peg$endExpectation(): IEndExpectation {
    return { type: "end" };
  }

  function peg$otherExpectation(description: string): IOtherExpectation {
    return { type: "other", description: description };
  }

  function peg$computePosDetails(pos: number) {
    let details = peg$posDetailsCache[pos];
    let p;

    if (details) {
      return details;
    } else {
      p = pos - 1;
      while (!peg$posDetailsCache[p]) {
        p--;
      }

      details = peg$posDetailsCache[p];
      details = {
        line: details.line,
        column: details.column
      };

      while (p < pos) {
        if (input.charCodeAt(p) === 10) {
          details.line++;
          details.column = 1;
        } else {
          details.column++;
        }

        p++;
      }

      peg$posDetailsCache[pos] = details;

      return details;
    }
  }

  function peg$computeLocation(startPos: number, endPos: number): IFileRange {
    const startPosDetails = peg$computePosDetails(startPos);
    const endPosDetails = peg$computePosDetails(endPos);

    return {
      start: {
        offset: startPos,
        line: startPosDetails.line,
        column: startPosDetails.column
      },
      end: {
        offset: endPos,
        line: endPosDetails.line,
        column: endPosDetails.column
      }
    };
  }

  function peg$fail(expected1: Expectation) {
    if (peg$currPos < peg$maxFailPos) { return; }

    if (peg$currPos > peg$maxFailPos) {
      peg$maxFailPos = peg$currPos;
      peg$maxFailExpected = [];
    }

    peg$maxFailExpected.push(expected1);
  }

  function peg$buildSimpleError(message: string, location1: IFileRange) {
    return new SyntaxError(message, [], "", location1);
  }

  function peg$buildStructuredError(expected1: Expectation[], found: string | null, location1: IFileRange) {
    return new SyntaxError(
      SyntaxError.buildMessage(expected1, found),
      expected1,
      found,
      location1
    );
  }

  function peg$parsestart(): any {
    let s0;

    const key = peg$currPos * 14 + 0;
    const cached: ICached = peg$resultsCache[key];

    if (cached) {
      peg$currPos = cached.nextPos;

      return cached.result;
    }

    s0 = peg$parsesiteswap();

    peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };

    return s0;
  }

  function peg$parsesiteswap(): any {
    let s0, s1;

    const key = peg$currPos * 14 + 1;
    const cached: ICached = peg$resultsCache[key];

    if (cached) {
      peg$currPos = cached.nextPos;

      return cached.result;
    }

    s0 = peg$parsepassing();
    if (s0 === peg$FAILED) {
      s0 = peg$currPos;
      s1 = peg$parsesolo();
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c0(s1);
      }
      s0 = s1;
    }

    peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };

    return s0;
  }

  function peg$parsepassing(): any {
    let s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10;

    const key = peg$currPos * 14 + 2;
    const cached: ICached = peg$resultsCache[key];

    if (cached) {
      peg$currPos = cached.nextPos;

      return cached.result;
    }

    s0 = peg$currPos;
    s1 = peg$parsedelays();
    if (s1 === peg$FAILED) {
      s1 = null;
    }
    if (s1 !== peg$FAILED) {
      s2 = peg$parseWS();
      if (s2 !== peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 60) {
          s3 = peg$c1;
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c2); }
        }
        if (s3 !== peg$FAILED) {
          s4 = peg$parseWS();
          if (s4 !== peg$FAILED) {
            s5 = peg$parsesolo();
            if (s5 !== peg$FAILED) {
              s6 = [];
              s7 = peg$currPos;
              if (input.charCodeAt(peg$currPos) === 124) {
                s8 = peg$c3;
                peg$currPos++;
              } else {
                s8 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c4); }
              }
              if (s8 !== peg$FAILED) {
                s9 = peg$parseWS();
                if (s9 !== peg$FAILED) {
                  s10 = peg$parsesolo();
                  if (s10 !== peg$FAILED) {
                    s8 = [s8, s9, s10];
                    s7 = s8;
                  } else {
                    peg$currPos = s7;
                    s7 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s7;
                  s7 = peg$FAILED;
                }
              } else {
                peg$currPos = s7;
                s7 = peg$FAILED;
              }
              while (s7 !== peg$FAILED) {
                s6.push(s7);
                s7 = peg$currPos;
                if (input.charCodeAt(peg$currPos) === 124) {
                  s8 = peg$c3;
                  peg$currPos++;
                } else {
                  s8 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c4); }
                }
                if (s8 !== peg$FAILED) {
                  s9 = peg$parseWS();
                  if (s9 !== peg$FAILED) {
                    s10 = peg$parsesolo();
                    if (s10 !== peg$FAILED) {
                      s8 = [s8, s9, s10];
                      s7 = s8;
                    } else {
                      peg$currPos = s7;
                      s7 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s7;
                    s7 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s7;
                  s7 = peg$FAILED;
                }
              }
              if (s6 !== peg$FAILED) {
                if (input.charCodeAt(peg$currPos) === 62) {
                  s7 = peg$c5;
                  peg$currPos++;
                } else {
                  s7 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c6); }
                }
                if (s7 !== peg$FAILED) {
                  s8 = peg$parseWS();
                  if (s8 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c7(s1, s5, s6);
                    s0 = s1;
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };

    return s0;
  }

  function peg$parsedelays(): any {
    let s0, s1, s2, s3, s4, s5, s6, s7, s8, s9;

    const key = peg$currPos * 14 + 3;
    const cached: ICached = peg$resultsCache[key];

    if (cached) {
      peg$currPos = cached.nextPos;

      return cached.result;
    }

    s0 = peg$currPos;
    if (input.charCodeAt(peg$currPos) === 123) {
      s1 = peg$c8;
      peg$currPos++;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c9); }
    }
    if (s1 !== peg$FAILED) {
      s2 = peg$parseWS();
      if (s2 !== peg$FAILED) {
        s3 = peg$parsefloat();
        if (s3 !== peg$FAILED) {
          s4 = peg$parseWS();
          if (s4 !== peg$FAILED) {
            s5 = [];
            s6 = peg$currPos;
            if (input.charCodeAt(peg$currPos) === 44) {
              s7 = peg$c10;
              peg$currPos++;
            } else {
              s7 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c11); }
            }
            if (s7 !== peg$FAILED) {
              s8 = peg$parseWS();
              if (s8 !== peg$FAILED) {
                s9 = peg$parsefloat();
                if (s9 !== peg$FAILED) {
                  s7 = [s7, s8, s9];
                  s6 = s7;
                } else {
                  peg$currPos = s6;
                  s6 = peg$FAILED;
                }
              } else {
                peg$currPos = s6;
                s6 = peg$FAILED;
              }
            } else {
              peg$currPos = s6;
              s6 = peg$FAILED;
            }
            while (s6 !== peg$FAILED) {
              s5.push(s6);
              s6 = peg$currPos;
              if (input.charCodeAt(peg$currPos) === 44) {
                s7 = peg$c10;
                peg$currPos++;
              } else {
                s7 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c11); }
              }
              if (s7 !== peg$FAILED) {
                s8 = peg$parseWS();
                if (s8 !== peg$FAILED) {
                  s9 = peg$parsefloat();
                  if (s9 !== peg$FAILED) {
                    s7 = [s7, s8, s9];
                    s6 = s7;
                  } else {
                    peg$currPos = s6;
                    s6 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s6;
                  s6 = peg$FAILED;
                }
              } else {
                peg$currPos = s6;
                s6 = peg$FAILED;
              }
            }
            if (s5 !== peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 125) {
                s6 = peg$c12;
                peg$currPos++;
              } else {
                s6 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c13); }
              }
              if (s6 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c14(s3, s5);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };

    return s0;
  }

  function peg$parsefloat(): any {
    let s0, s1, s2, s3, s4, s5, s6, s7;

    const key = peg$currPos * 14 + 4;
    const cached: ICached = peg$resultsCache[key];

    if (cached) {
      peg$currPos = cached.nextPos;

      return cached.result;
    }

    s0 = peg$currPos;
    s1 = peg$currPos;
    s2 = peg$currPos;
    s3 = [];
    if (peg$c15.test(input.charAt(peg$currPos))) {
      s4 = input.charAt(peg$currPos);
      peg$currPos++;
    } else {
      s4 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c16); }
    }
    if (s4 !== peg$FAILED) {
      while (s4 !== peg$FAILED) {
        s3.push(s4);
        if (peg$c15.test(input.charAt(peg$currPos))) {
          s4 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s4 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c16); }
        }
      }
    } else {
      s3 = peg$FAILED;
    }
    if (s3 !== peg$FAILED) {
      s4 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 46) {
        s5 = peg$c17;
        peg$currPos++;
      } else {
        s5 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c18); }
      }
      if (s5 !== peg$FAILED) {
        s6 = [];
        if (peg$c15.test(input.charAt(peg$currPos))) {
          s7 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s7 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c16); }
        }
        while (s7 !== peg$FAILED) {
          s6.push(s7);
          if (peg$c15.test(input.charAt(peg$currPos))) {
            s7 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s7 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c16); }
          }
        }
        if (s6 !== peg$FAILED) {
          s5 = [s5, s6];
          s4 = s5;
        } else {
          peg$currPos = s4;
          s4 = peg$FAILED;
        }
      } else {
        peg$currPos = s4;
        s4 = peg$FAILED;
      }
      if (s4 === peg$FAILED) {
        s4 = null;
      }
      if (s4 !== peg$FAILED) {
        s3 = [s3, s4];
        s2 = s3;
      } else {
        peg$currPos = s2;
        s2 = peg$FAILED;
      }
    } else {
      peg$currPos = s2;
      s2 = peg$FAILED;
    }
    if (s2 !== peg$FAILED) {
      s1 = input.substring(s1, peg$currPos);
    } else {
      s1 = s2;
    }
    if (s1 !== peg$FAILED) {
      peg$savedPos = s0;
      s1 = peg$c19(s1);
    }
    s0 = s1;

    peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };

    return s0;
  }

  function peg$parsesolo(): any {
    let s0, s1, s2;

    const key = peg$currPos * 14 + 5;
    const cached: ICached = peg$resultsCache[key];

    if (cached) {
      peg$currPos = cached.nextPos;

      return cached.result;
    }

    s0 = peg$currPos;
    s1 = [];
    s2 = peg$parsebeat();
    if (s2 !== peg$FAILED) {
      while (s2 !== peg$FAILED) {
        s1.push(s2);
        s2 = peg$parsebeat();
      }
    } else {
      s1 = peg$FAILED;
    }
    if (s1 !== peg$FAILED) {
      if (input.charCodeAt(peg$currPos) === 42) {
        s2 = peg$c20;
        peg$currPos++;
      } else {
        s2 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c21); }
      }
      if (s2 === peg$FAILED) {
        s2 = null;
      }
      if (s2 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c22(s1, s2);
        s0 = s1;
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };

    return s0;
  }

  function peg$parsebeat(): any {
    let s0, s1, s2, s3;

    const key = peg$currPos * 14 + 6;
    const cached: ICached = peg$resultsCache[key];

    if (cached) {
      peg$currPos = cached.nextPos;

      return cached.result;
    }

    s0 = peg$parsesync();
    if (s0 === peg$FAILED) {
      s0 = peg$currPos;
      s1 = peg$parseWS();
      if (s1 !== peg$FAILED) {
        if (peg$c23.test(input.charAt(peg$currPos))) {
          s2 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c24); }
        }
        if (s2 === peg$FAILED) {
          s2 = null;
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parseasync();
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c25(s2, s3);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    }

    peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };

    return s0;
  }

  function peg$parsesync(): any {
    let s0, s1, s2, s3, s4, s5, s6, s7, s8, s9;

    const key = peg$currPos * 14 + 7;
    const cached: ICached = peg$resultsCache[key];

    if (cached) {
      peg$currPos = cached.nextPos;

      return cached.result;
    }

    s0 = peg$currPos;
    s1 = peg$parseWS();
    if (s1 !== peg$FAILED) {
      if (input.charCodeAt(peg$currPos) === 40) {
        s2 = peg$c26;
        peg$currPos++;
      } else {
        s2 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c27); }
      }
      if (s2 !== peg$FAILED) {
        s3 = peg$parseasync();
        if (s3 !== peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 44) {
            s4 = peg$c10;
            peg$currPos++;
          } else {
            s4 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c11); }
          }
          if (s4 !== peg$FAILED) {
            s5 = peg$parseasync();
            if (s5 !== peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 41) {
                s6 = peg$c28;
                peg$currPos++;
              } else {
                s6 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c29); }
              }
              if (s6 !== peg$FAILED) {
                s7 = peg$parseWS();
                if (s7 !== peg$FAILED) {
                  if (input.charCodeAt(peg$currPos) === 33) {
                    s8 = peg$c30;
                    peg$currPos++;
                  } else {
                    s8 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c31); }
                  }
                  if (s8 === peg$FAILED) {
                    s8 = null;
                  }
                  if (s8 !== peg$FAILED) {
                    s9 = peg$parseWS();
                    if (s9 !== peg$FAILED) {
                      peg$savedPos = s0;
                      s1 = peg$c32(s3, s5, s8);
                      s0 = s1;
                    } else {
                      peg$currPos = s0;
                      s0 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };

    return s0;
  }

  function peg$parseasync(): any {
    let s0, s1, s2, s3, s4, s5;

    const key = peg$currPos * 14 + 8;
    const cached: ICached = peg$resultsCache[key];

    if (cached) {
      peg$currPos = cached.nextPos;

      return cached.result;
    }

    s0 = peg$parsetoss();
    if (s0 === peg$FAILED) {
      s0 = peg$currPos;
      s1 = peg$parseWS();
      if (s1 !== peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 91) {
          s2 = peg$c33;
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c34); }
        }
        if (s2 !== peg$FAILED) {
          s3 = [];
          s4 = peg$parsetoss();
          if (s4 !== peg$FAILED) {
            while (s4 !== peg$FAILED) {
              s3.push(s4);
              s4 = peg$parsetoss();
            }
          } else {
            s3 = peg$FAILED;
          }
          if (s3 !== peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 93) {
              s4 = peg$c35;
              peg$currPos++;
            } else {
              s4 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c36); }
            }
            if (s4 !== peg$FAILED) {
              s5 = peg$parseWS();
              if (s5 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c37(s3);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    }

    peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };

    return s0;
  }

  function peg$parsetoss(): any {
    let s0, s1, s2, s3, s4;

    const key = peg$currPos * 14 + 9;
    const cached: ICached = peg$resultsCache[key];

    if (cached) {
      peg$currPos = cached.nextPos;

      return cached.result;
    }

    s0 = peg$currPos;
    s1 = peg$parseWS();
    if (s1 !== peg$FAILED) {
      s2 = peg$parsessThrow();
      if (s2 !== peg$FAILED) {
        s3 = peg$parsethrowMods();
        if (s3 !== peg$FAILED) {
          s4 = peg$parseWS();
          if (s4 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c38(s2, s3);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };

    return s0;
  }

  function peg$parsethrowMods(): any {
    let s0, s1;

    const key = peg$currPos * 14 + 10;
    const cached: ICached = peg$resultsCache[key];

    if (cached) {
      peg$currPos = cached.nextPos;

      return cached.result;
    }

    s0 = peg$parsepassMods();
    if (s0 === peg$FAILED) {
      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 120) {
        s1 = peg$c39;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c40); }
      }
      if (s1 === peg$FAILED) {
        s1 = null;
      }
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c41(s1);
      }
      s0 = s1;
    }

    peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };

    return s0;
  }

  function peg$parsepassMods(): any {
    let s0, s1, s2, s3;

    const key = peg$currPos * 14 + 11;
    const cached: ICached = peg$resultsCache[key];

    if (cached) {
      peg$currPos = cached.nextPos;

      return cached.result;
    }

    s0 = peg$currPos;
    if (input.charCodeAt(peg$currPos) === 112) {
      s1 = peg$c42;
      peg$currPos++;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c43); }
    }
    if (s1 !== peg$FAILED) {
      if (input.charCodeAt(peg$currPos) === 120) {
        s2 = peg$c39;
        peg$currPos++;
      } else {
        s2 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c40); }
      }
      if (s2 === peg$FAILED) {
        s2 = null;
      }
      if (s2 !== peg$FAILED) {
        if (peg$c44.test(input.charAt(peg$currPos))) {
          s3 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c45); }
        }
        if (s3 === peg$FAILED) {
          s3 = null;
        }
        if (s3 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c46(s1, s2, s3);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };

    return s0;
  }

  function peg$parsessThrow(): any {
    let s0, s1, s2, s3, s4, s5, s6, s7;

    const key = peg$currPos * 14 + 12;
    const cached: ICached = peg$resultsCache[key];

    if (cached) {
      peg$currPos = cached.nextPos;

      return cached.result;
    }

    s0 = peg$currPos;
    s1 = peg$currPos;
    s2 = peg$currPos;
    if (peg$c47.test(input.charAt(peg$currPos))) {
      s3 = input.charAt(peg$currPos);
      peg$currPos++;
    } else {
      s3 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c48); }
    }
    if (s3 !== peg$FAILED) {
      s4 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 46) {
        s5 = peg$c17;
        peg$currPos++;
      } else {
        s5 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c18); }
      }
      if (s5 !== peg$FAILED) {
        s6 = [];
        if (peg$c15.test(input.charAt(peg$currPos))) {
          s7 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s7 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c16); }
        }
        if (s7 !== peg$FAILED) {
          while (s7 !== peg$FAILED) {
            s6.push(s7);
            if (peg$c15.test(input.charAt(peg$currPos))) {
              s7 = input.charAt(peg$currPos);
              peg$currPos++;
            } else {
              s7 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c16); }
            }
          }
        } else {
          s6 = peg$FAILED;
        }
        if (s6 !== peg$FAILED) {
          s5 = [s5, s6];
          s4 = s5;
        } else {
          peg$currPos = s4;
          s4 = peg$FAILED;
        }
      } else {
        peg$currPos = s4;
        s4 = peg$FAILED;
      }
      if (s4 === peg$FAILED) {
        s4 = null;
      }
      if (s4 !== peg$FAILED) {
        s3 = [s3, s4];
        s2 = s3;
      } else {
        peg$currPos = s2;
        s2 = peg$FAILED;
      }
    } else {
      peg$currPos = s2;
      s2 = peg$FAILED;
    }
    if (s2 !== peg$FAILED) {
      s1 = input.substring(s1, peg$currPos);
    } else {
      s1 = s2;
    }
    if (s1 !== peg$FAILED) {
      peg$savedPos = s0;
      s1 = peg$c49(s1);
    }
    s0 = s1;

    peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };

    return s0;
  }

  function peg$parseWS(): any {
    let s0, s1;

    const key = peg$currPos * 14 + 13;
    const cached: ICached = peg$resultsCache[key];

    if (cached) {
      peg$currPos = cached.nextPos;

      return cached.result;
    }

    s0 = [];
    if (input.charCodeAt(peg$currPos) === 32) {
      s1 = peg$c50;
      peg$currPos++;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c51); }
    }
    while (s1 !== peg$FAILED) {
      s0.push(s1);
      if (input.charCodeAt(peg$currPos) === 32) {
        s1 = peg$c50;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c51); }
      }
    }

    peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };

    return s0;
  }

  peg$result = peg$startRuleFunction();

  if (peg$result !== peg$FAILED && peg$currPos === input.length) {
    return peg$result;
  } else {
    if (peg$result !== peg$FAILED && peg$currPos < input.length) {
      peg$fail(peg$endExpectation());
    }

    throw peg$buildStructuredError(
      peg$maxFailExpected,
      peg$maxFailPos < input.length ? input.charAt(peg$maxFailPos) : null,
      peg$maxFailPos < input.length
        ? peg$computeLocation(peg$maxFailPos, peg$maxFailPos + 1)
        : peg$computeLocation(peg$maxFailPos, peg$maxFailPos)
    );
  }
}

export interface IParseOptions {
  filename?: string;
  startRule?: string;
  tracer?: any;
  [key: string]: any;
}
export type ParseFunction = (input: string, options?: IParseOptions) => any;
export const parse: ParseFunction = peg$parse;

