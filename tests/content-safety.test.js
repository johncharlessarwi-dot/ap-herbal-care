const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const page = name => fs.readFileSync(path.join(__dirname, '..', name), 'utf8');

test('site has a homepage', () => { assert.match(page('index.html'), /<html lang="sw">/); });
test('homepage avoids absolute chemical-free claims', () => { assert.doesNotMatch(page('index.html'), /Hakuna kemikali hatari/i); });
test('homepage avoids unsupported cure promise', () => { assert.doesNotMatch(page('index.html'), /asili katika kuponya/i); });
