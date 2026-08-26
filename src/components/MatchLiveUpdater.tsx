"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import { getMatchData } from "@/lib/actions/football-public";

export function MatchLiveUpdater({ initialData, fixtureId }: { initialData: any, fixtureId: string }) {
  const [data, setData] = useState(initialData);

  useEffect(() => {
    // If match is not live, we don't necessarily need to poll as aggressively, but for simplicity we will poll if scheduled or live.
    if (data.status === 'finished') return;

    const interval = setInterval(async () => {
      try {
        const updated = await getMatchData(fixtureId);
        if (updated) {
          setData(updated);
        }
      } catch (err) {}
    }, 10000); // Poll every 10 seconds

    return () => clearInterval(interval);
  }, [fixtureId, data.status]);

  const { home_team, away_team, status, home_score, away_score, minute, events } = data;

  return (
    <div className="space-y-8">
      {/* Scoreboard */}
      <div className="glass rounded-3xl p-6 md:p-12 shadow-lg relative overflow-hidden">
        {/* Background Accent */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary via-secondary to-primary opacity-80" />
        
        <div className="flex flex-col items-center mb-8">
          <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black tracking-widest uppercase ${status === 'live' ? 'bg-red-500/10 text-red-500' : 'bg-muted text-muted-foreground'}`}>
            {status === 'live' && <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />}
            {status}
          </span>
        </div>

        <div className="flex items-center justify-between gap-4 md:gap-12 relative z-10">
          
          {/* Home */}
          <div className="flex flex-col items-center gap-4 w-1/3">
            <div className="w-20 h-20 md:w-32 md:h-32 rounded-full bg-background/50 flex items-center justify-center font-bold text-3xl overflow-hidden border-4 border-background shadow-md">
              {home_team.logo_url ? <img src={home_team.logo_url} alt="" className="w-full h-full object-cover" /> : home_team.short_name}
            </div>
            <h2 className="font-black text-xl md:text-3xl text-center leading-tight">{home_team.name}</h2>
          </div>

          {/* Score */}
          <div className="flex flex-col items-center justify-center w-1/3 shrink-0">
            {status === 'scheduled' || status === 'postponed' ? (
               <div className="text-2xl md:text-5xl font-black text-muted-foreground tracking-tighter opacity-50">
                 VS
               </div>
            ) : (
              <div className="flex items-center gap-2 md:gap-4 bg-background/50 px-6 py-4 md:px-8 md:py-6 rounded-2xl border shadow-inner">
                <span className="text-4xl md:text-7xl font-black tabular-nums">{home_score}</span>
                <span className="text-2xl md:text-4xl text-muted-foreground/50">-</span>
                <span className="text-4xl md:text-7xl font-black tabular-nums">{away_score}</span>
              </div>
            )}
            {minute && status === 'live' && (
              <div className="mt-4 text-red-500 font-black text-lg md:text-xl flex items-center gap-1.5 bg-red-500/10 px-3 py-1 rounded-lg">
                <Clock className="h-4 w-4 animate-spin-slow" /> {minute}'
              </div>
            )}
            {status === 'finished' && (
              <div className="mt-4 font-black text-muted-foreground tracking-widest">
                FULL TIME
              </div>
            )}
          </div>

          {/* Away */}
          <div className="flex flex-col items-center gap-4 w-1/3">
            <div className="w-20 h-20 md:w-32 md:h-32 rounded-full bg-background/50 flex items-center justify-center font-bold text-3xl overflow-hidden border-4 border-background shadow-md">
              {away_team.logo_url ? <img src={away_team.logo_url} alt="" className="w-full h-full object-cover" /> : away_team.short_name}
            </div>
            <h2 className="font-black text-xl md:text-3xl text-center leading-tight">{away_team.name}</h2>
          </div>

        </div>
      </div>

      {/* Match Events */}
      <div className="max-w-3xl mx-auto">
        <h3 className="text-xl font-black mb-6 flex items-center gap-2">
          Match Timeline <span className="text-muted-foreground font-normal text-sm">({events.length} events)</span>
        </h3>
        
        <div className="relative">
          {/* Center line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-border -translate-x-1/2"></div>
          
          <div className="space-y-6">
            {events.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground bg-muted/20 rounded-2xl relative z-10 border border-dashed">
                Waiting for match events...
              </div>
            ) : (
              events.map((event: any, idx: number) => {
                const isHome = event.team_id === home_team.id;
                
                return (
                  <div key={event.id} className={`flex items-center w-full relative z-10 ${isHome ? 'justify-end md:flex-row-reverse' : 'justify-start'}`}>
                    
                    {/* Event Content */}
                    <div className={`w-full md:w-[45%] flex items-center gap-4 glass p-4 rounded-xl ${isHome ? 'md:justify-start' : 'justify-start md:justify-end md:text-right'}`}>
                      <div className={`font-black text-sm uppercase tracking-wider ${event.type === 'goal' ? 'text-primary' : event.type === 'red_card' ? 'text-red-500' : 'text-muted-foreground'}`}>
                        {event.type.replace("_", " ")}
                      </div>
                      <div className="flex-1">
                        <div className="font-bold">{event.player}</div>
                        {event.details && <div className="text-xs text-muted-foreground">{event.details}</div>}
                      </div>
                    </div>

                    {/* Timeline Node */}
                    <div className="absolute left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-background border-4 border-muted flex items-center justify-center font-bold text-xs">
                      {event.minute}'
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
