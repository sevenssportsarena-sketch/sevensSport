"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateSitePage(slug: string, content: string) {
  try {
    const updated = await prisma.sitePage.update({
      where: { slug },
      data: { content }
    });

    // Revalidate the public page so visitors see the update immediately
    revalidatePath(`/${slug}`);
    
    return { success: true, page: updated };
  } catch (error) {
    console.error("Failed to update site page:", error);
    return { success: false, error: "Failed to update page content" };
  }
}
