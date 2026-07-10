import Link from "next/link";
import { Search, Clock, ArrowRight } from "lucide-react";
import prisma from "@/lib/prisma";
import { getExcerpt } from "@/lib/utils";

// Re-using the same fallback image logic from home page
const CATEGORY_IMAGES: Record<string, string> = {
  "world-cup":            "https://picsum.photos/seed/worldcup/1600/900",
  transfers:              "https://picsum.photos/seed/transfers/1600/900",
  mls:                    "https://picsum.photos/seed/mls2026/1600/900",
  "managerial-changes":   "https://picsum.photos/seed/manager/1600/900",
  "la-liga":              "https://picsum.photos/seed/laliga/1600/900",
  "premier-league":       "https://picsum.photos/seed/premier/1600/900",
  "serie-a":              "https://picsum.photos/seed/seriea/1600/900",
  "champions-league":     "https://picsum.photos/seed/ucl/1600/900",
  "ligue-1":              "https://picsum.photos/seed/ligue1/1600/900",
  "international-football": "https://picsum.photos/seed/intlfootball/1600/900",
};

const FALLBACK_IMAGE = "https://picsum.photos/seed/sports_hero/1600/900";

function getImage(post: { cover_image_url: string | null; categories: { slug: string }[] }) {
  const categorySlug = post.categories?.[0]?.slug || "";
  return (
    post.cover_image_url ||
    CATEGORY_IMAGES[categorySlug] ||
    FALLBACK_IMAGE
  );
}

function formatTimeAgo(date: Date) {
  const s = Math.floor((Date.now() - date.getTime()) / 1000);
  if (s / 31536000 > 1) return Math.floor(s / 31536000) + "y ago";
  if (s / 2592000 > 1) return Math.floor(s / 2592000) + "mo ago";
  if (s / 86400 > 1) return Math.floor(s / 86400) + "d ago";
  if (s / 3600 > 1) return Math.floor(s / 3600) + "h ago";
  if (s / 60 > 1) return Math.floor(s / 60) + "m ago";
  return "Just now";
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q || "";

  let results: any[] = [];

  if (query.trim()) {
    results = await prisma.post.findMany({
      where: {
        status: "published",
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { content: { contains: query, mode: "insensitive" } },
        ],
      },
      include: { categories: true },
      orderBy: { created_at: "desc" },
    });
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 min-h-[70vh]">
      {/* Search Header */}
      <div className="flex flex-col items-center text-center mb-16">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 mb-6">
          <Search className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight mb-4">
          Search Results
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          {query ? (
            <>
              Found {results.length} result{results.length !== 1 ? 's' : ''} for <span className="font-semibold text-foreground">"{query}"</span>
            </>
          ) : (
            "Please enter a search term to see results."
          )}
        </p>
      </div>

      {/* Results Grid */}
      {query && results.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((post) => (
            <article
              key={post.id}
              className="group relative glass rounded-2xl overflow-hidden card-hover"
            >
              <Link href={`/${post.categories[0]?.slug}/${post.slug}`} className="block overflow-hidden">
                <img
                  src={getImage(post)}
                  alt={post.title}
                  className="aspect-[16/10] w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>

              <div className="p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <Link href={`/${post.categories[0]?.slug}`}>
                    <span className="text-[11px] font-bold text-primary uppercase tracking-widest hover:text-primary/80 transition-colors">
                      {post.categories[0]?.name}
                    </span>
                  </Link>
                  <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {formatTimeAgo(post.created_at)}
                  </span>
                </div>
                <Link href={`/${post.categories[0]?.slug}/${post.slug}`} className="block">
                  <h3 className="font-bold text-[15px] leading-snug line-clamp-2 group-hover:text-primary transition-colors duration-200">
                    {post.title}
                  </h3>
                </Link>
                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                  {getExcerpt(post.content, 120)}
                </p>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Empty State */}
      {query && results.length === 0 && (
        <div className="glass rounded-3xl py-24 text-center mt-8 border border-border/50">
          <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h2 className="text-2xl font-bold mb-2">No matches found</h2>
          <p className="text-muted-foreground">
            We couldn't find any articles matching "{query}". Try checking your spelling or using different keywords.
          </p>
          <div className="mt-8">
            <Link
              href="/news"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-black text-primary-foreground transition-all hover:scale-105 active:scale-95 glow-primary"
            >
              Browse Latest News <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
