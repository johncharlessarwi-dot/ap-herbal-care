const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const page = name => fs.readFileSync(path.join(__dirname, '..', name), 'utf8');

test('site has a homepage', () => { assert.match(page('index.html'), /<html lang="sw">/); });
test('homepage avoids absolute chemical-free claims', () => { assert.doesNotMatch(page('index.html'), /Hakuna kemikali hatari/i); });
test('homepage avoids unsupported cure promise', () => { assert.doesNotMatch(page('index.html'), /asili katika kuponya/i); });
test('product page avoids unverified immunity enhancement', () => { assert.doesNotMatch(page('products.html'), /kuimarisha kinga ya mwili/i); });
test('product page avoids anxiety treatment promise', () => { assert.doesNotMatch(page('products.html'), /kupunguza wasiwasi/i); });
test('services page avoids guaranteed recovery journey', () => { assert.doesNotMatch(page('services.html'), /safari yako ya kupona/i); });
test('contact menu button uses explicit type', () => { assert.match(page('contact.html'), /<button type="button" class="hamburger"/); });
test('services menu button uses explicit type', () => { assert.match(page('services.html'), /<button type="button" class="hamburger"/); });
