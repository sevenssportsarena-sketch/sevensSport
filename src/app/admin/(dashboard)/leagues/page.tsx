import prisma from "@/lib/prisma";
import { Trophy, Plus, Pencil, X } from "lucide-react";
import { createLeague, assignTeamToLeague, updateLeague } from "@/lib/actions/football-admin";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { redirect } from "next/navigation";
import LogoUploadField from "@/components/admin/LogoUploadField";

export const revalidate = 0;

export default async function LeaguesAdminPage({ searchParams }: { searchParams: Promise<{ editLeague?: string }> }) {
  const params = await searchParams;
  const editLeagueId = params.editLeague;

  const leagues = await prisma.league.findMany({
    include: {
      _count: {
        select: { teams: true, fixtures: true }
      }
    }
  });

  const editLeague = editLeagueId ? leagues.find(l => l.id === editLeagueId) : null;

  const teams = await prisma.team.findMany();

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <Trophy className="h-8 w-8 text-primary" />
          Manage Leagues
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/50 border-b text-muted-foreground uppercase text-xs">
                <tr>
                  <th className="px-6 py-4 font-semibold">League Name</th>
                  <th className="px-6 py-4 font-semibold">Season</th>
                  <th className="px-6 py-4 font-semibold">Teams</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {leagues.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">
                      No leagues found. Create one to get started.
                    </td>
                  </tr>
                ) : (
                  leagues.map((league) => (
                    <tr key={league.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4 font-medium">{league.name}</td>
                      <td className="px-6 py-4 text-muted-foreground">{league.season}</td>
                      <td className="px-6 py-4">{league._count.teams}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${league.is_active ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-800'}`}>
                          {league.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link href={`/admin/leagues?editLeague=${league.id}`} className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-muted h-8 w-8 text-muted-foreground">
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-card border rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">{editLeague ? "Edit League" : "Create New League"}</h2>
              {editLeague && (
                <Link href="/admin/leagues" className="text-muted-foreground hover:text-foreground">
                  <X className="h-4 w-4" />
                </Link>
              )}
            </div>
            <form action={async (formData) => {
              "use server";
              const data = {
                name: formData.get("name") as string,
                season: formData.get("season") as string,
                logo_url: formData.get("logo_url") as string,
                is_active: formData.get("is_active") === "on",
              };
              
              if (editLeagueId) {
                await updateLeague(editLeagueId, data);
                redirect("/admin/leagues");
              } else {
                await createLeague(data);
              }
            }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">League Name</label>
                <input required type="text" name="name" defaultValue={editLeague?.name || ""} className="w-full px-3 py-2 border rounded-md bg-background" placeholder="e.g. Premier League" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Season</label>
                <input required type="text" name="season" defaultValue={editLeague?.season || ""} className="w-full px-3 py-2 border rounded-md bg-background" placeholder="e.g. 2023/24" />
              </div>
              <div>
                <LogoUploadField initialUrl={editLeague?.logo_url || ""} />
              </div>
              {editLeague && (
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="is_active" name="is_active" defaultChecked={editLeague.is_active} className="h-4 w-4 rounded border-border text-primary focus:ring-primary" />
                  <label htmlFor="is_active" className="text-sm font-medium">League is active</label>
                </div>
              )}
              <button type="submit" className="w-full bg-primary text-primary-foreground font-semibold py-2 rounded-md hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 mt-4">
                {editLeague ? <Pencil className="h-4 w-4" /> : <Plus className="h-4 w-4" />} 
                {editLeague ? "Update League" : "Create League"}
              </button>
            </form>
          </div>

          <div className="bg-card border rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Add Team to League</h2>
            <form action={async (formData) => {
              "use server";
              const leagueId = formData.get("league_id") as string;
              const teamId = formData.get("team_id") as string;
              if (leagueId && teamId) {
                await assignTeamToLeague(leagueId, teamId);
              }
            }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Select League</label>
                <select required name="league_id" className="w-full px-3 py-2 border rounded-md bg-background">
                  <option value="">Choose a league...</option>
                  {leagues.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Select Team</label>
                <select required name="team_id" className="w-full px-3 py-2 border rounded-md bg-background">
                  <option value="">Choose a team...</option>
                  {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </div>
              <button type="submit" className="w-full bg-secondary text-secondary-foreground font-semibold py-2 rounded-md hover:bg-secondary/80 transition-colors">
                Assign Team
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
