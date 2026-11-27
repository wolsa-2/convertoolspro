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
const contentSource = fs.readFileSync(path.join(root, 'src/content.ts'), 'utf8');

function parseTemplateMap(source, exportName) {
  const declaration = 'export const ' + exportName;
  const start = source.indexOf(declaration);
  if (start < 0) throw new Error('Could not locate ' + exportName + ' in src/content.ts');
  const open = source.indexOf('{', start);
  const close = source.indexOf('\n};', open);
  if (open < 0 || close < 0) throw new Error('Could not parse ' + exportName + ' in src/content.ts');
  const block = source.slice(open + 1, close);
  const entries = [...block.matchAll(/^\s*[\"']?([a-z0-9-]+)[\"']?\s*:\s*\x60([\s\S]*?)\x60\s*,?/gm)];
  return Object.fromEntries(entries.map((match) => [match[1], match[2].trim()]));
}

const toolSeoContent = parseTemplateMap(contentSource, 'TOOLS_SEO_CONTENT');
const staticPageContent = parseTemplateMap(contentSource, 'STATIC_PAGES_CONTENT');

const tools = [...constants.matchAll(/\{ id: '([^']+)', name: '([^']+)', description: '([^']+)', category: '([^']+)'/g)]
  .map((m) => ({ id: m[1], name: m[2], description: m[3], category: m[4] }));
const blogArrayStart = blogSource.indexOf('= [', blogSource.indexOf('export const BLOG_POSTS')) + 2;
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

const categories = [...new Set(tools.map((tool) => tool.category))];
const toolDirectory = categories.map((category) => {
  const categoryTools = tools.filter((tool) => tool.category === category);
  return '<section><h2 id="category-' + slugify(category) + '">' + esc(category) + ' Tools</h2><ul>' + categoryTools.map((tool) => '<li><a href="/tool/' + esc(tool.id) + '">' + esc(tool.name) + '</a> — ' + esc(tool.description) + '</li>').join('') + '</ul></section>';
}).join(newline);
const categoryNavigation = '<nav aria-label="Tool categories"><h2>Browse tool categories</h2><ul>' + categories.map((category) => '<li><a href="#category-' + slugify(category) + '">' + esc(category) + ' Tools</a></li>').join('') + '</ul></nav>';
const homeBody = '<section><h1>Free Online Photo, Image, PDF and Utility Tools</h1><p>Use PhotoSize for practical browser-based image, PDF, text and developer utilities. Explore the available tools by category and open any tool directly.</p>' + categoryNavigation + '<h2>All PhotoSize Tools</h2>' + toolDirectory + '<p><a href="/blog">Read practical guides</a> · <a href="/about">About PhotoSize</a> · <a href="/contact">Contact support</a></p></section>';
writeRoute('/', {
  title: 'PhotoSize | Free Online Photo, Image & Utility Tools',
  description: 'Free online photo and image utilities, plus useful PDF, text and developer tools. Simple browser-based tools with no account required.'
}, homeBody, {
  '@context': 'https://schema.org', '@type': 'WebSite', name: 'PhotoSize', url: baseUrl,
  description: 'Browser-based photo, image, PDF, text and utility tools.'
});

for (const tool of tools) {
  const route = '/tool/' + tool.id;
  const title = tool.name + ' | PhotoSize';
  const description = 'Use the ' + tool.name + ' tool on PhotoSize. ' + tool.description + ' Review this tool’s details for supported formats and processing behavior.';
  const detailedContent = toolSeoContent[tool.id] || '';
  const relatedTools = tools.filter((item) => item.category === tool.category && item.id !== tool.id).slice(0, 3);
  const fallbackContent = '<section><h2>About ' + esc(tool.name) + '</h2><p>' + esc(tool.description) + '</p><p>Open the tool interface above to use this PhotoSize utility. Review the available controls and output before downloading or copying your result.</p></section>';
  const seoSection = detailedContent ? '<section class="seo-content">' + detailedContent + '</section>' : fallbackContent;
  const relatedSection = '<section><h2>Related ' + esc(tool.category) + ' Tools</h2><ul>' + relatedTools.map((item) => '<li><a href="/tool/' + esc(item.id) + '">' + esc(item.name) + '</a> — ' + esc(item.description) + '</li>').join('') + '</ul><p><a href="/">Browse all PhotoSize tools</a> · <a href="/blog">Read practical guides</a></p></section>';
  const toolBody = '<article><header><h1>' + esc(tool.name) + ' Online Tool</h1><p>' + esc(tool.description) + '</p></header>' + seoSection + relatedSection + '</article>';
  writeRoute(route, { title, description }, toolBody, {
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
  {
    slug: 'about',
    title: 'About PhotoSize',
    description: 'Learn about PhotoSize, its image, PDF and everyday digital tools, and the project’s focus on simple, useful online workflows.',
    body: '<article><h1>About PhotoSize</h1><p>PhotoSize brings useful image, PDF and everyday digital tools into one straightforward workspace—so common tasks take fewer steps.</p><h2>Why PhotoSize exists</h2><p>Helpful digital utilities should be easy to find, straightforward to use and accessible without unnecessary complexity. PhotoSize brings common tasks into one consistent place for creators, students, developers and everyday users.</p><h2>Privacy matters</h2><p>We favour browser-based processing wherever a tool supports it. Processing behaviour can vary by tool, so check each tool’s details before using sensitive files or information.</p><h2>Our story</h2><p>PhotoSize began as an independent project to make common digital tasks feel more organised, approachable and less scattered across the web. We continue improving the experience and refining tools based on practical needs and user feedback.</p><h2>The creator</h2><p>PhotoSize was created by Shivam Kumar, with a focus on clean design, intuitive user experiences and practical technical solutions.</p><p><a href="/">Explore PhotoSize tools</a> · <a href="/contact">Share feedback</a></p></article>'
  },
  {
    slug: 'contact',
    title: 'Contact PhotoSize',
    description: 'Contact PhotoSize for questions, technical support, bug reports, feedback or suggestions for new online tools.',
    body: '<article><h1>Contact PhotoSize</h1><p>Have a question, found a bug, or want to suggest a useful tool? Choose the contact option below and tell us how we can help.</p><h2>Email support</h2><p>For general questions, technical support, feedback or new tool suggestions, send a message to <a href="mailto:b605649@gmail.com">b605649@gmail.com</a>. Include the tool name and enough detail to help us understand your request.</p><h2>Response time</h2><p>PhotoSize operates on India Standard Time (IST). We typically respond to inquiries within 24–48 hours.</p><h2>Report a problem</h2><p>When reporting a bug, mention the tool you used, what you were trying to do and what happened.</p></article>'
  },
  {
    slug: 'privacy',
    title: 'Privacy Policy',
    description: 'Read the PhotoSize Privacy Policy about local browser processing, advertising cookies, log files and third-party privacy practices.',
    body: staticPageContent.privacy
  },
  {
    slug: 'terms',
    title: 'Terms of Service',
    description: 'Review the PhotoSize Terms of Service, including acceptable use, user content, warranties and liability limitations.',
    body: staticPageContent.terms
  },
  {
    slug: 'disclaimer',
    title: 'Disclaimer',
    description: 'Read the PhotoSize disclaimer about tool accuracy, general information, external links and use of the website at your own risk.',
    body: staticPageContent.disclaimer
  }
];
for (const page of pages) {
  const { slug, title, description, body } = page;
  if (!body) throw new Error('Missing page content for /' + slug);
  writeRoute('/' + slug, { title: title + ' | PhotoSize', description }, body,
    { '@context': 'https://schema.org', '@type': 'WebPage', name: title, description, url: baseUrl + '/' + slug, isPartOf: { '@type': 'WebSite', name: 'PhotoSize', url: baseUrl } }
  );
}

const sitemapUrls = [
  { loc: baseUrl + '/', priority: '1.0' },
  { loc: baseUrl + '/blog', priority: '0.9' },
  ...posts.map((post) => ({ loc: baseUrl + '/blog/' + slugify(post.title), priority: '0.8' })),
  ...tools.map((tool) => ({ loc: baseUrl + '/tool/' + tool.id, priority: '0.8' })),
  ...pages.map((page) => ({ loc: baseUrl + '/' + page.slug, priority: page.slug === 'privacy' || page.slug === 'terms' ? '0.3' : '0.5' }))
];
const today = new Date().toISOString().slice(0, 10);
const sitemap = '<?xml version="1.0" encoding="UTF-8"?>' + newline +
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' + newline +
  sitemapUrls.map((item) => '  <url><loc>' + item.loc + '</loc><lastmod>' + today + '</lastmod><priority>' + item.priority + '</priority></url>').join(newline) +
  newline + '</urlset>' + newline;
fs.writeFileSync(path.join(dist, 'sitemap.xml'), sitemap);

console.log('SEO route prerender complete: homepage, blog index, ' + tools.length + ' tools, ' + posts.length + ' full articles and ' + pages.length + ' static pages. Sitemap URLs: ' + sitemapUrls.length + '.');
