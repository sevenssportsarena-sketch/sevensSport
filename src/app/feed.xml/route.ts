import { Feed } from "feed";
import prisma from "@/lib/prisma";
import { getExcerpt } from "@/lib/utils";
import type { PostBlock } from "@/components/admin/BlockBuilder";

export const revalidate = 1800; // Revalidate every 30 minutes (1800 seconds)

const SITE_URL = "https://sevenssportsarena.com.ng";

/**
 * Converts our block-based JSON post content (or legacy HTML) into clean HTML
 * suitable for RSS <content:encoded>.
 */
function renderContentToHtml(rawContent: string): string {
  try {
    const parsed = JSON.parse(rawContent);
    if (Array.isArray(parsed)) {
      const blocks = parsed as PostBlock[];
      return blocks
        .map((block) => {
          switch (block.type) {
            case "paragraph":
              return `<p>${block.content || ""}</p>`;
            case "heading": {
              const level = block.level || 2;
              return `<h${level}>${block.content || ""}</h${level}>`;
            }
            case "image":
              if (!block.url) return "";
              return `<figure><img src="${block.url}" alt="${
                block.alt || block.caption || "Article image"
              }" />${
                block.caption ? `<figcaption>${block.caption}</figcaption>` : ""
              }</figure>`;
            case "quote":
              return `<blockquote>${block.content || ""}</blockquote>`;
            case "table": {
              const headers = block.tableHeaders || [];
              const rows = block.tableRows || [];
              if (headers.length === 0) return "";
              const thead = `<thead><tr>${headers
                .map((h) => `<th>${h || ""}</th>`)
                .join("")}</tr></thead>`;
              const tbody = `<tbody>${rows
                .map(
                  (row) =>
                    `<tr>${row
                      .map((cell) => `<td>${cell || ""}</td>`)
                      .join("")}</tr>`,
                )
                .join("")}</tbody>`;
              return `<table>${thead}${tbody}</table>`;
            }
            default:
              return "";
          }
        })
        .filter(Boolean)
        .join("\n");
    }
  } catch {
    // Fallback to raw HTML content if not valid JSON blocks
  }
  return rawContent;
}

function resolveAbsoluteImageUrl(url?: string | null): string | undefined {
  if (!url) return undefined;
  const trimmed = url.trim();
  if (!trimmed) return undefined;
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed.replace(/&/g, "&amp;");
  }
  if (trimmed.startsWith("/")) {
    return `${SITE_URL}${trimmed}`.replace(/&/g, "&amp;");
  }
  return undefined;
}

export async function GET() {
  const feed = new Feed({
    title: "Sevens Sports Arena – Live Sports News & Analysis",
    description:
      "Your ultimate destination for real-time sports news, match reports, transfer rumours, and interactive discussions.",
    id: `${SITE_URL}/`,
    link: SITE_URL,
    language: "en",
    image: `${SITE_URL}/logo.jpeg`,
    favicon: `${SITE_URL}/favicon.ico`,
    copyright: `All rights reserved ${new Date().getFullYear()}, Sevens Sports Arena`,
    updated: new Date(),
    generator: "Sevens Sports Arena RSS 2.0",
    feedLinks: {
      rss2: `${SITE_URL}/feed.xml`,
    },
    author: {
      name: "SevensSportsArena",
      link: SITE_URL,
    },
  });

  try {
    const posts = await prisma.post.findMany({
      where: { status: "published" },
      include: { categories: true },
      orderBy: { created_at: "desc" },
      take: 25,
    });

    if (posts.length > 0) {
      feed.options.updated = new Date(
        posts[0].updated_at || posts[0].created_at,
      );
    }

    for (const post of posts) {
      const categorySlug = post.categories?.[0]?.slug || "news";
      const articleUrl = `${SITE_URL}/${categorySlug}/${post.slug}`;
      const description = getExcerpt(post.content, 240);
      const htmlContent = renderContentToHtml(post.content);
      const imageUrl = resolveAbsoluteImageUrl(post.cover_image_url);

      feed.addItem({
        title: post.title,
        id: articleUrl,
        link: articleUrl,
        description,
        content: htmlContent,
        date: new Date(post.created_at),
        ...(imageUrl ? { image: imageUrl } : {}),
        category: post.categories.map((cat) => ({
          name: cat.name,
          domain: `${SITE_URL}/${cat.slug}`,
        })),
        author: [
          {
            name: "SevensSportsArena",
            link: SITE_URL,
          },
        ],
      });
    }
  } catch {
    // Gracefully return valid empty RSS channel if database is temporarily unreachable
  }

  return new Response(feed.rss2(), {
    status: 200,
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=3600",
    },
  });
}
