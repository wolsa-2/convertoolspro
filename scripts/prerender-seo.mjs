import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const dist = path.join(root, 'dist');
const baseUrl = 'https://photosize.vercel.app';
const indexPath = path.join(dist, 'index.html');
if (!fs.existsSync(indexPath)) throw new Error('dist/index.html is missing. Run Vite build first.');
const template = fs.readFileSync(indexPath, 'utf8');
const constants = fs.readFileSync(path.join(root, 'src/constants.ts'), 'utf8');
const blogSource = fs.readFileSync(path.join(root, 'src/blogData.ts'), 'utf8');

const tools = [...constants.matchAll(/\{ id: '([^']+)', name: '([^']+)', description: '([^']+)'/g)]
  .map((m) => ({ id: m[1], name: m[2], description: m[3] }));
const posts = [...blogSource.matchAll(/"title":\s*"([^"]+)"[\s\S]*?"metaDescription":\s*"([^"]+)"[\s\S]*?"excerpt":\s*"([^"]+)"[\s\S]*?"image":\s*"([^"]+)"/g)]
  .map((m) => ({ title: m[1], description: m[2], excerpt: m[3], image: m[4] }));

if (tools.length !== 18) throw new Error(`Expected 18 tool routes, found ${tools.length}`);
if (posts.length !== 10) throw new Error(`Expected 10 blog posts, found ${posts.length}`);

const slugify = (value) => value.toLowerCase().normalize('NFKD').replace(/[’']/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const esc = (value) => String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const jsonLd = (value) => JSON.stringify(value).replace(/</g, '\\u003c');

function setMeta(html, selector, attrs) {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp('<meta\\b(?=[^>]*' + escaped + ')[^>]*>', 'i');
  const tag = '<meta ' + Object.entries(attrs).map(([key, value]) => key + '="' + esc(value) + '"').join(' ') + ' />';
  return re.test(html) ? html.replace(re, tag) : html.replace('</head>', '  ' + tag + '\\n</head>');
}
function setCanonical(html, url) {
  const tag = '<link rel="canonical" href="' + esc(url) + '" />';
  return /<link\\b[^>]*rel=["']canonical["'][^>]*>/i.test(html)
    ? html.replace(/<link\\b[^>]*rel=["']canonical["'][^>]*>/i, tag)
    : html.replace('</head>', '  ' + tag + '\\n</head>');
}
function writeRoute(route, meta, body, schema) {
  const url = baseUrl + route;
  const image = meta.image || baseUrl + '/og-image.svg';
  let html = template.replace(/<title>[^<]*<\\/title>/i, '<title>' + esc(meta.title) + '</title>');
  html = setMeta(html, 'name=["']description["']', { name: 'description', content: meta.description });
  html = setMeta(html, 'name=["']robots["']', { name: 'robots', content: 'index, follow' });
  html = setMeta(html, 'property=["']og:type["']', { property: meta.type || 'website' });
  html = setMeta(html, 'property=["']og:url["']', { property: 'og:url', content: url });
  html = setMeta(html, 'property=["']og:title["']', { property: 'og:title', content: meta.title });
  html = setMeta(html, 'property=["']og:description["']', { property: 'og:description', content: meta.description });
  html = setMeta(html, 'property=["']og:image["']', { property: 'og:image', content: image });
  html = setMeta(html, 'property=["']og:image:type["']', { property: 'og:image:type', content: image.endsWith('.jpg') ? 'image/jpeg' : 'image/svg+xml' });
  html = setMeta(html, 'property=["']twitter:card["']', { property: 'twitter:card', content: 'summary_large_image' });
  html = setMeta(html, 'property=["']twitter:title["']', { property: 'twitter:title', content: meta.title });
  html = setMeta(html, 'property=["']twitter:description["']', { property: 'twitter:description', content: meta.description });
  html = setMeta(html, 'property=["']twitter:image["']', { property: 'twitter:image', content: image });
  html = setCanonical(html, url);
  html = html.replace('<div id="root"></div>', '<div id="root"><main data-seo-prerender="true">' + body + '</main></div>');
  html = html.replace('</head>', '  <script type="application/ld+json">' + jsonLd(schema) + '</script>\\n</head>');
  const output = route === '/' ? indexPath : path.join(dist, route.replace(/^\\//, ''), 'index.html');
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(output, html);
}

writeRoute('/', {
  title: 'PhotoSize | Free Online Photo, Image & Utility Tools',
  description: 'Free online photo and image utilities, plus useful PDF, text and developer tools. Simple browser-based tools with no account required.'
}, '<h1>Free Online Photo, Image, PDF and Utility Tools</h1><p>Use PhotoSize for practical browser-based image, PDF, text and developer utilities. No account required.</p><p><a href="/blog">Read practical guides</a> · <a href="/about">About PhotoSize</a></p>', {
  '@context': 'https://schema.org', '@type': 'WebSite', name: 'PhotoSize', url: baseUrl,
  description: 'Browser-based photo, image, PDF, text and utility tools.'
});

for (const tool of tools) {
  const route = '/tool/' + tool.id;
  const title = tool.name + ' | PhotoSize';
  const description = 'Use the ' + tool.name + ' tool on PhotoSize. ' + tool.description + ' Review this tool’s details for supported formats and processing behavior.';
  writeRoute(route, { title, description }, '<h1>' + esc(tool.name) + '</h1><p>' + esc(tool.description) + '</p><p>Use this browser-based utility on PhotoSize. Check the tool interface for supported inputs and available options.</p><p><a href="/">Explore all PhotoSize tools</a> · <a href="/blog">Read our guides</a></p>', {
    '@context': 'https://schema.org', '@type': 'SoftwareApplication', name: tool.name, applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Any', description, url: baseUrl + route, isAccessibleForFree: true,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' }, publisher: { '@type': 'Organization', name: 'PhotoSize' }
  });
}

for (const post of posts) {
  const route = '/blog/' + slugify(post.title);
  const image = baseUrl + post.image;
  writeRoute(route, { title: post.title + ' | PhotoSize Journal', description: post.description, image, type: 'article' },
    '<article><h1>' + esc(post.title) + '</h1><p>' + esc(post.excerpt) + '</p><p><a href="/blog">Browse all PhotoSize guides</a></p></article>',
    { '@context': 'https://schema.org', '@type': 'Article', headline: post.title, description: post.description, image,
      author: { '@type': 'Organization', name: 'PhotoSize Team' }, publisher: { '@type': 'Organization', name: 'PhotoSize' },
      mainEntityOfPage: baseUrl + route }
  );
}

const pages = [
  ['about', 'About PhotoSize', 'Learn about PhotoSize, our browser-based image, PDF, text and utility tools, and our approach to simple online workflows.'],
  ['contact', 'Contact PhotoSize', 'Get in touch with the PhotoSize team for questions, feedback or website support.'],
  ['privacy', 'Privacy Policy', 'Read the PhotoSize Privacy Policy to understand data handling, browser-based processing and third-party services.'],
  ['terms', 'Terms of Service', 'Review the terms and conditions for using the PhotoSize website and its online tools.'],
  ['disclaimer', 'Disclaimer', 'Read important information about the scope, accuracy and use of PhotoSize tools and website content.']
];
for (const [slug, title, description] of pages) {
  writeRoute('/' + slug, { title: title + ' | PhotoSize', description },
    '<h1>' + esc(title) + '</h1><p>' + esc(description) + '</p><p><a href="/">Return to PhotoSize</a></p>',
    { '@context': 'https://schema.org', '@type': 'WebPage', name: title, description, url: baseUrl + '/' + slug, isPartOf: { '@type': 'WebSite', name: 'PhotoSize', url: baseUrl } }
  );
}

console.log('SEO route prerender complete: homepage, ' + tools.length + ' tools, ' + posts.length + ' articles and ' + pages.length + ' static pages.');
