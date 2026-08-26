"use server";

import prisma from "@/lib/prisma";

export async function getMorePosts({ skip, categorySlug, tagSlug }: { skip: number, categorySlug?: string, tagSlug?: string }) {
  const where: any = { status: "published" };

  if (categorySlug) {
    where.categories = { some: { slug: categorySlug } };
  }

  if (tagSlug) {
    where.post_tags = { some: { tag: { slug: tagSlug } } };
  }

  const posts = await prisma.post.findMany({
    where,
    orderBy: { created_at: "desc" },
    skip,
    take: 9,
    include: {
      categories: {
        select: {
          slug: true,
          name: true,
        },
      },
    },
  });

  return posts;
}
