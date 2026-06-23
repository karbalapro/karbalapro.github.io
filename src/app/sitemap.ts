import { MetadataRoute } from 'next'
import { ziyarats } from '@/data/ziyarats'
import { personas } from '@/data/personas'

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://karbalapro.github.io'

  const languages = ['fa', 'en', 'ar'];

  // Root pages for each language
  const rootPages = languages.map((lang) => ({
    url: `${baseUrl}/${lang}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 1,
  }))

  const localizedRoutes: MetadataRoute.Sitemap = [];

  for (const lang of languages) {
    // Live page per language
    localizedRoutes.push({
      url: `${baseUrl}/${lang}/live`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    });

    // Ziyarat listing per language
    localizedRoutes.push({
      url: `${baseUrl}/${lang}/ziyarat`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    });

    // Ziyarat detail pages per language
    for (const ziyarat of ziyarats) {
      localizedRoutes.push({
        url: `${baseUrl}/${lang}/ziyarat/${ziyarat.id}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.9,
      });
    }

    // Persona pages per language
    for (const persona of personas) {
      localizedRoutes.push({
        url: `${baseUrl}/${lang}/personas/${persona.id}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.8,
      });
    }
  }
  
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    ...rootPages,
    ...localizedRoutes,
  ]
}
