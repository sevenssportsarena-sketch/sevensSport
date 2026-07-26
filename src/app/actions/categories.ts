"use server";

import prisma from "@/lib/prisma";

export async function createCategory(name: string) {
  // Try to find "Football" sport, or fallback to the first one, or create it
  let sport = await prisma.sport.findFirst({ where: { name: 'Football' } });
  if (!sport) {
    sport = await prisma.sport.findFirst();
  }
  if (!sport) {
    sport = await prisma.sport.create({
      data: { name: 'Football', slug: 'football' }
    });
  }

  // Create slug from name
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

  const category = await prisma.category.create({
    data: {
      name,
      slug,
      sport_id: sport.id
    }
  });

  return category;
}

export async function deleteCategory(id: string) {
  return await prisma.category.delete({
    where: { id }
  });
}
