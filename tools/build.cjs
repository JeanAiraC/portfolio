const fs = require('node:fs/promises');
const path = require('node:path');
const { minify: minifyHtml } = require('html-minifier-terser');
const { minify: minifyJs } = require('terser');
const CleanCSS = require('clean-css');

const root = path.resolve(__dirname, '..');
const output = path.join(root, 'dist');

async function build() {
  const [html, css, js] = await Promise.all(
    ['index.html', 'styles.css', 'script.js'].map(file => fs.readFile(path.join(root, file), 'utf8')),
  );
  const jsResult = await minifyJs(js, {
    compress: true,
    mangle: true,
    sourceMap: false,
    format: { comments: false },
  });
  if (typeof jsResult.code !== 'string' || !jsResult.code.length) {
    throw new Error('JavaScript minifier produced no output.');
  }
  const cssResult = new CleanCSS({
    level: 1,
    rebase: false,
    inline: ['none'],
  }).minify(css);
  if (cssResult.errors.length) throw new Error(cssResult.errors.join('\n'));
  cssResult.warnings.forEach(warning => console.warn(`CSS minifier: ${warning}`));
  const htmlResult = await minifyHtml(html, {
    collapseWhitespace: true,
    conservativeCollapse: true,
    removeComments: true,
    minifyCSS: false,
    minifyJS: false,
  });
  const pages = [
    ['index.html', htmlResult],
    ['styles.css', cssResult.styles],
    ['script.js', jsResult.code],
  ];
  // Only known public files are copied. Source, tests, tooling, and .env stay private.
  const publicFiles = ['resume.pdf', 'robots.txt', 'sitemap.xml'];
  const copies = [];
  for (const file of publicFiles) {
    try {
      await fs.access(path.join(root, file));
      copies.push(file);
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
      if (file === 'resume.pdf') throw new Error('The public resume.pdf file is missing.');
    }
  }
  await fs.mkdir(output, { recursive: true });
  // Keep cleanup bounded to generated filenames; never delete the output directory.
  for (const file of ['index.html', 'styles.css', 'script.js', ...publicFiles]) {
    await fs.rm(path.join(output, file), { force: true });
  }
  await Promise.all(pages.map(([file, content]) => fs.writeFile(path.join(output, file), content)));
  await Promise.all(copies.map(file => fs.copyFile(path.join(root, file), path.join(output, file))));
  await fs.cp(path.join(root, 'assets'), path.join(output, 'assets'), {
    recursive: true,
    filter: source => {
      const relative = path.relative(path.join(root, 'assets'), source);
      if (!relative) return true;
      if (relative.split(path.sep).some(part => part.startsWith('.'))) return false;
      return !path.extname(source) || /\.(svg|png|jpe?g|webp|avif|gif|ico|woff2?)$/i.test(source);
    },
  });
  for (const [index, [file, content]] of pages.entries()) {
    const original = [html, css, js][index];
    console.log(`${file}: ${Buffer.byteLength(original)} -> ${Buffer.byteLength(content)} bytes`);
  }
  console.log('Production files ready in dist. Deploy only that folder. HTML remains inspectable.');
}

build().catch(error => {
  console.error('Production build failed:', error);
  process.exitCode = 1;
});
