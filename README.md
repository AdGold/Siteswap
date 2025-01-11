universal-siteswap
---

This is a full-featured siteswap validation and analysis library for JavaScript & TypeScript that supports all extended siteswap including async, sync, multiplex, passing and any combination thereof. It supports 4-handed siteswap (and generally k-handed siteswap) and can calculate transitions, stack notation equivalents and convert to/from [JIF](https://github.com/helbling/jif) for use in other programs. See [Siteswap.html](https://github.com/AdGold/universal-siteswap/blob/main/public/Siteswap.html) for a simple example of what it can do or a live version [here](https://diagonalrewards.com/juggling/Siteswap/public/Siteswap.html).

# Installation

`npm install universal-siteswap`

# Usage

## Parsing

Can parse vanilla, multiplex, sync and passing siteswaps, or convert from k-handed siteswap notation

```js
const ss97531 = Siteswap.Parse('97531');
const multiplex = Siteswap.Parse('[43]23');
const ss6x4 = Siteswap.Parse('(6x,4)*');
const eight_object_2count = Siteswap.Parse('<(4p,4)|(4p,4)>');
const french_3count = Siteswap.ParseKHSS('867', 4);
```

### Accepted syntax

Basic siteswap:
- Vanilla siteswap: 0-9, a-z, x means go to opposite hand from normal, can add a space to deal with any ambiguities (e.g. `5 x` is a period two pattern whereas `5x` is period one)
- Multiplexes: any number of throws in square brackets
- Sync: (left hand, right hand), Add `!` to skip the implicit empty beat after the sync pair of throws (useful for sync->async transitions)

Passing:
`<juggler 1 | juggler 2 | ... >`
A `p` means to pass to the next juggler in the list (wrapping around as needed), and `x` after the pass means that the pass is crossing (R->R/L->L) instead of straight (R->L/L->R).
A `pA` means to pass to juggler A (`A` can be any capital letter)
Pass values can be fractional, juggler delays are automatically inferred where unambiguous, fractional values must be close to actual values (if 4 jugglers or more than 5 jugglers, 2 decimal places should be used)

Shortcuts:
- Add a `\*` at the end to repeat on the other side: `(6x,4)*` is short for `(6x,4)(4,6x)`
- Repeat subsections: `(5^5)97531(72^2)1` is short for `555559753175751`
- Duplicate jugglers doing the same thing: `<3p | ^3 >` is short for `<3p|3p|3p>` to have all jugglers doing the same thing

## States and transitions

State objects are automatically generated from the siteswap and can be used to find custom transitions. This is in addition to the `.entry()` and `.exit()` methods above.

`State.ShortestTransition(s1, s2, allowFlipped)` finds the shortest transition between states, if allowFlipped is true then it accepts coming out in the symmetric state (e.g. (1, 0) instead of (0, 1)). This makes vanilla siteswap transitions cleaner and should generally be set to true.

`State.AllTransitionsOfLength(s1, s2, length)` returns all transitions of the specified length. The minimum valid length can be found with `State.ShortestTransitionLength(s1, s2)`.

## VanillaSiteswap and stack notation

There are times when it is better to explicitly only model basic vanilla siteswaps with multiplexes. The class `VanillaSiteswap` does this, and can be converted into a `Siteswap` using `Siteswap.FromKHSS(vanillaSiteswap)` (defaults to 2 handed but can be changed to any handedness).

`VanillaSiteswap` also allows conversion to/from stack notation using `VanillaSiteswap.ParseStack` and `siteswap.toStack()`/`siteswap.toStackString()`.

## Conversion to/from JIF

`Siteswap` objects can be converted to [JIF](https://github.com/helbling/jif). JIF is still in an early format but the current version can be used with Christian's wonderful animator from [passist.org](https://passist.org), see [here](https://github.com/helbling/passist/tree/main/static/api) for details.

Heuristic conversion from JIF into a `Siteswap` is implemented and will work for most patterns, but not all, and may result in loss of precision as JIF is a more detailed description.
