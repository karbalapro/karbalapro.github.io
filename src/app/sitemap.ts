import { MetadataRoute } from 'next'
import { ziyarats } from '@/data/ziyarats'
import { personas } from '@/data/personas'

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://karbalapro.github.io'

  // Dynamic Ziyarat routes
  const ziyaratRoutes = ziyarats.map((ziyarat) => ({
    url: `${baseUrl}/ziyarat/${ziyarat.id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.9,
  }))

  // Dynamic Persona routes for all languages
  const languages = ['fa', 'en', 'ar'];
  const personaRoutes = [];
  
  for (const lang of languages) {
    for (const persona of personas) {
      personaRoutes.push({
        url: `${baseUrl}/${lang}/personas/${persona.id}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
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
    {
      url: `${baseUrl}/live`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    ...ziyaratRoutes,
    ...personaRoutes,
  ]
}
