const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { buildSite } = require('../scripts/build-site.js');

const root = path.join(__dirname, '..');
const pages = ['404.html', 'about.html', 'contact.html', 'index.html', 'products.html', 'services.html'];

function tempDirectory(t) {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'herbal-care-publish-'));
  t.after(() => fs.rmSync(directory, { recursive: true, force: true }));
  return directory;
}

test('publish output contains only the public pages, resources, and linked images', t => {
  const output = path.join(tempDirectory(t), 'dist');
  buildSite(root, output);

  assert.deepEqual(fs.readdirSync(output).sort(), [...pages, 'images', 'main.js', 'style.css'].sort());
  const images = new Set();
  for (const page of pages) {
    const html = fs.readFileSync(path.join(output, page), 'utf8');
    for (const [, image] of html.matchAll(/<img\b[^>]*\bsrc="(?:\.\/)?images\/([^"/]+)"/g)) {
      images.add(image);
    }
  }
  assert.ok(images.size > 0);
  assert.deepEqual(fs.readdirSync(path.join(output, 'images')).sort(), [...images].sort());
});

test('both hosts publish only the build output and enforce the same resource policy', () => {
  const netlify = fs.readFileSync(path.join(root, 'netlify.toml'), 'utf8');
  const vercel = JSON.parse(fs.readFileSync(path.join(root, 'vercel.json'), 'utf8'));
  const [, command, output] = netlify.match(/^\[build\]\s+command = "([^"]+)"\s+publish = "([^"]+)"/m);
  const [, policy] = netlify.match(/^\s*Content-Security-Policy = "([^"]+)"/m);
  const globalHeaders = vercel.headers.find(rule => rule.source === '/(.*)').headers;

  assert.equal(command, 'node scripts/build-site.js');
  assert.equal(output, 'dist');
  assert.equal(vercel.buildCommand, command);
  assert.equal(vercel.outputDirectory, output);
  assert.equal(globalHeaders.find(header => header.key === 'Content-Security-Policy').value, policy);
});

test('publish leaves an existing destination unchanged', t => {
  const output = tempDirectory(t);
  fs.writeFileSync(path.join(output, 'old-file.txt'), 'stale output');

  assert.throws(() => buildSite(root, output), { code: 'EEXIST' });
  assert.deepEqual(fs.readdirSync(output), ['old-file.txt']);
});

test('publish rejects symlinked site files before creating output', t => {
  const directory = tempDirectory(t);
  const output = path.join(directory, 'dist');
  fs.writeFileSync(path.join(directory, 'fixture.html'), '<p>Sample</p>');
  fs.symlinkSync('fixture.html', path.join(directory, 'index.html'));

  assert.throws(() => buildSite(directory, output), /Expected a regular site file, without symlinks: index\.html/);
  assert.equal(fs.existsSync(output), false);
});
