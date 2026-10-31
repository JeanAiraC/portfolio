const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const root = path.resolve(__dirname, '..', '..');
test('production build minifies public files without changing editable sources', () => {
  const files = ['index.html', 'styles.css', 'script.js'];
  const before = files.map(file => fs.readFileSync(path.join(root, file)));
  execFileSync(process.execPath, [path.join(root, 'tools', 'build.cjs')], { cwd: root });
  files.forEach((file, index) => {
    const source = fs.readFileSync(path.join(root, file));
    const built = fs.readFileSync(path.join(root, 'dist', file));
    assert.deepEqual(source, before[index]);
    assert.ok(built.length < source.length, `${file} must be smaller`);
  });
  execFileSync(process.execPath, ['--check', path.join(root, 'dist', 'script.js')]);
  const html = fs.readFileSync(path.join(root, 'dist', 'index.html'), 'utf8');
  assert.match(html, /lang="en"/);
  assert.match(html, /src="script.js"/);
  assert.match(html, /href="styles.css"/);
  assert.match(html, /class="contact-form"/);
  assert.match(html, /AI Explorer by Curiosity\./);
  const favicon = html.match(/<link\b[^>]*rel="icon"[^>]*href="([^"]+)"/);
  assert.ok(favicon, 'production page must include a browser-tab icon');
  const icon = decodeURIComponent(favicon[1]);
  assert.match(icon, /^data:image\/svg\+xml,<svg /);
  assert.match(icon, /viewBox='0 0 64 64'/);
  assert.match(icon, />JEAN<\/text>/);
  assert.match(icon, />CIR<\/text>/);
  assert.doesNotMatch(html, /<!--/);
  assert.doesNotThrow(() => JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]));
  assert.deepEqual(fs.readFileSync(path.join(root, 'dist', 'resume.pdf')), fs.readFileSync(path.join(root, 'resume.pdf')));
  for (const asset of fs.readdirSync(path.join(root, 'assets'))) {
    if (asset.endsWith('.svg')) assert.ok(fs.existsSync(path.join(root, 'dist', 'assets', asset)));
  }
  for (const privateFile of ['README.md', '.env', 'tools', '.tsupgrader', 'package.json', 'node_modules', 'script.js.map']) {
    assert.ok(!fs.existsSync(path.join(root, 'dist', privateFile)), `${privateFile} must not be deployed`);
  }
});
