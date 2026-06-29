import Link from "next/link";
import { ArrowLeft, Clock, Tag } from "lucide-react";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";

// Helper function to format time ago
function formatTimeAgo(date: Date) {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " years ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " months ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " days ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " hours ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " minutes ago";
  return Math.floor(seconds) + " seconds ago";
}

export const revalidate = 60;

export async function generateStaticParams() {
  try {
    const tags = await prisma.tag.findMany({
      select: { slug: true }
    });
    return tags.map((t: any) => ({
      tagSlug: t.slug,
    }));
  } catch {
    return [];
  }
}

export default async function TagPage({
  params,
}: {
  params: Promise<{ tagSlug: string }>;
}) {
  const { tagSlug } = await params;
  
  const tagData = await prisma.tag.findUnique({
    where: { slug: tagSlug },
    include: {
      post_tags: {
        include: {
          post: {
            include: { category: true }
          }
        },
        orderBy: {
          post: { created_at: 'desc' }
        }
      }
    }
  });

  if (!tagData) {
    notFound();
  }

  const tagNews = tagData.post_tags
    .map((pt: any) => pt.post)
    .filter((p: any) => p.status === 'published');

  const title = tagData.name;

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-12">
      <div className="flex flex-col gap-4">
        <Link href="/" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors w-fit">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Tag className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">#{title}</h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl">
          Showing all articles tagged with <span className="font-semibold text-foreground">#{tagData.name}</span>.
        </p>
      </div>

      {tagNews.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tagNews.map((news: any) => (
            <article key={news.id} className="group relative flex flex-col space-y-4">
              <Link href={`/${news.category.slug}/${news.slug}`} className="block overflow-hidden rounded-2xl">
                <img
                  src={news.cover_image_url || "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"}
                  alt={news.title}
                  className="aspect-[16/9] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </Link>
              <div className="flex flex-col flex-1">
                <Link href={`/${news.category.slug}`}>
                  <span className="text-xs font-semibold text-primary uppercase tracking-wider hover:underline">
                    {news.category.name}
                  </span>
                </Link>
                <Link href={`/${news.category.slug}/${news.slug}`} className="mt-2 block">
                  <h3 className="text-xl font-bold leading-snug group-hover:text-primary transition-colors">
                    {news.title}
                  </h3>
                </Link>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                  {news.content.substring(0, 120)}...
                </p>
                <div className="mt-4 pt-4 flex items-center text-xs text-muted-foreground border-t border-border/50">
                  <Clock className="mr-1 h-3 w-3" />
                  {formatTimeAgo(news.created_at)}
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center text-muted-foreground border border-dashed rounded-3xl">
          <p>No articles found for this tag.</p>
        </div>
      )}

      {tagNews.length > 0 && (
        <div className="mt-12 flex justify-center">
          <button className="rounded-full border border-border bg-background px-6 py-2.5 text-sm font-semibold shadow-sm hover:bg-accent transition-colors">
            Load More Tagged Articles
          </button>
        </div>
      )}
    </div>
  );
}
