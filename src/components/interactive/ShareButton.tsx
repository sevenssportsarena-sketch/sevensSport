"use client";

import { Share2 } from "lucide-react";

interface ShareButtonProps {
  title: string;
  mobile?: boolean;
}

export function ShareButton({ title, mobile = false }: ShareButtonProps) {
  const handleShare = async () => {
    const url = window.location.href;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          url: url,
        });
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          fallbackCopy(url);
        }
      }
    } else {
      fallbackCopy(url);
    }
  };

  const fallbackCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    alert("Link copied to clipboard!");
  };

  if (mobile) {
    return (
      <button 
        onClick={handleShare}
        className="flex flex-col items-center gap-0.5 transition-colors group text-muted-foreground"
      >
        <div className="relative h-9 w-9 rounded-full border border-border bg-card/60 flex items-center justify-center group-hover:border-primary/30 group-hover:bg-primary/5 transition-all">
          <Share2 className="h-4 w-4" />
        </div>
        <span className="text-[8px] font-semibold uppercase tracking-wide">Share</span>
      </button>
    );
  }

  return (
    <button 
      onClick={handleShare}
      className="flex flex-col items-center gap-1.5 text-muted-foreground hover:text-primary transition-all group"
    >
      <div className="h-11 w-11 rounded-xl glass flex items-center justify-center group-hover:border-primary/30 transition-all">
        <Share2 className="h-4.5 w-4.5" />
      </div>
      <span className="text-[10px] font-semibold uppercase tracking-wider">Share</span>
    </button>
  );
}
