import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Radio, Plus, CheckCircle, Trash2, Star } from "lucide-react";
import { updateMatchStatus, updateMatchScore, addMatchEvent, addCommentary, deleteCommentary } from "@/lib/actions/football-admin";
import Link from "next/link";

export const revalidate = 0;

export default async function LiveMatchDashboard({ params }: { params: Promise<{ id: string }> }) {
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
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <Link href="/admin/fixtures" className="hover:underline">Fixtures</Link>
            <span>/</span>
            <span>{fixture.league.name}</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Radio className={`h-8 w-8 ${fixture.status === 'live' ? 'text-red-500 animate-pulse' : 'text-primary'}`} />
            Live Match Dashboard
          </h1>
        </div>
        <div className="flex gap-2">
          <form action={async () => { "use server"; await updateMatchStatus(fixture.id, "live"); }}>
            <button disabled={fixture.status === 'live'} className="px-4 py-2 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 disabled:opacity-50">
              Go Live
            </button>
          </form>
          <form action={async () => { "use server"; await updateMatchStatus(fixture.id, "finished"); }}>
            <button disabled={fixture.status === 'finished'} className="px-4 py-2 bg-gray-800 text-white font-bold rounded-lg hover:bg-gray-900 disabled:opacity-50 flex items-center gap-2">
              <CheckCircle className="h-4 w-4" /> Finish Match
            </button>
          </form>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Scoreboard Control */}
          <div className="bg-card border rounded-2xl overflow-hidden shadow-sm p-8 text-center">
            <div className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-6">
              Status: <span className={fixture.status === 'live' ? 'text-red-500' : ''}>{fixture.status}</span>
              {fixture.minute && ` • ${fixture.minute}'`}
            </div>
            
            <form action={async (formData) => {
              "use server";
              await updateMatchScore(
                fixture.id, 
                parseInt(formData.get("home_score") as string), 
                parseInt(formData.get("away_score") as string),
                formData.get("minute") as string
              );
            }} className="flex items-center justify-center gap-8 md:gap-12">
              
              {/* Home Team */}
              <div className="flex flex-col items-center gap-4 w-1/3">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center font-bold text-2xl overflow-hidden border-4 border-background shadow-sm">
                  {fixture.home_team.logo_url ? <img src={fixture.home_team.logo_url} alt="Logo" className="w-full h-full object-cover" /> : fixture.home_team.short_name}
                </div>
                <span className="font-bold text-lg leading-tight">{fixture.home_team.name}</span>
                <input type="number" name="home_score" defaultValue={fixture.home_score} className="w-20 text-center text-4xl font-black bg-muted/50 border rounded-xl py-2" />
              </div>

              {/* Match Info */}
              <div className="flex flex-col items-center justify-center gap-4 w-1/3">
                <span className="text-2xl font-black text-muted-foreground">VS</span>
                <input type="text" name="minute" defaultValue={fixture.minute || ""} placeholder="Min (e.g. 45')" className="w-24 text-center text-sm bg-muted/50 border rounded-lg py-1.5" />
                <button type="submit" className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-bold text-sm w-full">
                  Update Score
                </button>
              </div>

              {/* Away Team */}
              <div className="flex flex-col items-center gap-4 w-1/3">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center font-bold text-2xl overflow-hidden border-4 border-background shadow-sm">
                  {fixture.away_team.logo_url ? <img src={fixture.away_team.logo_url} alt="Logo" className="w-full h-full object-cover" /> : fixture.away_team.short_name}
                </div>
                <span className="font-bold text-lg leading-tight">{fixture.away_team.name}</span>
                <input type="number" name="away_score" defaultValue={fixture.away_score} className="w-20 text-center text-4xl font-black bg-muted/50 border rounded-xl py-2" />
              </div>

            </form>
          </div>

          {/* Event Timeline (Admin View) */}
          <div className="bg-card border rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4 border-b pb-2">Match Events</h2>
            {fixture.events.length === 0 ? (
              <p className="text-muted-foreground text-sm py-4 text-center">No events added yet.</p>
            ) : (
              <div className="space-y-3">
                {fixture.events.map(event => {
                  const isHome = event.team_id === fixture.home_team_id;
                  return (
                    <div key={event.id} className="flex items-center gap-4 text-sm bg-muted/30 p-3 rounded-lg border">
                      <div className="font-bold w-12 text-center text-muted-foreground">{event.minute}'</div>
                      <div className="capitalize font-semibold w-24">
                        {event.type.replace("_", " ")}
                      </div>
                      <div className="flex-1">
                        <span className="font-bold">{event.player}</span>
                        {event.details && <span className="text-muted-foreground ml-2">({event.details})</span>}
                      </div>
                      <div className="text-xs font-bold px-2 py-1 bg-background rounded border">
                        {isHome ? fixture.home_team.short_name : fixture.away_team.short_name}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Commentary Feed (Admin) */}
          <div className="bg-card border rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4 border-b pb-2 flex items-center gap-2">
              <Radio className="h-4 w-4 text-red-500" /> Live Commentary
              <span className="ml-auto text-sm font-normal text-muted-foreground">{fixture.commentary.length} updates</span>
            </h2>
            {fixture.commentary.length === 0 ? (
              <p className="text-muted-foreground text-sm py-4 text-center">No commentary yet. Start posting updates.</p>
            ) : (
              <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                {fixture.commentary.map(c => (
                  <div key={c.id} className={`flex items-start gap-3 text-sm p-3 rounded-lg border ${c.is_key ? 'bg-primary/10 border-primary/30' : 'bg-muted/30'}`}>
                    {c.is_key && <Star className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />}
                    {c.minute && <span className="font-bold text-muted-foreground shrink-0 w-8">{c.minute}'</span>}
                    <span className={`flex-1 leading-relaxed ${c.is_key ? 'font-semibold' : ''}`}>{c.text}</span>
                    <form action={async () => { "use server"; await deleteCommentary(c.id, fixture.id); }}>
                      <button type="submit" className="text-muted-foreground hover:text-destructive transition-colors p-1 rounded">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </form>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar: Add Event + Commentary */}
        <div className="space-y-6">
          {/* Add Commentary */}
          <div className="bg-card border-2 border-primary/30 rounded-xl p-6 shadow-sm sticky top-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Radio className="h-4 w-4 text-red-500 animate-pulse" /> Post Commentary
            </h2>
            <form action={async (formData) => {
              "use server";
              const text = (formData.get("text") as string).trim();
              if (!text) return;
              await addCommentary({
                fixture_id: fixture.id,
                text,
                minute: formData.get("minute") as string || undefined,
                is_key: formData.get("is_key") === "on",
              });
            }} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1">Minute (opt.)</label>
                  <input type="text" name="minute" className="w-full px-2 py-1.5 border rounded-md bg-background text-sm" placeholder="e.g. 23" />
                </div>
                <div className="flex items-end pb-1">
                  <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                    <input type="checkbox" name="is_key" className="h-4 w-4 rounded border-border text-primary" />
                    <Star className="h-3.5 w-3.5 text-primary" /> Key Moment
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Update Text *</label>
                <textarea required name="text" rows={3} className="w-full px-3 py-2 border rounded-md bg-background text-sm resize-none" placeholder="e.g. GOAL! Saka drives it into the top corner from 25 yards..." />
              </div>
              <button type="submit" className="w-full bg-red-500 text-white font-bold py-2 rounded-md hover:bg-red-600 transition-colors flex items-center justify-center gap-2">
                <Plus className="h-4 w-4" /> Post Update
              </button>
            </form>
          </div>

          {/* Add Event */}
          <div className="bg-card border rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Add Match Event</h2>
            <form action={async (formData) => {
              "use server";
              await addMatchEvent({
                fixture_id: fixture.id,
                minute: formData.get("minute") as string,
                type: formData.get("type") as any,
                team_id: formData.get("team_id") as string,
                player: formData.get("player") as string,
                details: formData.get("details") as string,
              });
            }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Minute</label>
                <input required type="text" name="minute" className="w-full px-3 py-2 border rounded-md bg-background" placeholder="e.g. 12 or 90+2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Event Type</label>
                <select required name="type" className="w-full px-3 py-2 border rounded-md bg-background">
                  <option value="goal">Goal</option>
                  <option value="yellow_card">Yellow Card</option>
                  <option value="red_card">Red Card</option>
                  <option value="substitution">Substitution</option>
                  <option value="penalty">Penalty Goal</option>
                  <option value="own_goal">Own Goal</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Team</label>
                <select required name="team_id" className="w-full px-3 py-2 border rounded-md bg-background">
                  <option value={fixture.home_team_id}>{fixture.home_team.name}</option>
                  <option value={fixture.away_team_id}>{fixture.away_team.name}</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Player Name</label>
                <input required type="text" name="player" className="w-full px-3 py-2 border rounded-md bg-background" placeholder="e.g. Bukayo Saka" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Details (Optional)</label>
                <input type="text" name="details" className="w-full px-3 py-2 border rounded-md bg-background" placeholder="e.g. Assist by Odegaard" />
              </div>
              <button type="submit" className="w-full bg-secondary text-secondary-foreground font-semibold py-2 rounded-md hover:bg-secondary/80 transition-colors flex items-center justify-center gap-2 mt-4">
                <Plus className="h-4 w-4" /> Submit Event
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
