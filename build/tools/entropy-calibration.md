# Entropy fabrication-gate calibration

This is a deterministic Monte Carlo exercise of the Workshop's current
project-specific refusal rules. It measures how often those rules reject input
generated from the ideal model for each supported method. It is not an
entropy-source validation, and zero refusals do not prove that an input or a
generator is random.

Reproduce the report from the repository root:

```text
npm run test:entropy -- --calibrate --samples 1000000 --seed 0x5ec0c7d1
```

The command runs all cryptographic and conversion vectors before the
calibration. The simulation uses Mulberry32 solely to make the exercise stable
across runs; it is never used to create wallet entropy.

## Recorded result

Run on 2026-08-30 with Node.js 22. The one million sequences are split as
evenly as possible across 15 profiles. No simulated sequence was refused.
No profile produced an input or step sequence repeating three or more times,
which is the common period-rejection boundary.

| Profile | Samples | Event range | Min distinct | Max run | Max chi-square | Min LZ | Max adjacent | Max same-suit | Max suit run |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Dice, 50 rolls | 66,667 | 50 | 5 | 9 | 33.0400 | 0.9170 | — | — | — |
| Dice, 99 rolls | 66,667 | 99 | 6 | 9 | 34.7576 | 1.0103 | — | — | — |
| Dice, 500-roll ceiling | 66,667 | 500 | 6 | 11 | 30.4720 | 1.1376 | — | — | — |
| Dice bit table, 128 bits | 66,667 | 68–88 | 6 | 10 | 35.2973 | 0.9783 | — | — | — |
| Dice bit table, 256 bits | 66,667 | 141–170 | 6 | 10 | 30.6753 | 1.0741 | — | — | — |
| BitBox, 23 lookup words | 66,667 | 115 | 4 | 11 | 25.5565 | 1.1905 | — | — | — |
| Octal/hex, 11 lookup words | 66,667 | 22 | 7 | 5 | 58.0000 | 0.6081 | — | — | — |
| Octal/hex, 23 lookup words | 66,667 | 46 | 11 | 6 | 50.6957 | 0.7505 | — | — | — |
| Coin, 128 flips | 66,667 | 128 | 2 | 22 | 22.7813 | 1.6406 | — | — | — |
| Coin, 256 flips | 66,667 | 256 | 2 | 26 | 21.3906 | 1.6875 | — | — | — |
| Cards, 25-card draw | 66,666 | 25 | 25 | 1 | 27.0000 | 0.8146 | 0.3333 | 0.6250 | 8 |
| Cards, 58-card draw | 66,666 | 58 | 52 | 2 | 4.7586 | 0.9745 | 0.1754 | 0.5263 | 9 |
| Cards, 104-card ceiling | 66,666 | 104 | 52 | 2 | 0.0000 | 0.8816 | 0.1456 | 0.4466 | 9 |
| Card bit table, 128 bits | 66,666 | 27–31 | 27 | 1 | 25.0000 | 0.8341 | 0.2593 | 0.5926 | 9 |
| Card bit table, 256 bits | 66,666 | 57–60 | 52 | 2 | 5.8667 | 0.9620 | 0.1607 | 0.5088 | 9 |

This report estimates only false refusals under the stated idealized models.
It does not measure how well a person rolls, flips, or shuffles, and it does not
turn a statistical check into evidence that an unknown sequence is
unpredictable.

## Decision boundaries exercised

| Profile family | Distinct | Identical run | Chi-square | LZ | Card adjacency | Same-suit adjacency | Suit run |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Six-sided dice | reject below 4 | reject at 15 | reject above 55 | reject below 0.55 | — | — | — |
| BitBox four-sided dice | reject below 3 | reject at 13 | reject above 40 | reject below 0.50 | — | — | — |
| Octal/hex method, hex dice | reject below 7 | reject at 8 | reject above 80 | reject below 0.50 | — | — | — |
| Coin flips | reject below 2 | reject at 34 | reject above 40 | reject below 0.55 | — | — | — |
| Cards | reject below 2 | reject at 3 | disabled | disabled | reject above 0.40 | reject above 0.80 | reject at 13 |

Every family also refuses an input or ordinal-step sequence whose smallest
period repeats at least three times. Card inputs are additionally required to
contain no repeated card within one pass through a deck; that deterministic
validity check is separate from the statistical fabrication gate measured
here.
