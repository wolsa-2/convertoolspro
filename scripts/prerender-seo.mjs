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
const blogArrayStart = blogSource.indexOf('[', blogSource.indexOf('export const BLOG_POSTS'));
const blogArrayEnd = blogSource.lastIndexOf('];');
if (blogArrayStart < 0 || blogArrayEnd < blogArrayStart) throw new Error('Could not locate BLOG_POSTS array.');
const posts = JSON.parse(blogSource.slice(blogArrayStart, blogArrayEnd + 1).replace(/,\s*\]$/, ']'));

if (tools.length !== 18) throw new Error(`Expected 18 tool routes, found ${tools.length}`);
if (posts.length !== 10) throw new Error(`Expected 10 blog posts, found ${posts.length}`);

const slugify = (value) => value.toLowerCase().normalize('NFKD').replace(/[’']/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const esc = (value) => String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const jsonLd = (value) => JSON.stringify(value).replace(/</g, '\\u003c');

const newline = String.fromCharCode(10);
function setMeta(html, selector, attrs) {
  const matcher = new RegExp('<meta[^>]*' + selector + '[^>]*>', 'i');
  const tag = '<meta ' + Object.entries(attrs).map(([key, value]) => key + '="' + esc(value) + '"').join(' ') + ' />';
  return matcher.test(html) ? html.replace(matcher, tag) : html.replace('</head>', '  ' + tag + newline + '</head>');
}
function setCanonical(html, url) {
  const tag = '<link rel="canonical" href="' + esc(url) + '" />';
  const matcher = new RegExp('<link[^>]*rel="canonical"[^>]*>', 'i');
  return matcher.test(html) ? html.replace(matcher, tag) : html.replace('</head>', '  ' + tag + newline + '</head>');
}
function writeRoute(route, meta, body, schema) {
  const url = baseUrl + route;
  const image = meta.image || baseUrl + '/og-image.svg';
  let html = template.replace(new RegExp('<title>[^<]*</title>', 'i'), '<title>' + esc(meta.title) + '</title>');
  html = setMeta(html, 'name="description"', { name: 'description', content: meta.description });
  html = setMeta(html, 'name="robots"', { name: 'robots', content: 'index, follow' });
  html = setMeta(html, 'property="og:type"', { property: 'og:type', content: meta.type || 'website' });
  html = setMeta(html, 'property="og:url"', { property: 'og:url', content: url });
  html = setMeta(html, 'property="og:title"', { property: 'og:title', content: meta.title });
  html = setMeta(html, 'property="og:description"', { property: 'og:description', content: meta.description });
  html = setMeta(html, 'property="og:image"', { property: 'og:image', content: image });
  html = setMeta(html, 'property="og:image:type"', { property: 'og:image:type', content: image.endsWith('.jpg') ? 'image/jpeg' : 'image/svg+xml' });
  html = setMeta(html, 'property="twitter:card"', { property: 'twitter:card', content: 'summary_large_image' });
  html = setMeta(html, 'property="twitter:title"', { property: 'twitter:title', content: meta.title });
  html = setMeta(html, 'property="twitter:description"', { property: 'twitter:description', content: meta.description });
  html = setMeta(html, 'property="twitter:image"', { property: 'twitter:image', content: image });
  html = setCanonical(html, url);
  html = html.replace('<div id="root"></div>', '<div id="root"><main data-seo-prerender="true">' + body + '</main></div>');
  html = html.replace('</head>', '  <script type="application/ld+json">' + jsonLd(schema) + '</script>' + newline + '</head>');
  const output = route === '/' ? indexPath : path.join(dist, route.substring(1), 'index.html');
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

const blogDescription = 'Practical guides for image resizing, photo formats, image optimization, PDF workflows, privacy and useful online tools.';
const articleCards = posts.map((post) => {
  const route = '/blog/' + slugify(post.title);
  return '<article><a href="' + route + '"><img src="' + esc(post.image) + '" alt="' + esc(post.title) + '" loading="lazy" /><h2>' + esc(post.title) + '</h2></a><p>' + esc(post.excerpt) + '</p><p><strong>' + esc(post.category) + '</strong></p><a href="' + route + '">Read the full guide</a></article>';
}).join(newline);
const blogBody = '<section><h1>PhotoSize Journal: Image, PDF and Digital Workflow Guides</h1><p>' + esc(blogDescription) + '</p><p>' + posts.length + ' practical guides from the PhotoSize Team.</p></section><section><h2>All guides</h2>' + articleCards + '</section><p><a href="/">Explore all PhotoSize tools</a></p>';
writeRoute('/blog', { title: 'PhotoSize Journal | Image, PDF & Digital Workflow Guides', description: blogDescription }, blogBody, {
  '@context': 'https://schema.org', '@type': 'Blog', name: 'PhotoSize Journal', description: blogDescription,
  url: baseUrl + '/blog', blogPost: posts.map((post) => ({ '@type': 'BlogPosting', headline: post.title, url: baseUrl + '/blog/' + slugify(post.title) }))
});

for (const post of posts) {
  const route = '/blog/' + slugify(post.title);
  const image = baseUrl + post.image;
  const articleTitle = post.title + ' | PhotoSize Journal';
  const date = new Date(post.date);
  if (Number.isNaN(date.getTime())) throw new Error('Invalid publication date for article: ' + post.title);
  const datePublished = date.toISOString();
  const articleBody = '<article><header><p>' + esc(post.category) + '</p><h1>' + esc(post.title) + '</h1><p>' + esc(post.excerpt) + '</p><p>By ' + esc(post.author) + ' · <time datetime="' + datePublished + '">' + esc(post.date) + '</time></p><img src="' + esc(post.image) + '" alt="' + esc(post.title) + '" /></header><div>' + post.content + '</div><footer><p>Topics: ' + post.keywords.map(esc).join(', ') + '</p><p><a href="/blog">Back to all PhotoSize guides</a> · <a href="/">Explore PhotoSize tools</a></p></footer></article>';
  writeRoute(route, { title: articleTitle, description: post.metaDescription, image, type: 'article' }, articleBody, {
    '@context': 'https://schema.org', '@type': 'Article', headline: post.title, description: post.metaDescription,
    image, datePublished, dateModified: datePublished, author: { '@type': 'Organization', name: post.author },
    publisher: { '@type': 'Organization', name: 'PhotoSize' }, articleSection: post.category, keywords: post.keywords,
    mainEntityOfPage: baseUrl + route
  });
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

const sitemapUrls = [
  { loc: baseUrl + '/', priority: '1.0' },
  { loc: baseUrl + '/blog', priority: '0.9' },
  ...posts.map((post) => ({ loc: baseUrl + '/blog/' + slugify(post.title), priority: '0.8' })),
  ...tools.map((tool) => ({ loc: baseUrl + '/tool/' + tool.id, priority: '0.8' })),
  ...pages.map(([slug]) => ({ loc: baseUrl + '/' + slug, priority: slug === 'privacy' || slug === 'terms' ? '0.3' : '0.5' }))
];
const today = new Date().toISOString().slice(0, 10);
const sitemap = '<?xml version="1.0" encoding="UTF-8"?>' + newline +
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' + newline +
  sitemapUrls.map((item) => '  <url><loc>' + item.loc + '</loc><lastmod>' + today + '</lastmod><priority>' + item.priority + '</priority></url>').join(newline) +
  newline + '</urlset>' + newline;
fs.writeFileSync(path.join(dist, 'sitemap.xml'), sitemap);

console.log('SEO route prerender complete: homepage, blog index, ' + tools.length + ' tools, ' + posts.length + ' full articles and ' + pages.length + ' static pages. Sitemap URLs: ' + sitemapUrls.length + '.');
