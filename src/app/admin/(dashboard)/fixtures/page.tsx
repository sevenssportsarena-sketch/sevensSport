import prisma from "@/lib/prisma";
import { Calendar, Plus, ExternalLink, Pencil, X } from "lucide-react";
import { createFixture, updateFixture } from "@/lib/actions/football-admin";
import Link from "next/link";
import { redirect } from "next/navigation";

export const revalidate = 0;

export default async function FixturesAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ editFixture?: string }>;
}) {
  const params = await searchParams;
  const editFixtureId = params.editFixture;

  const leagues = await prisma.league.findMany({
    where: { is_active: true },
  });

  const teams = await prisma.team.findMany({
    orderBy: { name: "asc" },
  });

  const fixtures = await prisma.fixture.findMany({
    include: {
      home_team: true,
      away_team: true,
      league: true,
    },
    orderBy: { date: "desc" },
    take: 50,
  });

  const editFixture = editFixtureId
    ? fixtures.find((f) => f.id === editFixtureId)
    : null;

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <Calendar className="h-8 w-8 text-primary" />
          Manage Fixtures
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card border rounded-xl overflow-x-auto shadow-sm">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/50 border-b text-muted-foreground uppercase text-xs">
                <tr>
                  <th className="px-6 py-4 font-semibold">Match</th>
                  <th className="px-6 py-4 font-semibold">League</th>
                  <th className="px-6 py-4 font-semibold">Date/Time</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {fixtures.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-8 text-center text-muted-foreground"
                    >
                      No fixtures found. Schedule a match to get started.
                    </td>
                  </tr>
                ) : (
                  fixtures.map((fixture) => (
                    <tr
                      key={fixture.id}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      <td className="px-6 py-4 font-medium">
                        <div className="flex items-center gap-2">
                          <span className="truncate w-24 text-right">
                            {fixture.home_team.short_name}
                          </span>
                          <div className="bg-muted px-2 py-1 rounded text-xs font-bold whitespace-nowrap">
                            {fixture.status === "scheduled" ||
                            fixture.status === "postponed"
                              ? "VS"
                              : `${fixture.home_score} - ${fixture.away_score}`}
                          </div>
                          <span className="truncate w-24">
                            {fixture.away_team.short_name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground text-xs">
                        {fixture.league.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {new Date(fixture.date).toLocaleString([], {
                          dateStyle: "short",
                          timeStyle: "short",
                        })}
                      </td>
                      <td className="px-6 py-4 capitalize text-xs">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full font-medium ${
                            fixture.status === "live"
                              ? "bg-red-100 text-red-800 animate-pulse"
                              : fixture.status === "finished"
                                ? "bg-gray-100 text-gray-800"
                                : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {fixture.status}
                          {fixture.status === "live" &&
                            fixture.minute &&
                            ` (${fixture.minute}')`}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-3">
                          <Link
                            href={`/admin/fixtures/${fixture.id}/live`}
                            className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors shadow-sm"
                          >
                            <ExternalLink className="h-3.5 w-3.5" /> Live Dashboard
                          </Link>
                          <Link
                            href={`/admin/fixtures?editFixture=${fixture.id}`}
                            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-muted h-8 w-8 text-muted-foreground border shadow-sm"
                            title="Edit Fixture"
                          >
                            <Pencil className="h-4 w-4" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-card border rounded-xl p-6 shadow-sm sticky top-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">
                {editFixture ? "Edit Fixture" : "Schedule Match"}
              </h2>
              {editFixture && (
                <Link
                  href="/admin/fixtures"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </Link>
              )}
            </div>
            <form
              key={editFixtureId || "new"}
              action={async (formData) => {
                "use server";
                const data = {
                  league_id: formData.get("league_id") as string,
                  home_team_id: formData.get("home_team_id") as string,
                  away_team_id: formData.get("away_team_id") as string,
                  date: new Date(formData.get("date") as string),
                };

                if (editFixtureId) {
                  await updateFixture(editFixtureId, data);
                  redirect("/admin/fixtures");
                } else {
                  await createFixture(data);
                }
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium mb-1">League</label>
                <select
                  required
                  name="league_id"
                  defaultValue={editFixture?.league_id || ""}
                  className="w-full px-3 py-2 border rounded-md bg-background"
                >
                  <option value="">Select league...</option>
                  {leagues.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Home Team
                </label>
                <select
                  required
                  name="home_team_id"
                  defaultValue={editFixture?.home_team_id || ""}
                  className="w-full px-3 py-2 border rounded-md bg-background"
                >
                  <option value="">Select home team...</option>
                  {teams.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Away Team
                </label>
                <select
                  required
                  name="away_team_id"
                  defaultValue={editFixture?.away_team_id || ""}
                  className="w-full px-3 py-2 border rounded-md bg-background"
                >
                  <option value="">Select away team...</option>
                  {teams.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Date & Time
                </label>
                <input
                  required
                  type="datetime-local"
                  name="date"
                  defaultValue={
                    editFixture
                      ? new Date(editFixture.date).toISOString().slice(0, 16)
                      : ""
                  }
                  className="w-full px-3 py-2 border rounded-md bg-background"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-primary text-primary-foreground font-semibold py-2 rounded-md hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 mt-4"
              >
                {editFixture ? (
                  <Pencil className="h-4 w-4" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
                {editFixture ? "Update Fixture" : "Create Fixture"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
