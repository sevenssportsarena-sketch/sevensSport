import Link from "next/link";
import { ArrowLeft, Clock, MessageSquare, Share2, Bookmark, ChevronUp } from "lucide-react";
import { notFound } from "next/navigation";
import { ReactionModule } from "@/components/interactive/ReactionModule";
import { ShareButton } from "@/components/interactive/ShareButton";
import { CommentForm } from "@/components/interactive/CommentForm";
import { BlockRenderer } from "@/components/public/BlockRenderer";
import { AdSlot } from "@/components/ads/AdSlot";
import { ViewTracker } from "@/components/analytics/ViewTracker";
import prisma from "@/lib/prisma";

export const revalidate = 60;

export async function generateStaticParams() {
  try {
    const posts = await prisma.post.findMany({
      include: { category: true },
      where: { status: 'published' }
    });
    return posts.map((post: any) => ({
      category: post.category.slug,
      slug: post.slug,
    }));
  } catch {
    return [];
  }
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { category: categorySlug, slug } = await params;
  
  const post = await prisma.post.findUnique({
    where: { slug: slug },
    include: {
      category: true,
      reactions: true,
      comments: {
        where: { is_approved: true },
        orderBy: { created_at: "desc" }
      },
      post_tags: {
        include: { tag: true }
      },
      _count: {
        select: { comments: true }
      }
    }
  });

  if (!post || post.category.slug !== categorySlug) {
    notFound();
  }

  const articleTitle = post.title;
  const categoryTitle = post.category.name;

  return (
    <article className="min-h-screen">
      <ViewTracker postId={post.id} />
      {/* ── Fixed mobile interaction strip ─────────────────────── */}
      <div className="lg:hidden fixed left-0 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center gap-1.5 py-3 px-1.5 bg-background/90 backdrop-blur-md border border-border/60 rounded-r-2xl shadow-xl">
        <ReactionModule
          postId={post.id}
          mobile
          initialCounts={{
            like: post.reactions.filter((r: any) => r.type === "like").length,
            fire: post.reactions.filter((r: any) => r.type === "fire").length,
            goal: post.reactions.filter((r: any) => r.type === "goal").length,
            shock: post.reactions.filter((r: any) => r.type === "shock").length,
          }}
        />
        <div className="w-full h-px bg-border/60 my-0.5" />
        <ShareButton title={post.title} mobile />
      </div>
      
      {/* ── Cinematic Header ─────────────────────────────── */}
      <header className="relative w-full min-h-[60vh]">
        <img
          src={post.cover_image_url || "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80"}
          alt={articleTitle}
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Triple gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
        
        <div className="absolute inset-0 flex items-end">
          <div className="container mx-auto max-w-4xl px-4 pb-12 sm:px-6 lg:px-8">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 mb-6">
              <Link href="/" className="text-xs text-muted-foreground hover:text-primary transition-colors">Home</Link>
              <span className="text-muted-foreground/40">/</span>
              <Link href={`/${categorySlug}`} className="text-xs text-muted-foreground hover:text-primary transition-colors">{categoryTitle}</Link>
            </div>

            {/* Category badge */}
            <Link href={`/${categorySlug}`} className="inline-block mb-5">
              <span className="inline-flex items-center rounded-full bg-primary/90 px-3.5 py-1.5 text-xs font-bold text-primary-foreground uppercase tracking-wider backdrop-blur-sm glow-primary hover:bg-primary transition-colors">
                {categoryTitle}
              </span>
            </Link>

            {/* Title */}
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.08] mb-8">
              {articleTitle}
            </h1>

            {/* Author + Meta */}
            <div className="flex flex-wrap items-center gap-5 text-sm text-muted-foreground">
              <div className="flex items-center gap-2.5">
                <div className="h-10 w-10 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center overflow-hidden">
                  <img src="https://ui-avatars.com/api/?name=SA&background=1a1a2e&color=4ade80&bold=true&size=40" alt="Author" className="h-full w-full object-cover" />
                </div>
                <div className="flex flex-col">
                  <span className="text-foreground font-semibold text-sm">SevensArena</span>
                  <time dateTime={post.created_at.toISOString()} className="text-xs text-muted-foreground">{post.created_at.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
                </div>
              </div>
              <div className="flex items-center gap-1 text-xs">
                <MessageSquare className="h-3.5 w-3.5" />
                <span>{post._count.comments} comments</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ── Article Body ─────────────────────────────────── */}
      <div className="container mx-auto max-w-4xl pl-14 pr-4 sm:pl-6 sm:pr-6 lg:px-8 py-16 flex flex-col lg:flex-row gap-12">
        
        {/* Sticky Interaction Sidebar */}
        <div className="hidden lg:block sticky top-24 h-fit pr-8">
          <ReactionModule 
            postId={post.id} 
            initialCounts={{
              like: post.reactions.filter((r: any) => r.type === "like").length,
              fire: post.reactions.filter((r: any) => r.type === "fire").length,
              goal: post.reactions.filter((r: any) => r.type === "goal").length,
              shock: post.reactions.filter((r: any) => r.type === "shock").length,
            }}
          />
          <div className="h-px bg-border my-2" />
          <ShareButton title={post.title} />
          
          <button className="flex flex-col items-center gap-1.5 text-muted-foreground hover:text-primary transition-all group">
            <div className="h-11 w-11 rounded-xl glass flex items-center justify-center group-hover:border-primary/30 transition-all">
              <Bookmark className="h-4.5 w-4.5" />
            </div>
            <span className="text-[10px] font-semibold uppercase tracking-wider">Save</span>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="prose prose-lg dark:prose-invert max-w-none 
            prose-headings:font-extrabold prose-headings:tracking-tight
            prose-a:text-primary prose-a:no-underline hover:prose-a:underline
            prose-img:rounded-2xl prose-img:shadow-xl
            prose-blockquote:border-l-primary prose-blockquote:bg-card prose-blockquote:rounded-r-xl prose-blockquote:py-1 prose-blockquote:px-6
            prose-code:text-primary prose-code:bg-card prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:text-sm
          ">
            <BlockRenderer content={post.content} />
          </div>

          <div className="my-12">
            <AdSlot placement="inline_post" />
          </div>



          {/* Tags */}
          {post.post_tags.length > 0 && (
            <div className="mt-12 pt-8 border-t border-border flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider mr-2">Tags</span>
              {post.post_tags.map((pt: any) => (
                <Link 
                  key={pt.tag_id} 
                  href={`/tags/${pt.tag.slug}`} 
                  className="inline-flex items-center rounded-lg glass px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:text-primary hover:border-primary/30 transition-all"
                >
                  #{pt.tag.name}
                </Link>
              ))}
            </div>
          )}

          {/* Comments Section */}
          <div className="mt-16 mb-8">
            <h3 className="text-2xl font-bold mb-8">Comments ({post.comments.length})</h3>
            
            {post.comments.length > 0 ? (
              <div className="space-y-6 mb-12">
                {post.comments.map((comment: any) => (
                  <div key={comment.id} className="p-6 rounded-xl border border-border bg-card">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                          {(comment.guest_name || "A")[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold">{comment.guest_name || "Anonymous"}</p>
                          <p className="text-xs text-muted-foreground">
                            {comment.created_at.toLocaleDateString()} at {comment.created_at.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    </div>
                    <p className="text-foreground/90 whitespace-pre-wrap">{comment.content}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground mb-12">No comments yet. Be the first to share your thoughts!</p>
            )}

            <CommentForm postId={post.id} />
          </div>
        </div>
      </div>
    </article>
  );
}
