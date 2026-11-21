import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const config = readFileSync(new URL("../netlify.toml", import.meta.url), "utf8");

test("Netlify applies security headers to every static page", () => {
  assert.match(config, /\[\[headers\]\]\s*\n\s*for\s*=\s*"\/\*"/);
  assert.match(config, /\[headers\.values\]/);
});

test("security headers prevent MIME sniffing and framing", () => {
  assert.match(config, /^\s*X-Content-Type-Options\s*=\s*"nosniff"/m);
  assert.match(config, /^\s*X-Frame-Options\s*=\s*"DENY"/m);
  assert.match(config, /frame-ancestors 'none'/);
  assert.match(config, /object-src 'none'/);
});

test("CSP excludes inline scripts and disallows form submission to third parties", () => {
  const policy = /^\s*Content-Security-Policy\s*=\s*"([^"]+)"/m.exec(config)?.[1];
  assert.ok(policy);
  assert.match(policy, /script-src 'self'/);
  assert.match(policy, /form-action 'self'/);
  assert.doesNotMatch(policy, /unsafe-eval|unsafe-inline/);
});

test("privacy headers remove sensitive browser capabilities", () => {
  assert.match(config, /^\s*Permissions-Policy\s*=\s*"[^"]*geolocation=\(\)/m);
  assert.match(config, /^\s*Referrer-Policy\s*=\s*"strict-origin-when-cross-origin"/m);
  assert.match(config, /^\s*Strict-Transport-Security\s*=\s*"max-age=\d+"/m);
});
