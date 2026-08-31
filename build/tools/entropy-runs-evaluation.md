# Experimental runs-test evaluation

Status: **calibration only; not used to accept or refuse input**.

The Workshop's deterministic calibration harness evaluates the large-sample
Wald-Wolfowitz runs statistic documented by the [NIST Engineering Statistics
Handbook](https://www.itl.nist.gov/div898/handbook/eda/section3/eda35d.htm).
A run is one uninterrupted group of the same binary category. The published
statistic compares the observed run count with the run count expected after
conditioning on how often each category appears.

NIST says the normal approximation applies when both category counts exceed
ten. The experiment follows that boundary and does not calculate an acceptance
decision when either count is ten or fewer.

## How each method is reduced to two categories

| Method | First category | Second category |
| --- | --- | --- |
| Coin | Tails | Heads |
| Six-sided dice | 1–3 | 4–6 |
| BitBox four-sided dice | 1–2 | 3–4 |
| Hex dice in the octal/hex method | 0–7 | 8–F |
| Cards | Black | Red |

The BitBox coin column and octal die are already separate physical sources and
are not mixed into their dice sequence. Card colour is tested in draw order;
the run formula conditions on the red and black totals actually present in a
partial draw.

## One-million-sequence result

Reproduce from the repository root:

```text
npm run test:entropy -- --calibrate --samples 1000000 --seed 0x5ec0c7d1
```

The 2026-08-30 seeded run produced 925,068 profiles eligible for the NIST
large-sample approximation:

| Boundary | Eligible simulations beyond it | Meaning here |
| --- | ---: | --- |
| `|Z| > 1.96` | 45,882 (4.96%) | NIST's ordinary 5% example is much too aggressive for a wallet-blocking check. |
| `|Z| >= 4` | 44 | Still rejects legitimate ideal-model simulations. |
| `|Z| >= 5` | 0 | None observed; highest absolute Z was 4.4893. |
| `|Z| >= 6` | 0 | Candidate conservative boundary retained only for comparison. |

The 74,932 ineligible profiles were concentrated in short inputs: only a
perfect 11/11 split makes the 22 judged hex throws of the 12-word octal/hex
method eligible, and some short card draws also have ten or fewer cards of one
colour. A future check must skip those inputs rather than quietly applying a
large-sample formula outside its stated conditions.

Zero observations do not prove a zero false-refusal probability. In particular,
one seeded Monte Carlo run cannot by itself establish the far tail implied by a
Z score of six. It shows that the candidate has headroom over every ideal-model
sequence exercised here; it is not a certification.

## What it catches that the current gate does not

The harness deterministically constructs category-transition counterexamples
whose face counts, identical-face runs, periods and compression still pass the
current gate:

| Counterexample | Current gate | Runs Z | `|Z| >= 6` |
| --- | --- | ---: | --- |
| Coin, clustered transitions | allowed | -8.4943 | yes |
| Coin, excessive transitions | allowed | 9.1445 | yes |
| Dice, clustered low/high groups | allowed | -7.6776 | yes |
| Dice, excessive low/high switching | allowed | 6.9861 | yes |
| Cards, colours dealt in two groups | allowed | -7.0027 | yes |
| Cards, colours forced to alternate | allowed | 7.0027 | yes |

These are diagnostic constructions, not claims about how a particular person
would fabricate a sequence. Their value is showing a genuine blind spot:
ordering dependence can survive the current frequency, exact-period and
complexity checks.

## Why it can only supplement the existing checks

Some obvious periodic fabrications have an ordinary number of binary runs:

| Existing rejected pattern | Runs Z | `|Z| >= 6` |
| --- | ---: | --- |
| Coin, `HHTT` repeated | -0.1252 | no |
| Dice, `123456` repeated | -3.5298 | no |
| Cards, stepped by rank | 0.0000 | no |

The existing period and step-period checks catch all three. A runs test would
therefore be an additional transition-order check, never a replacement.

## Recommendation

Do not use NIST's illustrative 5% boundary for enforcement. Keep this test
non-blocking for now. If it is promoted later, the evidence supports evaluating
only inputs with both category counts above ten and using `|Z| >= 6` as a
conservative candidate. That behavior change should have its own PR, explicit
vectors, a new full calibration report, and plain-language refusal wording.
