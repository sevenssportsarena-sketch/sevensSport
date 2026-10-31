import { Clock, ExternalLink, Flame, Rss } from "lucide-react";
import { getSportFlamesStories } from "@/lib/partnerFeeds";

function formatRelativeTime(dateStr: string): string {
  const parsed = new Date(dateStr);
  if (Number.isNaN(parsed.getTime())) {
    return "Recent";
  }

  const seconds = Math.floor((Date.now() - parsed.getTime()) / 1000);
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

interface PartnerNewsWidgetProps {
  limit?: number;
  variant?: "sidebar" | "grid";
  className?: string;
}

export async function PartnerNewsWidget({
  limit = 6,
  variant = "grid",
  className = "",
}: PartnerNewsWidgetProps) {
  const stories = await getSportFlamesStories(limit);

  if (!stories || stories.length === 0) {
    return null;
  }

  if (variant === "sidebar") {
    return (
      <aside
        aria-label="Partner Wire: Sport Flames"
        className={`glass rounded-2xl border border-border overflow-hidden ${className}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-card/60">
          <div className="flex items-center gap-2.5">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary/15 text-primary">
              <Flame className="h-3.5 w-3.5" />
            </span>
            <h3 className="text-xs font-black uppercase tracking-widest text-foreground">
              Partner Wire <span className="text-primary">•</span> Sport Flames
            </h3>
          </div>
          <a
            href="https://sportflames.com"
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="inline-flex items-center gap-1 text-[11px] font-bold text-primary hover:text-primary/80 transition-colors"
          >
            Visit <ExternalLink className="h-3 w-3" />
          </a>
        </div>

        {/* Headlines List */}
        <div className="divide-y divide-border/60">
          {stories.map((story) => (
            <a
              key={story.link}
              href={story.link}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="group flex items-start gap-3.5 p-4 hover:bg-primary/5 transition-colors"
            >
              {story.imageUrl && (
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-border/50 bg-muted">
                  <img
                    src={story.imageUrl}
                    alt={story.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
              )}
              <div className="flex flex-1 flex-col gap-1.5 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
                    {story.source}
                  </span>
                  <span className="flex items-center gap-1 text-[10px] text-muted-foreground shrink-0">
                    <Clock className="h-2.5 w-2.5" />
                    {formatRelativeTime(story.pubDate)}
                  </span>
                </div>
                <h4 className="text-xs sm:text-sm font-bold leading-snug line-clamp-2 text-foreground group-hover:text-primary transition-colors">
                  {story.title}
                </h4>
              </div>
              <ExternalLink className="h-3.5 w-3.5 shrink-0 text-muted-foreground/50 group-hover:text-primary transition-colors mt-1" />
            </a>
          ))}
        </div>
      </aside>
    );
  }

  return (
    <section
      aria-label="Partner Wire: Sport Flames"
      className={`container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ${className}`}
    >
      <div className="glass rounded-3xl border border-border p-6 sm:p-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="h-8 w-1 rounded-full bg-primary glow-primary" />
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/15 text-primary border border-primary/20">
                <Rss className="h-4 w-4" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl md:text-2xl font-extrabold tracking-tight">
                    Partner Wire <span className="text-primary">•</span> Sport
                    Flames
                  </h2>
                  <span className="hidden sm:inline-flex items-center rounded-full bg-primary/15 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest text-primary border border-primary/25">
                    Syndicated
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Trending sports coverage from our syndication partner
                </p>
              </div>
            </div>
          </div>

          <a
            href="https://sportflames.com"
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="inline-flex items-center gap-1.5 self-start sm:self-auto rounded-xl border border-border bg-card/80 px-4 py-2 text-xs font-bold text-foreground hover:border-primary/50 hover:text-primary transition-all"
          >
            More on Sport Flames
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>

        {/* Headlines Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {stories.map((story) => (
            <a
              key={story.link}
              href={story.link}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="group relative flex gap-4 rounded-2xl border border-border/70 bg-card/50 p-4 hover:border-primary/40 hover:bg-card transition-all card-hover"
            >
              {story.imageUrl && (
                <div className="relative h-20 w-20 sm:h-24 sm:w-24 shrink-0 overflow-hidden rounded-xl bg-muted">
                  <img
                    src={story.imageUrl}
                    alt={story.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
              )}

              <div className="flex flex-1 flex-col justify-between min-w-0">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-primary">
                      <Flame className="h-3 w-3" />
                      {story.source}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {formatRelativeTime(story.pubDate)}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold leading-snug line-clamp-2 text-foreground group-hover:text-primary transition-colors">
                    {story.title}
                  </h3>
                </div>

                <div className="pt-2 flex items-center gap-1 text-[11px] font-semibold text-muted-foreground group-hover:text-primary transition-colors">
                  <span>Read at Sport Flames</span>
                  <ExternalLink className="h-3 w-3" />
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
