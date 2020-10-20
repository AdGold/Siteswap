# Siteswap notation

Accepted syntax:
- Vanilla siteswap: 0-9, a-z, x means go to opposite hand from normal, can add a space to deal with any ambiguities (e.g. '5 x' is a period two pattern whereas '5x' is period 1)
- Multiplexes: any number of throws in square brackets
- Sync: (left hand, right hand), '\*' to say 'repeat on other side'
- Passing

Passing:
<juggler 1 | juggler 2 | ... >
A 'p' means to pass to the next juggler in the list (wrapping around as needed), and 'x' after the pass means that the pass is crossing (R->R/L->L) instead of straight (R->L/L->R).
A 'pA' means to pass to juggler A (capital letter)
Pass values can be fractional, juggler delays are automatically inferred, fractional values must be close to actual values (if over 3 jugglers 2 decimal places should be used)


Shortcuts:
- (5^10)97531 is short for 555555555597531
- <juggler 1 | ^N > is short for <juggler 1 | juggler 1 | ... > to have all N jugglers doing the same thing


