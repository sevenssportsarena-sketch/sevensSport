"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import prisma from "@/lib/prisma";
import { AdPlacement, AdStatus } from "@prisma/client";

/* ── Analytics tracking (used by AdBanner component) ───────── */

export async function trackAdImpression(adId: string, placement: AdPlacement) {
  try {
    await prisma.adAnalytics.create({
      data: { ad_id: adId, event_type: "impression", placement },
    });
  } catch {
    // Silently ignore if adId is not a real DB UUID (e.g. hardcoded placeholder)
  }
  return { success: true };
}

export async function trackAdClick(adId: string, placement: AdPlacement) {
  try {
    await prisma.adAnalytics.create({
      data: { ad_id: adId, event_type: "click", placement },
    });
  } catch {
    // Silently ignore if adId is not a real DB UUID (e.g. hardcoded placeholder)
  }
  return { success: true };
}

/* ── Auth guard ─────────────────────────────────────────────── */

async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
  return user;
}

export async function createAd(formData: FormData) {
  await requireAdmin();

  const title = formData.get("title") as string;
  const image_url = formData.get("image_url") as string;
  const target_url = formData.get("target_url") as string;
  const placements = formData.getAll("placements") as AdPlacement[];
  const status = (formData.get("status") ?? "active") as AdStatus;
  const start_date = formData.get("start_date") as string | null;
  const end_date = formData.get("end_date") as string | null;
  const tagsStr = formData.get("tags") as string | null;
  const tags = tagsStr ? tagsStr.split(",").map(t => t.trim()).filter(Boolean) : [];

  await prisma.ad.create({
    data: {
      title,
      image_url,
      target_url,
      tags,
      placements,
      status,
      start_date: start_date ? new Date(start_date) : null,
      end_date: end_date ? new Date(end_date) : null,
    },
  });

  revalidatePath("/admin/ads");
  redirect("/admin/ads");
}

export async function updateAd(id: string, formData: FormData) {
  await requireAdmin();

  const title = formData.get("title") as string;
  const image_url = formData.get("image_url") as string;
  const target_url = formData.get("target_url") as string;
  const placements = formData.getAll("placements") as AdPlacement[];
  const status = formData.get("status") as AdStatus;
  const start_date = formData.get("start_date") as string | null;
  const end_date = formData.get("end_date") as string | null;
  const tagsStr = formData.get("tags") as string | null;
  const tags = tagsStr ? tagsStr.split(",").map(t => t.trim()).filter(Boolean) : [];

  await prisma.ad.update({
    where: { id },
    data: {
      title,
      image_url,
      target_url,
      tags,
      placements,
      status,
      start_date: start_date ? new Date(start_date) : null,
      end_date: end_date ? new Date(end_date) : null,
    },
  });

  revalidatePath("/admin/ads");
  revalidatePath(`/admin/ads/${id}/edit`);
  redirect("/admin/ads");
}

export async function deleteAd(id: string) {
  await requireAdmin();

  await prisma.adAnalytics.deleteMany({ where: { ad_id: id } });
  await prisma.ad.delete({ where: { id } });

  revalidatePath("/admin/ads");
}

export async function toggleAdStatus(id: string, currentStatus: AdStatus) {
  await requireAdmin();
  const next = currentStatus === "active" ? "paused" : "active";
  await prisma.ad.update({ where: { id }, data: { status: next } });
  revalidatePath("/admin/ads");
}
