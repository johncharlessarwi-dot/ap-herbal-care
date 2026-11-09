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

test('contact.html footer strips referrer for Facebook links', () => { assert.match(page('contact.html'), /target="_blank" rel="noopener noreferrer">Facebook/); });

test('Netlify config enables Cross-Origin-Opener-Policy', () => { assert.ok(page('netlify.toml').includes("Cross-Origin-Opener-Policy = \"same-origin\"")); });

test('Netlify config enables X-DNS-Prefetch-Control', () => { assert.ok(page('netlify.toml').includes("X-DNS-Prefetch-Control = \"off\"")); });

test('Netlify config enables Strict-Transport-Security', () => { assert.ok(page('netlify.toml').includes("Strict-Transport-Security = \"max-age=31536000\"")); });

test('Netlify config enables Content-Security-Policy', () => { assert.match(page('netlify.toml'), /Content-Security-Policy = "base-uri 'self'; object-src 'none'; frame-ancestors 'none'/); });

test('homepage avoids inline script execution', () => { assert.doesNotMatch(page('index.html'), /<script(?![^>]*\bsrc=)[^>]*>/i); });

test('CSP restricts script execution to same origin', () => { assert.match(page('netlify.toml'), /script-src 'self'/); });

test('CSP restricts native form posts to same origin', () => { assert.match(page('netlify.toml'), /form-action 'self'/); });

test('index.html limits document referrer disclosure', () => { assert.match(page('index.html'), /<meta name="referrer" content="no-referrer"/); });

test('index.html font request strips referrer', () => { assert.match(page('index.html'), /fonts\.googleapis\.com\/css2[^\n]+referrerpolicy="no-referrer"/); });

test('about.html limits document referrer disclosure', () => { assert.match(page('about.html'), /<meta name="referrer" content="no-referrer"/); });

test('about.html font request strips referrer', () => { assert.match(page('about.html'), /fonts\.googleapis\.com\/css2[^\n]+referrerpolicy="no-referrer"/); });
