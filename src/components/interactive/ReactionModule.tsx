"use client";

import { useState, useEffect, useTransition } from "react";
import { Heart, Flame, Target, Zap } from "lucide-react";
import { toggleReaction, type ReactionType } from "@/app/actions/reactions";

interface ReactionState {
  like: number;
  fire: number;
  goal: number;
  shock: number;
}

interface ReactionModuleProps {
  postId: string;
  initialCounts: ReactionState;
  /** When true, renders the compact fixed-left mobile strip */
  mobile?: boolean;
}

export function ReactionModule({ postId, initialCounts, mobile = false }: ReactionModuleProps) {
  const [isPending, startTransition] = useTransition();
  const [counts, setCounts] = useState<ReactionState>(initialCounts);
  const [userReacted, setUserReacted] = useState<ReactionType[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(`reactions_${postId}`);
    if (saved) {
      setUserReacted(JSON.parse(saved));
    }
  }, [postId]);

  const handleReaction = (type: ReactionType) => {
    const hasReacted = userReacted.includes(type);
    setCounts((prev) => ({
      ...prev,
      [type]: hasReacted ? prev[type] - 1 : prev[type] + 1,
    }));
    const newReacted = hasReacted
      ? userReacted.filter((r) => r !== type)
      : [...userReacted, type];
    setUserReacted(newReacted);
    localStorage.setItem(`reactions_${postId}`, JSON.stringify(newReacted));
    startTransition(() => {
      toggleReaction(postId, type);
    });
  };

  const reactions: { type: ReactionType; label: string; icon: React.ReactNode; activeColor: string; activeBorder: string; activeBg: string }[] = [
    {
      type: "like",
      label: "Like",
      icon: <Heart className={`h-4 w-4 ${userReacted.includes("like") ? "fill-primary" : ""}`} />,
      activeColor: "text-primary",
      activeBorder: "border-primary",
      activeBg: "bg-primary/10",
    },
    {
      type: "fire",
      label: "Fire",
      icon: <Flame className={`h-4 w-4 ${userReacted.includes("fire") ? "fill-orange-500" : ""}`} />,
      activeColor: "text-orange-500",
      activeBorder: "border-orange-500",
      activeBg: "bg-orange-500/10",
    },
    {
      type: "goal",
      label: "Goal",
      icon: <Target className="h-4 w-4" />,
      activeColor: "text-green-500",
      activeBorder: "border-green-500",
      activeBg: "bg-green-500/10",
    },
    {
      type: "shock",
      label: "Shock",
      icon: <Zap className={`h-4 w-4 ${userReacted.includes("shock") ? "fill-yellow-500" : ""}`} />,
      activeColor: "text-yellow-500",
      activeBorder: "border-yellow-500",
      activeBg: "bg-yellow-500/10",
    },
  ];

  // ── Mobile fixed-left strip items ─────────────────────────────────────────
  if (mobile) {
    return (
      <>
        {reactions.map((r) => {
          const active = userReacted.includes(r.type);
          return (
            <button
              key={r.type}
              onClick={() => handleReaction(r.type)}
              className={`flex flex-col items-center gap-0.5 transition-colors group ${active ? r.activeColor : "text-muted-foreground"}`}
            >
              <div
                className={`relative h-9 w-9 rounded-full border flex items-center justify-center transition-all ${
                  active
                    ? `${r.activeBorder} ${r.activeBg}`
                    : `border-border bg-card/60 group-hover:${r.activeBorder} group-hover:${r.activeBg}`
                }`}
              >
                {r.icon}
                {counts[r.type] > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-background text-foreground text-[9px] font-bold px-1 py-0.5 rounded-full border border-border leading-none">
                    {counts[r.type]}
                  </span>
                )}
              </div>
              <span className="text-[8px] font-semibold uppercase tracking-wide">{r.label}</span>
            </button>
          );
        })}
      </>
    );
  }

  // ── Desktop sidebar (original vertical layout) ────────────────────────────
  return (
    <div className="flex flex-col gap-6 sticky top-24 h-fit">
      {reactions.map((r) => {
        const active = userReacted.includes(r.type);
        return (
          <button
            key={r.type}
            onClick={() => handleReaction(r.type)}
            className={`flex flex-col items-center gap-1 transition-colors group ${active ? r.activeColor : "text-muted-foreground hover:${r.activeColor}"}`}
          >
            <div
              className={`h-12 w-12 rounded-full border flex items-center justify-center transition-all relative ${
                active
                  ? `${r.activeBorder} ${r.activeBg}`
                  : `border-border bg-card group-hover:${r.activeBorder} group-hover:${r.activeBg}`
              }`}
            >
              {r.icon}
              <span className="absolute -top-2 -right-2 bg-background text-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-border">
                {counts[r.type]}
              </span>
            </div>
            <span className="text-xs font-semibold">{r.label}</span>
          </button>
        );
      })}
    </div>
  );
}
