import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const source = readFileSync('build/tools/entropy-core.js', 'utf8');
const pageSource = readFileSync('build/tools/entropy-page.mjs', 'utf8');
const C = new Function(`${source}\nreturn EntropyCore;`)();

test('chi-square p-values match published critical values', () => {
  assert.ok(Math.abs(C.chiSquaredPValue(11.070, 5) - 0.05) < 0.001);
  assert.ok(Math.abs(C.chiSquaredPValue(27.204, 19) - 0.10) < 0.001);
  assert.equal(C.chiSquaredPValue(0, 5), 1);
});

test('an even D6 sequence has no strong detected imbalance', () => {
  const [report] = C.dieDistributionReports('dice', '123456'.repeat(5));
  assert.equal(report.samples, 30);
  assert.equal(report.score, 0);
  assert.equal(report.p, 1);
  assert.equal(report.state, 'balanced');
  assert.deepEqual(report.counts.map(face => face.count), [5, 5, 5, 5, 5, 5]);
  assert.ok(report.counts.every(face => !face.unusual));
});

test('an all-one D6 sequence is unusually uneven', () => {
  const [report] = C.dieDistributionReports('dice', '1'.repeat(30));
  assert.equal(report.state, 'uneven');
  assert.ok(report.p < 0.001);
  assert.ok(report.counts.find(face => face.label === '1').unusual);
  assert.ok(report.counts.find(face => face.label === '2').unusual);
});

test('the five-observations-per-face rule withholds early verdicts', () => {
  const [report] = C.dieDistributionReports('dice', '123456');
  assert.equal(report.minimum, 30);
  assert.equal(report.state, 'insufficient');
  assert.ok(report.counts.every(face => !face.unusual));
});

test('standalone coin flips receive their own two-outcome report', () => {
  const [report] = C.dieDistributionReports('coin', 'HT'.repeat(64));
  assert.equal(report.title, 'Coin');
  assert.deepEqual(report.counts.map(face => face.count), [64, 64]);
  assert.equal(report.state, 'balanced');
});

test('BitBox keeps its four-sided dice and coin samples separate', () => {
  const [dice, coin] = C.dieDistributionReports('bitbox', '11111H22222T33333H44444T');
  assert.deepEqual(dice.counts.map(face => face.count), [5, 5, 5, 5]);
  assert.deepEqual(coin.counts.map(face => face.count), [2, 2]);
});

test('octal and hexadecimal dice are not mixed into one distribution', () => {
  const [octal, hex] = C.dieDistributionReports('octahex', '10F8AB');
  assert.deepEqual(octal.counts.map(face => face.count), [1, 0, 0, 0, 0, 0, 0, 1]);
  assert.equal(hex.samples, 4);
  assert.equal(hex.counts.find(face => face.label === '0').count, 1);
  assert.equal(hex.counts.find(face => face.label === 'F').count, 1);
});

test('the inspector is collapsed, dice-and-coin-only, and withheld until entry is complete', () => {
  assert.match(pageSource, /<details class="distribution" id="distribution">/);
  assert.doesNotMatch(pageSource, /<details class="distribution" id="distribution" open>/);
  assert.match(pageSource, /const relevant = state\.source === 'dice' \|\| state\.source === 'coin'/);
  assert.match(pageSource, /if \(!progress\.ready\)/);
  assert.match(pageSource, /The chart stays withheld while you are still entering outcomes/);
  assert.match(pageSource, /Do not edit, reroll or reflip individual outcomes in response/);
});

test('the chart uses compact horizontal tracks with gated per-outcome warnings', () => {
  assert.match(pageSource, /\.distribution-track/);
  assert.match(pageSource, /bar\.style\.width/);
  assert.doesNotMatch(pageSource, /bar\.style\.height/);
  assert.match(pageSource, /if \(face\.unusual\) item\.classList\.add\('is-unusual'\)/);
  assert.match(pageSource, /Red marks an outcome that contributes strongly/);
});
