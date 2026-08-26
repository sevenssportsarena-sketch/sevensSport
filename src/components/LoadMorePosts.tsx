"use client";

import { useState } from "react";
import Link from "next/link";
import { Clock } from "lucide-react";
import { getMorePosts } from "@/lib/actions/posts";

function formatTimeAgo(dateStr: string | Date) {
  const date = new Date(dateStr);
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

function getExcerpt(content: string, length: number) {
  if (!content) return "";
  // strip html tags if any
  const text = content.replace(/<[^>]+>/g, "");
  if (text.length <= length) return text;
  return text.substring(0, length) + "...";
}

type LoadMorePostsProps = {
  initialSkip: number;
  categorySlug?: string;
  tagSlug?: string;
};

export function LoadMorePosts({ initialSkip, categorySlug, tagSlug }: LoadMorePostsProps) {
  const [posts, setPosts] = useState<any[]>([]);
  const [skip, setSkip] = useState(initialSkip);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loadMore = async () => {
    setLoading(true);
    try {
      const newPosts = await getMorePosts({ skip, categorySlug, tagSlug });
      if (newPosts.length === 0) {
        setHasMore(false);
      } else {
        setPosts((prev) => [...prev, ...newPosts]);
        setSkip((prev) => prev + newPosts.length);
      }
    } catch (error) {
      console.error("Failed to load more posts:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!hasMore && posts.length === 0) return null;

  return (
    <>
      {posts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6 w-full">
          {posts.map((news) => (
            <article key={news.id} className="group relative glass rounded-2xl overflow-hidden card-hover text-left w-full text-foreground">
              <Link href={`/${news.categories?.[0]?.slug || "news"}/${news.slug}`} className="block overflow-hidden">
                <img
                  src={news.cover_image_url || "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"}
                  alt={news.title}
                  className="aspect-[16/10] w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </Link>
              <div className="p-5 space-y-3">
                <div className="flex items-center justify-between">
                  {news.categories?.[0] ? (
                    <Link href={`/${news.categories[0].slug}`}>
                      <span className="text-[11px] font-bold text-primary uppercase tracking-widest hover:text-primary/80 transition-colors">
                        {news.categories[0].name}
                      </span>
                    </Link>
                  ) : (
                    <span className="text-[11px] font-bold text-primary uppercase tracking-widest">
                      NEWS
                    </span>
                  )}
                  <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {formatTimeAgo(news.created_at)}
                  </span>
                </div>
                <Link href={`/${news.categories?.[0]?.slug || "news"}/${news.slug}`} className="block">
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
      )}

      {hasMore && (
        <div className="flex justify-center mt-12 w-full">
          <button
            onClick={loadMore}
            disabled={loading}
            className="rounded-full glass px-8 py-3 text-sm font-bold hover:bg-white/10 transition-all active:scale-95 disabled:opacity-50 border border-border"
          >
            {loading ? "Loading..." : "Load More Stories"}
          </button>
        </div>
      )}
    </>
  );
}
