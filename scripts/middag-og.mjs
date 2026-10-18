// Etter `vite build`: lag dist/middag/index.html med egen forhåndsvisning (Open Graph) for /middag.
//
// WhatsApp, iMessage og e-postklienter kjører ikke JavaScript, så de leser bare <head> i HTML-en de får.
// Netlify serverer en statisk fil foran SPA-omdirigeringen, så /middag får denne filen. Appen laster
// som vanlig og React Router viser invitasjonen. #root tømmes for den forhåndsrendrede forsiden.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';

const SITE = 'https://aprikosventure.com';
const TITLE = 'Invitasjon til investormiddag · Mashwara';
const DESC = 'Vi har bygget. Nå skal vi skalere. Torsdag 5. november kl. 18.00 på Lysaker.';
const IMAGE = `${SITE}/middag/og.png?v=1`;

const html = readFileSync('dist/index.html', 'utf8');

// Fjern den forhåndsrendrede forsiden inne i #root ved å telle <div>/</div> til rot-elementet lukkes.
function emptyRoot(src) {
  const open = '<div id="root">';
  const start = src.indexOf(open);
  if (start === -1) return src;
  const tag = /<div\b|<\/div>/g;
  tag.lastIndex = start + open.length;
  let depth = 1;
  let m;
  while ((m = tag.exec(src))) {
    depth += m[0] === '</div>' ? -1 : 1;
    if (depth === 0) return src.slice(0, start) + '<div id="root"></div>' + src.slice(m.index + 6);
  }
  return src;
}

const setMeta = (src, attr, key, value) => {
  const re = new RegExp(`(<meta\\s+${attr}="${key.replace(/[.:]/g, '\\$&')}"\\s+content=")[^"]*(")`, 'g');
  return src.replace(re, `$1${value}$2`);
};

let out = html.replace(/<title>[^<]*<\/title>/, `<title>${TITLE}</title>`);
out = setMeta(out, 'name', 'description', DESC);
out = setMeta(out, 'property', 'og:url', `${SITE}/middag`);
out = setMeta(out, 'property', 'og:title', TITLE);
out = setMeta(out, 'property', 'og:description', DESC);
out = setMeta(out, 'property', 'og:image', IMAGE);
out = setMeta(out, 'property', 'og:image:secure_url', IMAGE);
out = setMeta(out, 'property', 'og:image:height', '630');
out = setMeta(out, 'property', 'og:image:alt', 'Mashwara: invitasjon til investormiddag');
out = setMeta(out, 'property', 'og:site_name', 'Mashwara');
out = setMeta(out, 'property', 'og:locale', 'nb_NO');
out = setMeta(out, 'name', 'twitter:url', `${SITE}/middag`);
out = setMeta(out, 'name', 'twitter:title', TITLE);
out = setMeta(out, 'name', 'twitter:description', DESC);
out = setMeta(out, 'name', 'twitter:image', IMAGE);
out = setMeta(out, 'name', 'twitter:image:alt', 'Mashwara: invitasjon til investormiddag');
out = out.replace(/<link rel="canonical"[^>]*>/, `<link rel="canonical" href="${SITE}/middag" />`);
out = setMeta(out, 'name', 'robots', 'noindex, nofollow');
out = out.replace('</head>', '  <style>html,body{background:#003333}</style>\n</head>');
out = emptyRoot(out);

if (!out.includes(TITLE) || !out.includes('<div id="root"></div>')) {
  throw new Error('middag-og: klarte ikke å skrive om dist/index.html');
}

mkdirSync('dist/middag', { recursive: true });
writeFileSync('dist/middag/index.html', out);
console.log('middag-og: skrev dist/middag/index.html');
