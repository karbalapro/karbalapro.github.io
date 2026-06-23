import { MetadataRoute } from 'next'
import { ziyarats } from '@/data/ziyarats'
import { personas } from '@/data/personas'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://karbalapro.github.io'

  // Dynamic Ziyarat routes
  const ziyaratRoutes = ziyarats.map((ziyarat) => ({
    url: `${baseUrl}/ziyarat/${ziyarat.id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.9,
  }))

  // Dynamic Persona routes
  // Actually, personas are currently rendered in a modal on the home page, not as individual routes.
  // But if we ever add individual routes, they would go here.
  
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
  ]
}
