import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { MatchLiveUpdater } from "@/components/MatchLiveUpdater";
import { MatchCommentaryFeed } from "@/components/MatchCommentaryFeed";
import Link from "next/link";
import { ArrowLeft, Radio } from "lucide-react";

export const revalidate = 60;

export default async function MatchCenterPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const fixture = await prisma.fixture.findUnique({
    where: { id },
    include: {
      home_team: true,
      away_team: true,
      league: true,
      events: { orderBy: { minute: 'desc' } },
      commentary: { orderBy: { created_at: 'desc' } }
    }
  });

  if (!fixture) {
    notFound();
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      <Link href="/football/fixtures" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors group">
        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
        Back to Fixtures
      </Link>
      
      <div className="text-center mb-8">
        <h1 className="text-3xl font-black">{fixture.league.name}</h1>
        <p className="text-muted-foreground">{new Date(fixture.date).toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}</p>
      </div>

      <MatchLiveUpdater initialData={fixture} fixtureId={fixture.id} />

      {/* Live Commentary */}
      <div className="max-w-3xl mx-auto">
        <h2 className="text-xl font-black mb-6 flex items-center gap-2">
          <Radio className={`h-5 w-5 ${fixture.status === 'live' ? 'text-red-500 animate-pulse' : 'text-muted-foreground'}`} />
          Match Commentary
          {fixture.status === 'live' && (
            <span className="ml-2 text-xs font-bold uppercase tracking-widest px-2 py-0.5 bg-red-500/10 text-red-500 rounded-full border border-red-500/20 animate-pulse">
              Live Updates
            </span>
          )}
        </h2>
        <MatchCommentaryFeed
          initialCommentary={fixture.commentary}
          fixtureId={fixture.id}
          isLive={fixture.status === 'live'}
        />
      </div>
    </div>
  );
}
