import Link from "next/link";
import {
  ArrowRight,
  Flame,
  Clock,
  TrendingUp,
  Zap,
  Radio,
} from "lucide-react";
import { AdSlot } from "@/components/ads/AdSlot";
import prisma from "@/lib/prisma";
import { getExcerpt } from "@/lib/utils";

/* ─── Helpers ────────────────────────────────────────────── */
function formatTimeAgo(date: Date) {
  const s = Math.floor((Date.now() - date.getTime()) / 1000);
  if (s / 31536000 > 1) return Math.floor(s / 31536000) + "y ago";
  if (s / 2592000 > 1) return Math.floor(s / 2592000) + "mo ago";
  if (s / 86400 > 1) return Math.floor(s / 86400) + "d ago";
  if (s / 3600 > 1) return Math.floor(s / 3600) + "h ago";
  if (s / 60 > 1) return Math.floor(s / 60) + "m ago";
  return "Just now";
}

/* Reliable fallback images – picsum.photos IDs for vibrant sports scenes */
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
const CARD_FALLBACK  = "https://picsum.photos/seed/sports_card/800/500";

function getImage(post: { cover_image_url: string | null; category: { slug: string } }) {
  return (
    post.cover_image_url ||
    CATEGORY_IMAGES[post.category.slug] ||
    FALLBACK_IMAGE
  );
}

/* ─── Page ────────────────────────────────────────────────── */
export const revalidate = 60;

export default async function HomePage() {
  /* Fetch data */
  const featuredPost = await prisma.post.findFirst({
    where: { status: "published", is_featured: true },
    include: { category: true },
    orderBy: { created_at: "desc" },
  });

  const latestNews = await prisma.post.findMany({
    where: {
      status: "published",
      ...(featuredPost ? { id: { not: featuredPost.id } } : {}),
    },
    include: { category: true },
    orderBy: { created_at: "desc" },
    take: 9,
  });

  const [heroSidePosts, gridPosts] = [latestNews.slice(0, 3), latestNews.slice(3)];

  return (
    <div className="space-y-16 pb-20">
      {/* ══════════════════════════════════════════════════════════
          HERO SECTION
      ══════════════════════════════════════════════════════════ */}
      <section className="relative w-full overflow-hidden">
        {/* ── Live ticker bar ──────────────────────────────────── */}
        <div className="relative z-20 flex items-center gap-0 overflow-hidden bg-primary text-primary-foreground">
          <span className="flex shrink-0 items-center gap-2 bg-black/30 px-4 py-2 text-xs font-black uppercase tracking-widest">
            <Radio className="h-3 w-3 animate-pulse" /> Live
          </span>
          <div className="relative flex-1 overflow-hidden">
            <ul
              className="flex animate-[ticker_30s_linear_infinite] gap-12 whitespace-nowrap py-2 text-xs font-semibold"
              style={{ willChange: "transform" }}
            >
              {(latestNews.length > 0 ? latestNews : []).concat(latestNews).map(
                (p, i) => (
                  <li key={i} className="flex shrink-0 items-center gap-2">
                    <span className="opacity-60">•</span>
                    <Link href={`/${p.category.slug}/${p.slug}`} className="hover:underline">
                      {p.title}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>
        </div>

        {/* ── Main hero content ─────────────────────────────────── */}
        {featuredPost ? (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_440px]">
            {/* LEFT — cinematic featured image card */}
            <div className="relative min-h-[70vh] lg:min-h-[88vh] overflow-hidden">
              {/* Image */}
              <img
                src={getImage(featuredPost)}
                alt={featuredPost.title}
                className="absolute inset-0 h-full w-full object-cover scale-[1.03] transition-transform duration-[3s] hover:scale-100"
              />
              {/* Gradient layers */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent" />

              {/* Floating content */}
              <div className="relative z-10 flex h-full flex-col justify-between p-6 sm:p-10 lg:p-14">
                {/* Top badges */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3.5 py-1.5 text-[11px] font-black uppercase tracking-widest text-primary-foreground shadow-lg glow-primary">
                    <Flame className="h-3 w-3" /> Featured
                  </span>
                  <Link href={`/${featuredPost.category.slug}`}>
                    <span className="inline-flex items-center rounded-full border border-white/25 bg-white/10 px-3 py-1 text-[11px] font-bold text-white backdrop-blur-sm hover:border-primary/50 hover:bg-primary/20 transition-all">
                      {featuredPost.category.name}
                    </span>
                  </Link>
                </div>

                {/* Bottom content */}
                <div className="space-y-5 max-w-2xl">
                  <Link href={`/${featuredPost.category.slug}/${featuredPost.slug}`}>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-black tracking-tight leading-[1.05] text-white drop-shadow-xl hover:text-primary transition-colors duration-200">
                      {featuredPost.title}
                    </h1>
                  </Link>

                  <p className="text-sm sm:text-base text-white/75 leading-relaxed line-clamp-2 max-w-lg">
                    {getExcerpt(featuredPost.content, 180)}
                  </p>

                  <div className="flex flex-wrap items-center gap-4">
                    <Link
                      href={`/${featuredPost.category.slug}/${featuredPost.slug}`}
                      className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-black text-primary-foreground shadow-lg transition-all hover:scale-105 active:scale-95 glow-primary"
                    >
                      Read Story <ArrowRight className="h-4 w-4" />
                    </Link>
                    <span className="flex items-center gap-1.5 text-xs text-white/60">
                      <Clock className="h-3.5 w-3.5" />
                      {formatTimeAgo(featuredPost.created_at)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT — stacked secondary stories */}
            <div className="flex flex-col divide-y divide-border bg-card/80 backdrop-blur-md lg:border-l border-border overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4">
                <div className="flex items-center gap-2">
                  <div className="h-5 w-1 rounded-full bg-primary" />
                  <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                    Breaking
                  </span>
                </div>
                <Link
                  href="/news"
                  className="text-[11px] font-bold text-primary hover:text-primary/80 flex items-center gap-1"
                >
                  All news <ArrowRight className="h-3 w-3" />
                </Link>
              </div>

              {/* Stories */}
              {heroSidePosts.map((post: any) => (
                <Link
                  key={post.id}
                  href={`/${post.category.slug}/${post.slug}`}
                  className="group flex gap-3 p-4 sm:p-5 hover:bg-primary/5 transition-colors"
                >
                  <div className="relative shrink-0 overflow-hidden rounded-xl w-20 h-20 sm:w-24 sm:h-24">
                    <img
                      src={getImage(post)}
                      alt={post.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div className="flex flex-col justify-center gap-1.5 min-w-0">
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary">
                      {post.category.name}
                    </span>
                    <h3 className="text-sm font-bold leading-snug line-clamp-3 group-hover:text-primary transition-colors">
                      {post.title}
                    </h3>
                    <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                      <Clock className="h-3 w-3" /> {formatTimeAgo(post.created_at)}
                    </span>
                  </div>
                </Link>
              ))}

              {/* Category quick links */}
              <div className="px-5 py-4 space-y-2">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-3">
                  Browse Categories
                </p>
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: "World Cup", href: "/world-cup" },
                    { label: "Transfers", href: "/transfers" },
                    { label: "Premier League", href: "/premier-league" },
                    { label: "Champions League", href: "/champions-league" },
                    { label: "La Liga", href: "/la-liga" },
                    { label: "MLS", href: "/mls" },
                  ].map((cat: any) => (
                    <Link
                      key={cat.href}
                      href={cat.href}
                      className="rounded-full border border-border bg-background px-3 py-1 text-[11px] font-semibold hover:border-primary hover:text-primary transition-all"
                    >
                      {cat.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* No featured post fallback */
          <div className="relative flex min-h-[60vh] items-center justify-center overflow-hidden">
            <img
              src={FALLBACK_IMAGE}
              alt="Sports"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/40" />
            <div className="relative z-10 text-center px-4">
              <div className="glass rounded-3xl p-12 max-w-md mx-auto border border-border/50">
                <Zap className="h-12 w-12 text-primary mx-auto mb-4 glow-primary" />
                <h1 className="text-2xl font-black mb-3">Welcome to SevensArena</h1>
                <p className="text-muted-foreground text-sm mb-6">
                  The home of premium sports coverage. Publish your first featured article to transform this section.
                </p>
                <Link
                  href="/admin/posts/new"
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-black text-primary-foreground glow-primary"
                >
                  Create First Article <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ══════════════════════════════════════════════════════════
          AD BANNER
      ══════════════════════════════════════════════════════════ */}
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AdSlot placement="hero_banner" />
      </div>

      {/* ══════════════════════════════════════════════════════════
          LATEST NEWS GRID
      ══════════════════════════════════════════════════════════ */}
      <section className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <div className="h-8 w-1 rounded-full bg-primary glow-primary" />
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Latest News
            </h2>
          </div>
          <Link
            href="/news"
            className="hidden md:inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
          >
            View All <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {gridPosts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {gridPosts.map((news: any) => (
              <article
                key={news.id}
                className="group relative glass rounded-2xl overflow-hidden card-hover"
              >
                <Link href={`/${news.category.slug}/${news.slug}`} className="block overflow-hidden">
                  <img
                    src={getImage(news)}
                    alt={news.title}
                    className="aspect-[16/10] w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Link>

                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <Link href={`/${news.category.slug}`}>
                      <span className="text-[11px] font-bold text-primary uppercase tracking-widest hover:text-primary/80 transition-colors">
                        {news.category.name}
                      </span>
                    </Link>
                    <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {formatTimeAgo(news.created_at)}
                    </span>
                  </div>
                  <Link href={`/${news.category.slug}/${news.slug}`} className="block">
                    <h3 className="font-bold text-[15px] leading-snug line-clamp-2 group-hover:text-primary transition-colors duration-200">
                      {news.title}
                    </h3>
                  </Link>
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {getExcerpt(news.content, 120)}
                  </p>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="glass rounded-3xl py-20 text-center">
            <p className="text-muted-foreground">No recent news available.</p>
          </div>
        )}

        <div className="mt-12 flex justify-center">
          <Link
            href="/news"
            className="rounded-full glass px-8 py-3 text-sm font-bold hover:bg-white/10 transition-all active:scale-95 flex items-center gap-2 border border-border"
          >
            <TrendingUp className="h-4 w-4 text-primary" />
            Load More Stories
          </Link>
        </div>
      </section>
    </div>
  );
}
