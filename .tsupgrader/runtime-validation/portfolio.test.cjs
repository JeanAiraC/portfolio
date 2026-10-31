const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..', '..');
const script = fs.readFileSync(path.join(root, 'script.js'), 'utf8');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
function sourceBetween(start, end) {
  const from = script.indexOf(start);
  const to = script.indexOf(end, from);
  assert.ok(from >= 0 && to > from, `Source boundaries: ${start}`);
  return script.slice(from, to);
}

test('senior profile is consistent across SEO, page and downloadable PDF', () => {
  const schema = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
  assert.equal(schema.mainEntity.jobTitle, 'Senior Android Developer');
  assert.match(html, /9\+ years/);
  assert.match(html, /2017 — 2020/);
  assert.doesNotMatch(html, /5\+ years/);
  const pdf = fs.readFileSync(path.join(root, 'resume.pdf'), 'ascii');
  assert.match(pdf, /Senior Android Developer \| 9\+ years/);
  const xref = Number(pdf.match(/startxref\n(\d+)/)[1]);
  assert.ok(pdf.slice(xref).startsWith('xref'));
  [...pdf.matchAll(/(\d{10}) 00000 n /g)].forEach((entry, index) => {
    assert.ok(pdf.slice(Number(entry[1])).startsWith(`${index + 1} 0 obj`));
  });
  assert.equal((html.match(/href="resume.pdf" download/g) || []).length, 3);
});

test('all three projects have three local screenshots with meaningful alternatives', () => {
  const projects = vm.runInNewContext(sourceBetween('const projects =', 'const toast =') + '\nprojects;');
  assert.equal(Object.keys(projects).length, 3);
  for (const project of Object.values(projects)) {
    assert.equal(project.screenshots.length, 3);
    for (const image of project.screenshots) {
      assert.ok(image.alt.length > 30);
      assert.ok(image.caption.length > 0);
      const svg = fs.readFileSync(path.join(root, image.src), 'utf8');
      assert.match(svg, /viewBox="0 0 360 640"/);
    }
  }
  assert.match(html, /not measured production results/);
});

test('Android remains primary while iOS and AI have separate experience levels', () => {
  assert.match(html, /PRIMARY EXPERTISE · 9\+ YEARS/);
  assert.match(html, /id="ios"/);
  assert.match(html, /id="ai"/);
  assert.match(html, /ADDITIONAL DEVELOPMENT EXPERIENCE/);
  assert.match(html, /SELF-DIRECTED LEARNING/);
  assert.match(html, /Android Developer by Experience\./);
  assert.match(html, /Mobile Engineer by Passion\./);
  assert.match(html, /AI Explorer by Curiosity\./);
  assert.match(html, /No live AI API is connected/);
  assert.match(html, /<span>Swift<\/span>/);
  assert.match(html, /<span>SwiftUI<\/span>/);
});

test('filters hide unmatched projects and restore all projects', () => {
  const filters = ['all', 'android', 'open-source'].map(category => ({
    dataset: { filter: category },
    classList: { toggle() {} },
    setAttribute(name, value) { this[name] = value; },
  }));
  const cards = ['android', 'android', 'android open-source'].map(category => ({ dataset: { category } }));
  const context = {
    document: { querySelectorAll: selector => selector === '.filter' ? filters : cards },
  };
  vm.runInNewContext(sourceBetween('function filterProjects', "document.querySelectorAll('.filter').forEach(button"), context);
  context.filterProjects('open-source');
  assert.deepEqual(cards.map(card => card.hidden), [true, true, false]);
  assert.equal(filters[2]['aria-pressed'], 'true');
  context.filterProjects('all');
  assert.deepEqual(cards.map(card => card.hidden), [false, false, false]);
});

test('gallery navigation clamps endpoints and respects reduced motion', () => {
  let requested;
  const context = {
    galleryIndex: 0,
    gallery: { children: [{ offsetLeft: 0 }, { offsetLeft: 320 }, { offsetLeft: 640 }], scrollTo: options => { requested = options; } },
    reducedMotion: { matches: false },
  };
  vm.runInNewContext(sourceBetween('function moveGallery', "galleryPrevious.addEventListener"), context);
  context.moveGallery(-1);
  assert.equal(requested.left, 0);
  context.moveGallery(10);
  assert.equal(requested.left, 640);
  assert.equal(requested.behavior, 'smooth');
  context.reducedMotion.matches = true;
  context.moveGallery(1);
  assert.equal(requested.behavior, 'auto');
});

test('reading progress reports start, midpoint, end and non-scrollable pages', () => {
  const context = { progressFrame: 1, readingProgress: {}, document: { documentElement: { scrollHeight: 2000 } }, window: { innerHeight: 1000, scrollY: 0 } };
  vm.runInNewContext(sourceBetween('function updateReadingProgress', 'function scheduleReadingProgress'), context);
  for (const [scroll, expected] of [[0, 0], [500, 50], [1000, 100], [1500, 100], [-100, 0]]) {
    context.window.scrollY = scroll;
    context.updateReadingProgress();
    assert.equal(context.readingProgress.value, expected);
  }
  context.document.documentElement.scrollHeight = 1000;
  context.updateReadingProgress();
  assert.equal(context.readingProgress.value, 100);
});

test('contact draft encodes visitor input without injecting mail headers', () => {
  const context = { profile: { email: 'canillojeanairaworkmail@gmail.com' } };
  vm.runInNewContext(sourceBetween('function buildContactEmail', 'const contactForm ='), context);
  const url = new URL(context.buildContactEmail({
    fullName: 'A & B\r\nBcc: stranger@example.com',
    mobile: '+44 7700 900000',
    email: 'visitor@example.com',
    message: 'Hello! Kotlin & Swift? 日本語 #feedback',
  }));
  assert.equal(url.protocol, 'mailto:');
  assert.equal(url.pathname, 'canillojeanairaworkmail@gmail.com');
  assert.equal(url.searchParams.size, 2);
  assert.equal(url.searchParams.get('subject'), 'Portfolio enquiry / feedback');
  assert.ok(url.searchParams.get('body').includes('日本語 #feedback'));
  assert.ok(url.searchParams.get('body').includes('Mobile: +44 7700 900000'));
  assert.equal(url.searchParams.get('bcc'), null);
  assert.ok(new URL(context.buildContactEmail({ fullName: 'Jean Aira', mobile: '', email: 'a@example.com', message: 'Hello' })).searchParams.get('body').includes('Mobile: Not provided'));
});
