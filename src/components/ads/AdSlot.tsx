import prisma from "@/lib/prisma";
import { AdPlacement } from "@prisma/client";
import { cookies } from "next/headers";
import { AdBannerClient } from "./AdBannerClient";

interface AdSlotProps {
  placement: AdPlacement;
}

/**
 * Server component — fetches active ads for the given placement slot
 * from the database and renders a randomly selected one. Returns nothing if no active ad exists.
 */
export async function AdSlot({ placement }: AdSlotProps) {
  const now = new Date();

  // 1. Read user interests from cookie
  const cookieStore = await cookies();
  const interestCookie = cookieStore.get("user_interests");
  let interests: string[] = [];
  if (interestCookie?.value) {
    interests = decodeURIComponent(interestCookie.value).split(",").map(i => i.trim().toLowerCase());
  }

  // 2. Fetch all active ads for this placement
  const ads = await prisma.ad.findMany({
    where: {
      status: "active",
      placements: { has: placement },
      OR: [
        { start_date: null },
        { start_date: { lte: now } },
      ],
      AND: [
        {
          OR: [
            { end_date: null },
            { end_date: { gte: now } },
          ],
        },
      ],
    },
  });

  if (!ads || ads.length === 0) return null;

  // 3. Filter for relatable ads
  let candidateAds = ads;
  if (interests.length > 0) {
    const relatableAds = ads.filter(ad => 
      ad.tags && ad.tags.some(tag => interests.includes(tag.toLowerCase()))
    );
    if (relatableAds.length > 0) {
      candidateAds = relatableAds; // We found relatable ads, so only pick from these!
    }
  }

  // 4. Pick a random ad from the available candidates
  const randomAd = candidateAds[Math.floor(Math.random() * candidateAds.length)];

  return (
    <AdBannerClient
      adId={randomAd.id}
      placement={placement}
      imageUrl={randomAd.image_url}
      targetUrl={randomAd.target_url}
      altText={randomAd.title}
    />
  );
}
