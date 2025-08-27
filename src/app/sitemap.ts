import { MetadataRoute } from 'next'
import { prisma } from '@/lib/db'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://your-domain.vercel.app'
  
  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/auth/sign-in`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/dashboard`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ]

  try {
    // Get all playgrounds for dynamic routes
    const playgrounds = await prisma.playground.findMany({
      select: {
        id: true,
        updatedAt: true,
      },
    })

    const playgroundRoutes: MetadataRoute.Sitemap = playgrounds.map((playground) => ({
      url: `${baseUrl}/playground/${playground.id}`,
      lastModified: playground.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))

    return [...staticRoutes, ...playgroundRoutes]
  } catch (error) {
    console.error('Error generating sitemap:', error)
    // Return static routes if database query fails
    return staticRoutes
  }
}
