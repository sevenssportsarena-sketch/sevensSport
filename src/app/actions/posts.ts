"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import prisma from "@/lib/prisma";
import { sendNewPostNotification } from "@/lib/onesignal";

export async function createPost(formData: FormData, content: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const title = formData.get("title") as string;
  const slug = formData.get("slug") as string;
  const category_ids = formData.getAll("category_id") as string[];
  const status = formData.get("status") as "draft" | "published";

  const post = await prisma.post.create({
    data: {
      title,
      slug,
      content,
      categories: { connect: category_ids.map(id => ({ id })) },
      status,
      author_id: user.id,
      is_featured: formData.get("is_featured") === "on",
      cover_image_url: formData.get("cover_image_url") as string || null,
    },
    include: {
      categories: true,
    }
  });

  if (status === "published" && post.categories.length > 0) {
    const categorySlug = post.categories[0].slug;
    // Send notification without blocking the response
    sendNewPostNotification(title, categorySlug, slug).catch(console.error);
  }

  revalidatePath("/admin/dashboard");
  revalidatePath("/admin/posts");
  redirect("/admin/posts");
}

export async function updatePost(id: string, formData: FormData, content: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const title = formData.get("title") as string;
  const slug = formData.get("slug") as string;
  const category_ids = formData.getAll("category_id") as string[];
  const status = formData.get("status") as "draft" | "published";

  // Check existing post status before update
  const existingPost = await prisma.post.findUnique({ 
    where: { id },
    select: { status: true }
  });

  const post = await prisma.post.update({
    where: { id },
    data: {
      title,
      slug,
      content,
      categories: { set: category_ids.map(id => ({ id })) },
      status,
      is_featured: formData.get("is_featured") === "on",
      cover_image_url: formData.get("cover_image_url") as string || null,
    },
    include: {
      categories: true,
    }
  });

  // Only notify if changing from draft to published
  if (existingPost?.status === "draft" && status === "published" && post.categories.length > 0) {
    const categorySlug = post.categories[0].slug;
    sendNewPostNotification(title, categorySlug, slug).catch(console.error);
  }

  revalidatePath("/admin/dashboard");
  revalidatePath("/admin/posts");
  revalidatePath(`/admin/posts/${id}/edit`);
  redirect("/admin/posts");
}

export async function deletePost(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  // Delete associated tags first
  await prisma.postTag.deleteMany({
    where: { post_id: id }
  });

  await prisma.post.delete({
    where: { id },
  });

  revalidatePath("/admin/dashboard");
  revalidatePath("/admin/posts");
}
