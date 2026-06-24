import { ziyarats } from '@/data/ziyarats';
import { personas } from '@/data/personas';

export const dynamic = 'force-static';

export async function GET() {
  const baseUrl = 'https://karbalapro.github.io';
  const languages = ['fa', 'en', 'ar'];
  const today = new Date().toISOString().split('T')[0];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  // Root Page
  xml += `  <url>\n`;
  xml += `    <loc>${baseUrl}</loc>\n`;
  xml += `    <lastmod>${today}</lastmod>\n`;
  xml += `    <changefreq>weekly</changefreq>\n`;
  xml += `    <priority>1.0</priority>\n`;
  xml += `  </url>\n`;

  for (const lang of languages) {
    // Root pages for each language
    xml += `  <url>\n`;
    xml += `    <loc>${baseUrl}/${lang}</loc>\n`;
    xml += `    <lastmod>${today}</lastmod>\n`;
    xml += `    <changefreq>weekly</changefreq>\n`;
    xml += `    <priority>1.0</priority>\n`;
    xml += `  </url>\n`;

    // Live page per language
    xml += `  <url>\n`;
    xml += `    <loc>${baseUrl}/${lang}/live</loc>\n`;
    xml += `    <lastmod>${today}</lastmod>\n`;
    xml += `    <changefreq>daily</changefreq>\n`;
    xml += `    <priority>0.8</priority>\n`;
    xml += `  </url>\n`;

    // Ziyarat listing per language
    xml += `  <url>\n`;
    xml += `    <loc>${baseUrl}/${lang}/ziyarat</loc>\n`;
    xml += `    <lastmod>${today}</lastmod>\n`;
    xml += `    <changefreq>weekly</changefreq>\n`;
    xml += `    <priority>0.9</priority>\n`;
    xml += `  </url>\n`;

    // Ziyarat detail pages per language
    for (const ziyarat of ziyarats) {
      xml += `  <url>\n`;
      xml += `    <loc>${baseUrl}/${lang}/ziyarat/${ziyarat.id}</loc>\n`;
      xml += `    <lastmod>${today}</lastmod>\n`;
      xml += `    <changefreq>monthly</changefreq>\n`;
      xml += `    <priority>0.9</priority>\n`;
      xml += `  </url>\n`;
    }

    // Persona pages per language
    for (const persona of personas) {
      xml += `  <url>\n`;
      xml += `    <loc>${baseUrl}/${lang}/personas/${persona.id}</loc>\n`;
      xml += `    <lastmod>${today}</lastmod>\n`;
      xml += `    <changefreq>monthly</changefreq>\n`;
      xml += `    <priority>0.8</priority>\n`;
      xml += `  </url>\n`;
    }
  }

  xml += `</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
