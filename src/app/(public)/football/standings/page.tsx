import prisma from "@/lib/prisma";
import Link from "next/link";
import { Trophy, Calendar } from "lucide-react";

export const revalidate = 60;

export default async function StandingsPage({ searchParams }: { searchParams: Promise<{ league?: string }> }) {
  const { league: leagueParam } = await searchParams;

  const leagues = await prisma.league.findMany({
    where: { is_active: true }
  });

  const selectedLeagueId = leagueParam || (leagues.length > 0 ? leagues[0].id : undefined);

  let standings = [];
  let selectedLeague = null;

  if (selectedLeagueId) {
    selectedLeague = leagues.find(l => l.id === selectedLeagueId) || leagues[0];
    standings = await prisma.standing.findMany({
      where: { league_id: selectedLeague.id },
      include: { team: true },
      orderBy: [
        { points: 'desc' },
        { goal_difference: 'desc' },
        { goals_for: 'desc' }
      ]
    });
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border pb-6">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="h-12 w-1.5 rounded-full bg-primary glow-primary" />
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">League Tables</h1>
          </div>
          <p className="text-muted-foreground max-w-2xl">
            Current standings, points, and goal differences for active football leagues.
          </p>
        </div>
        
        {/* Navigation Tabs */}
        <div className="flex bg-muted/50 p-1 rounded-xl">
          <Link href="/football/standings" className="px-5 py-2 rounded-lg bg-background shadow-sm text-sm font-bold flex items-center gap-2">
            <Trophy className="h-4 w-4 text-primary" /> Standings
          </Link>
          <Link href="/football/fixtures" className="px-5 py-2 rounded-lg text-muted-foreground hover:text-foreground text-sm font-semibold flex items-center gap-2 transition-colors">
            <Calendar className="h-4 w-4" /> Fixtures & Results
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* League Selector */}
        <div className="lg:col-span-1 space-y-2">
          <h3 className="font-bold uppercase tracking-wider text-xs text-muted-foreground mb-4">Select League</h3>
          <div className="flex flex-col gap-2">
            {leagues.map(league => (
              <Link 
                key={league.id} 
                href={`/football/standings?league=${league.id}`}
                className={`px-4 py-3 rounded-xl border transition-all flex items-center justify-between ${selectedLeague?.id === league.id ? 'bg-primary/10 border-primary/30 font-bold text-primary' : 'bg-card hover:bg-accent border-border font-medium'}`}
              >
                {league.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="lg:col-span-3">
          {selectedLeague ? (
            <div className="glass rounded-2xl overflow-hidden shadow-sm">
              <div className="bg-muted/30 px-6 py-4 border-b flex items-center justify-between">
                <h2 className="text-xl font-bold">{selectedLeague.name} Table</h2>
                <span className="text-xs font-bold bg-primary/20 text-primary px-3 py-1 rounded-full">{selectedLeague.season}</span>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-muted/10 text-muted-foreground border-b uppercase text-[11px] font-bold tracking-wider">
                    <tr>
                      <th className="px-4 py-4 w-12 text-center">Pos</th>
                      <th className="px-4 py-4">Club</th>
                      <th className="px-4 py-4 text-center w-12" title="Matches Played">MP</th>
                      <th className="px-4 py-4 text-center w-12" title="Won">W</th>
                      <th className="px-4 py-4 text-center w-12" title="Drawn">D</th>
                      <th className="px-4 py-4 text-center w-12" title="Lost">L</th>
                      <th className="px-4 py-4 text-center w-12" title="Goals For">GF</th>
                      <th className="px-4 py-4 text-center w-12" title="Goals Against">GA</th>
                      <th className="px-4 py-4 text-center w-12" title="Goal Difference">GD</th>
                      <th className="px-4 py-4 text-center w-16 text-primary" title="Points">Pts</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {standings.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="px-6 py-12 text-center text-muted-foreground">
                          No teams assigned to this league yet.
                        </td>
                      </tr>
                    ) : (
                      standings.map((row, index) => {
                        // Positional colour: top 4 = Champions zone, bottom 3 = Relegation zone
                        const total = standings.length;
                        const isChampions = index < 1;
                        const isEurope = index >= 1 && index < Math.min(4, total - 3);
                        const isRelegation = index >= total - 3 && total > 5;
                        return (
                          <tr key={row.id} className="hover:bg-accent/50 transition-colors group">
                            <td className="py-3 text-center w-12 relative">
                              {/* Position indicator bar */}
                              <span className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full ${isChampions ? 'bg-primary' : isEurope ? 'bg-blue-500' : isRelegation ? 'bg-red-500' : 'bg-transparent'}`} />
                              <span className="font-bold text-muted-foreground group-hover:text-foreground pl-4">{index + 1}</span>
                            </td>
                            <td className="px-4 py-3 font-semibold">
                              <div className="flex items-center gap-3">
                                <div className="w-6 h-6 shrink-0 rounded-full bg-muted flex items-center justify-center overflow-hidden text-[8px]">
                                  {row.team.logo_url ? <img src={row.team.logo_url} alt={row.team.short_name} className="w-full h-full object-cover" /> : row.team.short_name}
                                </div>
                                <span className="truncate">{row.team.name}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-center text-muted-foreground">{row.played}</td>
                            <td className="px-4 py-3 text-center text-muted-foreground">{row.won}</td>
                            <td className="px-4 py-3 text-center text-muted-foreground">{row.drawn}</td>
                            <td className="px-4 py-3 text-center text-muted-foreground">{row.lost}</td>
                            <td className="px-4 py-3 text-center text-muted-foreground">{row.goals_for}</td>
                            <td className="px-4 py-3 text-center text-muted-foreground">{row.goals_against}</td>
                            <td className="px-4 py-3 text-center text-muted-foreground font-medium">{row.goal_difference > 0 ? `+${row.goal_difference}` : row.goal_difference}</td>
                            <td className="px-4 py-3 text-center font-black text-base text-primary">{row.points}</td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="glass rounded-3xl py-20 text-center">
              <Trophy className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground text-lg">No leagues available.</p>
            </div>
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-6 text-xs text-muted-foreground border-t border-border pt-6">
        <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-primary inline-block" /> Champions / Title</span>
        <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-blue-500 inline-block" /> European Places</span>
        <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-red-500 inline-block" /> Relegation Zone</span>
        <span className="ml-auto">MP = Played · W = Won · D = Drawn · L = Lost · GF = Goals For · GA = Goals Against · GD = Goal Difference · Pts = Points</span>
      </div>
    </div>
  );
}
