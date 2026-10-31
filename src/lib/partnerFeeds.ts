import Parser from "rss-parser";

export interface PartnerStory {
  title: string;
  link: string;
  pubDate: string;
  source: "Sport Flames";
  imageUrl?: string;
}

type CustomFeed = Record<string, unknown>;

type CustomItem = {
  title?: string;
  link?: string;
  pubDate?: string;
  isoDate?: string;
  content?: string;
  contentSnippet?: string;
  "content:encoded"?: string;
  contentEncoded?: string;
  enclosure?: {
    url?: string;
    type?: string;
  };
  mediaContent?: {
    $?: {
      url?: string;
      medium?: string;
      type?: string;
    };
    url?: string;
  };
  mediaThumbnail?: {
    $?: {
      url?: string;
    };
    url?: string;
  };
};

const parser = new Parser<CustomFeed, CustomItem>({
  customFields: {
    item: [
      ["media:content", "mediaContent", { keepArray: false }],
      ["media:thumbnail", "mediaThumbnail", { keepArray: false }],
      ["enclosure", "enclosure", { keepArray: false }],
      ["content:encoded", "contentEncoded"],
    ],
  },
});

const SPORT_FLAMES_FEED_URL = "https://sportflames.com/feed";

function extractImageFromItem(item: CustomItem): string | undefined {
  // 1. Standard RSS enclosure
  if (item.enclosure?.url) {
    return item.enclosure.url;
  }

  // 2. Media RSS <media:content url="..." />
  const mediaContentUrl = item.mediaContent?.$?.url || item.mediaContent?.url;
  if (mediaContentUrl) {
    return mediaContentUrl;
  }

  // 3. Media RSS <media:thumbnail url="..." />
  const mediaThumbUrl = item.mediaThumbnail?.$?.url || item.mediaThumbnail?.url;
  if (mediaThumbUrl) {
    return mediaThumbUrl;
  }

  // 4. Fallback: extract first <img> src from content:encoded or content
  const html =
    item.contentEncoded || item["content:encoded"] || item.content || "";
  if (html) {
    const imgMatch = html.match(/<img[^>]+src=["']([^"']+)["']/i);
    if (imgMatch?.[1]) {
      return imgMatch[1];
    }
  }

  return undefined;
}

/**
 * Fetches and parses the latest partner headlines from Sport Flames.
 * Cached via Next.js fetch revalidate (15 minutes = 900 seconds).
 * Never throws; returns an empty array if the remote feed is unreachable or malformed.
 */
export async function getSportFlamesStories(
  limit = 6,
): Promise<PartnerStory[]> {
  try {
    const response = await fetch(SPORT_FLAMES_FEED_URL, {
      next: { revalidate: 900 },
      signal: AbortSignal.timeout(8000),
      headers: {
        Accept: "application/rss+xml, application/xml, text/xml, */*",
        "User-Agent":
          "SevensSportsArena-RSS-Ingestor/1.0 (+https://sevenssportsarena.com.ng)",
      },
    });

    if (!response.ok) {
      console.warn(
        `[PartnerFeed] Failed to fetch ${SPORT_FLAMES_FEED_URL}: HTTP ${response.status}`,
      );
      return [];
    }

    const xml = await response.text();
    if (!xml || !xml.trim()) {
      return [];
    }

    const parsedFeed = await parser.parseString(xml);
    const items = parsedFeed.items || [];

    const stories: PartnerStory[] = [];

    for (const item of items) {
      const title = item.title?.trim();
      const link = item.link?.trim();

      if (!title || !link) {
        continue;
      }

      const pubDate = item.isoDate || item.pubDate || new Date().toISOString();
      const imageUrl = extractImageFromItem(item);

      stories.push({
        title,
        link,
        pubDate,
        source: "Sport Flames",
        ...(imageUrl ? { imageUrl } : {}),
      });

      if (stories.length >= limit) {
        break;
      }
    }

    return stories;
  } catch {
    // Gracefully return empty array when partner RSS feed is unreachable
    return [];
  }
}
