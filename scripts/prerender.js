import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import frontMatter from 'front-matter';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SITE_URL = 'https://yashthapliyal.com';
const DEFAULT_IMAGE = '/Social_Media_Preview_portfolio.png';
const DIST_DIR = path.join(__dirname, '../dist');
const BLOG_DIR = path.join(__dirname, '../src/content/blog');
const BLOG_INDEX_PATH = path.join(__dirname, '../src/lib/blog.ts');
const TEMPLATE_PATH = path.join(DIST_DIR, 'index.html');

const getActiveSlugs = () => {
  const src = fs.readFileSync(BLOG_INDEX_PATH, 'utf8');
  const slugs = new Set();
  // Match active (uncommented) entries: 'slug': () => import('...md?raw'),
  for (const line of src.split('\n')) {
    if (/^\s*\/\//.test(line)) continue;
    const m = line.match(/['"]([^'"]+)['"]\s*:\s*\(\)\s*=>\s*import\(/);
    if (m) slugs.add(m[1]);
  }
  return slugs;
};

const escapeHtml = (s) =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const STATIC_ROUTES = [
  { path: '/projects', title: 'Projects | Yash Thapliyal', description: 'Software, hardware, and creative projects by Yash Thapliyal.' },
  { path: '/yash1photos', title: 'Photography | Yash Thapliyal', description: 'Photography portfolio by Yash Thapliyal.' },
  { path: '/blog', title: 'Blog | Yash Thapliyal', description: 'Writing on software, hacking, travel, and side projects by Yash Thapliyal.' },
  { path: '/contact', title: 'Contact | Yash Thapliyal', description: 'Get in touch with Yash Thapliyal.' },
  { path: '/coffee-tracker', title: 'Coffee Tracker | Yash Thapliyal', description: 'Tracking coffee consumption — a personal data project.' },
  { path: '/music', title: 'Music | Yash Thapliyal', description: 'What I am currently listening to.' },
  { path: '/brain-dump', title: 'Brain Dump | Yash Thapliyal', description: 'Loose thoughts and notes by Yash Thapliyal.' },
];

const replaceMeta = (template, { title, description, image, url, type }) => {
  const t = escapeHtml(title);
  const d = escapeHtml(description);
  const i = escapeHtml(image);
  const u = escapeHtml(url);
  let html = template;

  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${t}</title>`);
  html = html.replace(
    /<meta name="description" content="[^"]*"\s*\/>/,
    `<meta name="description" content="${d}" />`
  );

  html = html.replace(
    /<meta property="og:title" content="[^"]*"\s*\/>/,
    `<meta property="og:title" content="${t}" />`
  );
  html = html.replace(
    /<meta property="og:description" content="[^"]*"\s*\/>/,
    `<meta property="og:description" content="${d}" />`
  );
  html = html.replace(
    /<meta property="og:image" content="[^"]*"\s*\/>/,
    `<meta property="og:image" content="${i}" />`
  );
  html = html.replace(
    /<meta property="og:url" content="[^"]*"\s*\/>/,
    `<meta property="og:url" content="${u}" />`
  );
  html = html.replace(
    /<meta property="og:type" content="[^"]*"\s*\/>/,
    `<meta property="og:type" content="${type}" />`
  );

  html = html.replace(
    /<meta name="twitter:title" content="[^"]*"\s*\/>/,
    `<meta name="twitter:title" content="${t}" />`
  );
  html = html.replace(
    /<meta name="twitter:description" content="[^"]*"\s*\/>/,
    `<meta name="twitter:description" content="${d}" />`
  );
  html = html.replace(
    /<meta name="twitter:image" content="[^"]*"\s*\/>/,
    `<meta name="twitter:image" content="${i}" />`
  );

  return html;
};

const writeRoute = (routePath, html) => {
  const clean = routePath.replace(/^\/+/, '');
  const outDir = path.join(DIST_DIR, clean);
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'index.html'), html);
  console.log(`  wrote ${path.relative(DIST_DIR, path.join(outDir, 'index.html'))}`);
};

const main = () => {
  if (!fs.existsSync(TEMPLATE_PATH)) {
    console.error(`prerender: ${TEMPLATE_PATH} not found — run vite build first.`);
    process.exit(1);
  }
  const template = fs.readFileSync(TEMPLATE_PATH, 'utf8');

  console.log('Prerendering static routes...');
  for (const route of STATIC_ROUTES) {
    const html = replaceMeta(template, {
      title: route.title,
      description: route.description,
      image: route.image || DEFAULT_IMAGE,
      url: SITE_URL + route.path,
      type: 'website',
    });
    writeRoute(route.path, html);
  }

  console.log('Prerendering blog posts...');
  const activeSlugs = getActiveSlugs();
  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith('.md'));
  for (const file of files) {
    const slug = file.replace(/\.md$/, '');
    if (!activeSlugs.has(slug)) {
      console.log(`  skipping ${slug} (not registered in blog.ts)`);
      continue;
    }
    const raw = fs.readFileSync(path.join(BLOG_DIR, file), 'utf8');
    const { attributes } = frontMatter(raw);
    const title = `${attributes.title} | Yash Thapliyal`;
    const description = attributes.description || 'A blog post by Yash Thapliyal.';
    const image = attributes.image || DEFAULT_IMAGE;
    const url = `${SITE_URL}/blog/${slug}`;
    const html = replaceMeta(template, {
      title,
      description,
      image,
      url,
      type: 'article',
    });
    writeRoute(`/blog/${slug}`, html);
  }

  console.log('Prerender complete.');
};

main();
