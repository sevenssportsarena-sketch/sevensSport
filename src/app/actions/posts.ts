"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import prisma from "@/lib/prisma";

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

  await prisma.post.create({
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
  });

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

  await prisma.post.update({
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
  });

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
