import { readFile } from 'node:fs/promises';
const html = await readFile('index.html', 'utf8');
const urls = [...new Set([...html.matchAll(/<a\b[^>]*href="(https:[^"]+)"/g)].map((match) => match[1].replaceAll('&amp;', '&')))];
await Promise.all(urls.map(async (url) => {
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(25000), headers: { 'User-Agent': 'Mozilla/5.0 (compatible; PortfolioLinkCheck/1.0)' } });
    console.log(JSON.stringify({ url, status: response.status, destination: response.url }));
    await response.body?.cancel();
  } catch (error) { console.log(JSON.stringify({ url, error: error.message })); }
}));
