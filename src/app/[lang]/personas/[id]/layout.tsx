import { Metadata } from "next";
import { personas } from "@/data/personas";

export function generateStaticParams() {
  const languages = ['fa', 'en', 'ar'];
  const params: { lang: string, id: string }[] = [];
  
  for (const lang of languages) {
    for (const persona of personas) {
      params.push({ lang, id: persona.id });
    }
  }
  
  return params;
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string, id: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const { lang, id } = resolvedParams;
  
  const persona = personas.find(p => p.id === id);
  
  if (!persona) return { title: 'Not Found' };

  // Read raw locale data directly to generate SEO metadata
  // In Next.js, doing dynamic imports inside generateMetadata can be tricky, 
  // but since these are static, we can try-catch require them.
  let name = id;
  let title = '';
  let description = '';
  
  try {
    const localeData = require(`@/locales/${lang}/personas/${id}.json`);
    name = localeData.name;
    title = localeData.title;
    description = localeData.description || localeData.biography?.substring(0, 150) + '...';
  } catch (e) {
    // Fallback to English or ID
  }

  const seoTitle = `${name} | ${title} - دانشنامه عاشورا`;

  return {
    title: seoTitle,
    description,
    openGraph: {
      title: seoTitle,
      description,
      url: `https://karbalapro.github.io/${lang}/personas/${id}`,
      type: "profile",
    },
    alternates: {
      canonical: `/${lang}/personas/${id}`,
      languages: {
        'fa': `/fa/personas/${id}`,
        'en': `/en/personas/${id}`,
        'ar': `/ar/personas/${id}`,
      }
    }
  };
}

export default async function PersonaLayout({ children, params }: { children: React.ReactNode, params: Promise<{ lang: string, id: string }> }) {
  const resolvedParams = await params;
  const { lang, id } = resolvedParams;
  
  let name = id;
  let desc = '';
  try {
    const localeData = require(`@/locales/${lang}/personas/${id}.json`);
    name = localeData.name;
    desc = localeData.description || localeData.biography?.substring(0, 150) + '...';
  } catch (e) {}

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": name,
    "description": desc,
    "url": `https://karbalapro.github.io/${lang}/personas/${id}`
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
