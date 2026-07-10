import Link from "next/link";
import { ArrowLeft, Clock, Grid } from "lucide-react";
import { AdSlot } from "@/components/ads/AdSlot";
import prisma from "@/lib/prisma";
import { getExcerpt } from "@/lib/utils";

function formatTimeAgo(date: Date) {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + "y ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + "mo ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + "d ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + "h ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + "m ago";
  return "Just now";
}

export const revalidate = 60;

export default async function AllNewsPage() {
  const allNews = await prisma.post.findMany({
    where: { status: 'published' },
    orderBy: { created_at: 'desc' },
    include: { categories: true },
    take: 24
  });

  const title = "All News";

  return (
    <div className="container mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-12">
      {/* Page header */}
      <div className="space-y-6">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors group">
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to Home
        </Link>
        <div className="flex items-center gap-4">
          <div className="h-12 w-1.5 rounded-full bg-primary glow-primary" />
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">{title}</h1>
            <p className="text-muted-foreground mt-2">
              The latest news, match reports, and analysis across all sports and categories.
            </p>
          </div>
        </div>
      </div>

      <AdSlot placement="hero_banner" />

      {allNews.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allNews.map((news: any) => (
            <article key={news.id} className="group relative glass rounded-2xl overflow-hidden card-hover">
              <Link href={`/${news.categories[0]?.slug}/${news.slug}`} className="block overflow-hidden">
                <img
                  src={news.cover_image_url || "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"}
                  alt={news.title}
                  className="aspect-[16/10] w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </Link>
              <div className="p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <Link href={`/${news.categories[0]?.slug}`}>
                    <span className="text-[11px] font-bold text-primary uppercase tracking-widest hover:text-primary/80 transition-colors">
                      {news.categories[0]?.name}
                    </span>
                  </Link>
                  <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {formatTimeAgo(news.created_at)}
                  </span>
                </div>
                <Link href={`/${news.categories[0]?.slug}/${news.slug}`} className="block">
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
          <Grid className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground text-lg">No news found yet.</p>
        </div>
      )}

      {allNews.length > 0 && (
        <div className="flex justify-center">
          <button className="rounded-full glass px-8 py-3 text-sm font-bold hover:bg-white/10 transition-all active:scale-95">
            Load More
          </button>
        </div>
      )}
    </div>
  );
}
