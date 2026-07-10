import { MetadataRoute } from 'next';
import prisma from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://sevenssportsarena.com.ng';

  let posts:any = [];
  try {
    posts = await prisma.post.findMany({
      where: { status: 'published' },
      include: { categories: true },
      orderBy: { created_at: 'desc' },
    });
  } catch (error) {
    console.error("Failed to fetch posts for sitemap", error);
  }

  const postUrls = posts.flatMap((post: any) => 
    post.categories.map((c: any) => ({
      url: `${baseUrl}/${c.slug}/${post.slug}`,
      lastModified: post.updated_at,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))
  );

  let categories:any = [];
  try {
    categories = await prisma.category.findMany();
  } catch (error) {
    console.error("Failed to fetch categories for sitemap", error);
  }

  const categoryUrls = categories.map((cat: any) => ({
    url: `${baseUrl}/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.9,
  }));

  let sitePages:any = [];
  try {
    sitePages = await prisma.sitePage.findMany();
  } catch (error) {
    console.error("Failed to fetch site pages for sitemap", error);
  }

  const sitePageUrls = sitePages.map((page: any) => ({
    url: `${baseUrl}/${page.slug}`,
    lastModified: page.updated_at,
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }));

  const staticUrls = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'always' as const,
      priority: 1,
    }
  ];

  return [...staticUrls, ...categoryUrls, ...postUrls, ...sitePageUrls];
}
