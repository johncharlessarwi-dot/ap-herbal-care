const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const source = fs.readFileSync(path.join(__dirname, '..', 'main.js'), 'utf8');

function runPage({ sectionMatch }) {
  const attributes = new Map([['href', 'contact.html']]);
  const classes = new Set();
  const link = {
    classList: { add: name => classes.add(name), remove: name => classes.delete(name) },
    getAttribute: name => attributes.get(name),
    setAttribute: (name, value) => attributes.set(name, value),
    removeAttribute: name => attributes.delete(name)
  };
  const section = { id: 'contact' };
  let onSections;
  const document = {
    getElementById: () => null,
    querySelectorAll(selector) {
      if (selector === '.nav-links a') return [link];
      if (selector === 'section[id], header[id]') return [section];
      if (selector === '.service-card, .contact-card, .why-point, .about-text, .about-visual, .product-card') return [];
      return [];
    },
    querySelector: () => sectionMatch ? link : null
  };
  const window = {
    location: { pathname: '/contact.html' },
    matchMedia: () => ({ matches: true })
  };
  class IntersectionObserver {
    constructor(callback) { onSections = callback; }
    observe() {}
  }
  window.IntersectionObserver = IntersectionObserver;
  vm.runInNewContext(source, { document, window, IntersectionObserver });
  assert.equal(classes.has('active'), true, 'the current page starts active');
  onSections([{ isIntersecting: true, target: section }]);
  return { classes, attributes };
}

test('scrolling a section without a matching hash link preserves current page highlight', () => {
  const { classes, attributes } = runPage({ sectionMatch: false });
  assert.equal(classes.has('active'), true);
  assert.equal(attributes.get('aria-current'), 'page');
});

test('a matching section link is marked as the current location', () => {
  const { classes, attributes } = runPage({ sectionMatch: true });
  assert.equal(classes.has('active'), true);
  assert.equal(attributes.get('aria-current'), 'location');
});
