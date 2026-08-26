"use client";

import { useEffect, useState } from "react";
import { getMatchCommentary } from "@/lib/actions/football-public";
import { Star, Radio } from "lucide-react";

type Commentary = {
  id: string;
  minute: string | null;
  text: string;
  is_key: boolean;
  created_at: Date;
};

export function MatchCommentaryFeed({
  initialCommentary,
  fixtureId,
  isLive,
}: {
  initialCommentary: Commentary[];
  fixtureId: string;
  isLive: boolean;
}) {
  const [commentary, setCommentary] = useState(initialCommentary);

  useEffect(() => {
    if (!isLive) return;
    const interval = setInterval(async () => {
      try {
        const updated = await getMatchCommentary(fixtureId);
        if (updated) setCommentary(updated as Commentary[]);
      } catch {}
    }, 8000); // poll every 8s when live
    return () => clearInterval(interval);
  }, [fixtureId, isLive]);

  if (commentary.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground text-sm bg-muted/20 rounded-2xl border border-dashed">
        <Radio className="h-8 w-8 mx-auto mb-3 opacity-30" />
        {isLive ? "Waiting for commentary..." : "No commentary available for this match."}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {commentary.map((c, i) => (
        <div
          key={c.id}
          className={`relative flex gap-4 items-start p-4 rounded-xl border transition-all ${
            c.is_key
              ? "bg-primary/10 border-primary/30 shadow-sm"
              : "bg-muted/20 border-border/50"
          } ${i === 0 && isLive ? "ring-1 ring-primary/40 shadow-md" : ""}`}
          style={{ animationDelay: `${i * 30}ms` }}
        >
          {/* Minute badge */}
          <div className="shrink-0 flex flex-col items-center gap-1">
            {c.minute ? (
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-background border font-black text-xs">
                {c.minute}&apos;
              </span>
            ) : (
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-background border text-muted-foreground">
                <Radio className="h-3.5 w-3.5" />
              </span>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {c.is_key && (
              <div className="flex items-center gap-1.5 text-primary text-xs font-bold uppercase tracking-widest mb-1">
                <Star className="h-3 w-3" /> Key Moment
              </div>
            )}
            <p className={`leading-relaxed text-sm ${c.is_key ? "font-semibold text-base" : ""}`}>
              {c.text}
            </p>
            <p className="text-xs text-muted-foreground mt-1.5">
              {new Date(c.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </p>
          </div>

          {/* NEW badge for latest entry when live */}
          {i === 0 && isLive && (
            <span className="absolute top-2 right-2 text-[10px] font-black uppercase tracking-widest px-1.5 py-0.5 bg-red-500 text-white rounded-full animate-pulse">
              LIVE
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
