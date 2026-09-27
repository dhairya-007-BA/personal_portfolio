import { mkdir, copyFile } from 'node:fs/promises';
// Explicit public asset list keeps source PDFs and development files out of dist.
const assets = ['index.html', 'style.css', 'theme.js', 'script.js', 'logo.png', 'resume.pdf', 'robots.txt', 'sitemap.xml'];
await mkdir('dist', { recursive: true });
await Promise.all(assets.map((file) => copyFile(file, `dist/${file}`)));
console.log(`Built ${assets.length} static assets in dist/`);
