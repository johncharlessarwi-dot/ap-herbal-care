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
test('contact social link uses noreferrer', () => { assert.match(page('contact.html'), /target="_blank" rel="noopener noreferrer"/); });
test('contact page exposes callable phone', () => { assert.match(page('contact.html'), /href="tel:\+255620354744"/); });
test('contact page exposes business WhatsApp', () => { assert.match(page('contact.html'), /https:\/\/wa\.me\/255620354744/); });
test('homepage has health information notice', () => { assert.match(page('index.html'), /class="health-notice" role="note"/); });
test('services page has safety information', () => { assert.match(page('services.html'), /class="health-notice" role="note"/); });
test('products page has safety information', () => { assert.match(page('products.html'), /class="health-notice" role="note"/); });
test('about page has safety information', () => { assert.match(page('about.html'), /class="health-notice" role="note"/); });
test('contact page has safety information', () => { assert.match(page('contact.html'), /class="health-notice" role="note"/); });
test('notice discourages substitution for medical advice', () => { assert.match(page('index.html'), /mbadala wa ushauri wa mtaalamu wa afya/); });
test('notice encourages discussion of interactions', () => { assert.match(page('products.html'), /mwingiliano na dawa/); });
test('Netlify protects resource embedding', () => { assert.match(page('netlify.toml'), /Cross-Origin-Resource-Policy = "same-origin"/); });
test('Netlify disallows legacy cross-domain policy', () => { assert.match(page('netlify.toml'), /X-Permitted-Cross-Domain-Policies = "none"/); });
test('safety notice has high-contrast background', () => { assert.match(page('style.css'), /\.health-notice\s*\{/); });

test('index.html footer strips referrer for external Facebook links', () => { assert.match(page('index.html'), /target="_blank" rel="noopener noreferrer">Facebook/); });

test('about.html footer strips referrer for external Facebook links', () => { assert.match(page('about.html'), /target="_blank" rel="noopener noreferrer">Facebook/); });

test('products.html footer strips referrer for Facebook links', () => { assert.match(page('products.html'), /target="_blank" rel="noopener noreferrer">Facebook/); });
