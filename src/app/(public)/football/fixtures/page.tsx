import prisma from "@/lib/prisma";
import Link from "next/link";
import { Calendar, Trophy, ArrowRight } from "lucide-react";

export const revalidate = 60;

export default async function FixturesPage() {
  const fixtures = await prisma.fixture.findMany({
    include: {
      home_team: true,
      away_team: true,
      league: true,
    },
    orderBy: { date: "asc" },
    take: 100,
  });

  // Group fixtures by Date
  const groupedFixtures = fixtures.reduce((groups: any, fixture) => {
    const dateStr = fixture.date.toDateString();
    if (!groups[dateStr]) {
      groups[dateStr] = [];
    }
    groups[dateStr].push(fixture);
    return groups;
  }, {});

  return (
    <div className="container mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border pb-6">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="h-12 w-1.5 rounded-full bg-primary glow-primary" />
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              Fixtures & Results
            </h1>
          </div>
          <p className="text-muted-foreground max-w-2xl">
            Latest match results and upcoming fixtures across all competitions.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex bg-muted/50 p-1 rounded-xl">
          <Link
            href="/football/standings"
            className="px-5 py-2 rounded-lg text-muted-foreground hover:text-foreground text-sm font-semibold flex items-center gap-2 transition-colors"
          >
            <Trophy className="h-4 w-4" /> Standings
          </Link>
          <Link
            href="/football/fixtures"
            className="px-5 py-2 rounded-lg bg-background shadow-sm text-sm font-bold flex items-center gap-2"
          >
            <Calendar className="h-4 w-4 text-primary" /> Fixtures & Results
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto space-y-12">
        {Object.keys(groupedFixtures).length === 0 ? (
          <div className="glass rounded-3xl py-20 text-center">
            <Calendar className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground text-lg">
              No fixtures available.
            </p>
          </div>
        ) : (
          Object.keys(groupedFixtures).map((dateStr) => {
            const dateStrFormatted = new Date(dateStr).toLocaleDateString([], {
              weekday: "long",
              month: "long",
              day: "numeric",
              year: "numeric",
            });
            return (
              <div key={dateStr} className="space-y-4">
                <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground px-4 border-l-2 border-primary">
                  {dateStrFormatted}
                </h3>

                <div className="flex flex-col gap-3">
                  {groupedFixtures[dateStr].map((fixture: any) => (
                    <Link
                      key={fixture.id}
                      href={`/match/${fixture.id}`}
                      className="group glass p-4 md:p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-center gap-2 md:gap-4 md:w-1/4">
                        <span className="text-xs font-semibold text-muted-foreground px-2 py-1 bg-muted rounded">
                          {fixture.league.name}
                        </span>
                        {fixture.status === "live" && (
                          <span className="flex items-center gap-1.5 text-xs font-bold text-red-500 animate-pulse">
                            <span className="w-2 h-2 rounded-full bg-red-500"></span>{" "}
                            LIVE
                          </span>
                        )}
                      </div>

                      <div className="flex-1 flex items-center justify-center gap-4 md:gap-8">
                        {/* Home Team */}
                        <div className="flex items-center gap-3 w-1/3 justify-end text-right">
                          <span className="font-bold md:text-lg hidden sm:block">
                            {fixture.home_team.name}
                          </span>
                          <span className="font-bold sm:hidden">
                            {fixture.home_team.short_name}
                          </span>
                          <div className="w-8 h-8 rounded-full bg-muted flex shrink-0 items-center justify-center text-[10px] overflow-hidden">
                            {fixture.home_team.logo_url ? (
                              <img
                                src={fixture.home_team.logo_url}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              fixture.home_team.short_name
                            )}
                          </div>
                        </div>

                        {/* Score / Time */}
                        <div className="flex flex-col items-center justify-center w-24 shrink-0 bg-background/50 rounded-xl py-2 px-3 border shadow-sm">
                          {fixture.status === "scheduled" ||
                          fixture.status === "postponed" ? (
                            <span className="font-bold text-muted-foreground">
                              {fixture.date.toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          ) : (
                            <div className="text-center">
                              <div className="font-black text-2xl flex items-center gap-2">
                                <span
                                  className={
                                    fixture.home_score > fixture.away_score
                                      ? "text-primary"
                                      : ""
                                  }
                                >
                                  {fixture.home_score}
                                </span>
                                <span className="text-muted-foreground font-normal text-sm">
                                  -
                                </span>
                                <span
                                  className={
                                    fixture.away_score > fixture.home_score
                                      ? "text-primary"
                                      : ""
                                  }
                                >
                                  {fixture.away_score}
                                </span>
                              </div>
                            </div>
                          )}
                          {fixture.minute && fixture.status === "live" && (
                            <span className="text-[10px] font-bold text-red-500 mt-1">
                              {fixture.minute}'
                            </span>
                          )}
                          {fixture.status === "finished" && (
                            <span className="text-[10px] font-bold text-muted-foreground mt-1 uppercase">
                              FT
                            </span>
                          )}
                        </div>

                        {/* Away Team */}
                        <div className="flex items-center gap-3 w-1/3 text-left">
                          <div className="w-8 h-8 rounded-full bg-muted flex shrink-0 items-center justify-center text-[10px] overflow-hidden">
                            {fixture.away_team.logo_url ? (
                              <img
                                src={fixture.away_team.logo_url}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              fixture.away_team.short_name
                            )}
                          </div>
                          <span className="font-bold md:text-lg hidden sm:block">
                            {fixture.away_team.name}
                          </span>
                          <span className="font-bold sm:hidden">
                            {fixture.away_team.short_name}
                          </span>
                        </div>
                      </div>

                      <div className="hidden md:flex justify-end w-1/4">
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-primary group-hover:translate-x-1 transition-transform">
                          Match Center <ArrowRight className="h-3 w-3" />
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
