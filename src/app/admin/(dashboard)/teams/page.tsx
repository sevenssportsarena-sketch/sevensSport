import prisma from "@/lib/prisma";
import { Users, Plus, Pencil, X } from "lucide-react";
import { createTeam, updateTeam } from "@/lib/actions/football-admin";
import LogoUploadField from "@/components/admin/LogoUploadField";
import Link from "next/link";
import { redirect } from "next/navigation";

export const revalidate = 0;

export default async function TeamsAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ editTeam?: string }>;
}) {
  const params = await searchParams;
  const editTeamId = params.editTeam;

  const teams = await prisma.team.findMany();
  const editTeam = editTeamId ? teams.find((t) => t.id === editTeamId) : null;

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <Users className="h-8 w-8 text-primary" />
          Manage Teams
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/50 border-b text-muted-foreground uppercase text-xs">
                <tr>
                  <th className="px-6 py-4 font-semibold">Team</th>
                  <th className="px-6 py-4 font-semibold">Short</th>
                  <th className="px-6 py-4 font-semibold">Manager</th>
                  <th className="px-6 py-4 font-semibold">Stadium</th>
                  <th className="px-6 py-4 font-semibold text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {teams.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-8 text-center text-muted-foreground"
                    >
                      No teams found. Create one to get started.
                    </td>
                  </tr>
                ) : (
                  teams.map((team) => (
                    <tr
                      key={team.id}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      <td className="px-6 py-4 font-medium flex items-center gap-3">
                        {team.logo_url ? (
                          <img
                            src={team.logo_url}
                            alt={team.name}
                            className="w-8 h-8 rounded-full object-cover bg-muted"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">
                            {team.short_name}
                          </div>
                        )}
                        {team.name}
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {team.short_name}
                      </td>
                      <td className="px-6 py-4">{team.manager || "-"}</td>
                      <td className="px-6 py-4">{team.stadium || "-"}</td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/admin/teams?editTeam=${team.id}`}
                          className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-muted h-8 w-8 text-muted-foreground"
                        >
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
            <div className="bg-card border rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">
                  {editTeam ? "Edit Team" : "Create New Team"}
                </h2>
                {editTeam && (
                  <Link
                    href="/admin/teams"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </Link>
                )}
              </div>
              <form
                action={async (formData) => {
                  "use server";
                  const data = {
                    name: formData.get("name") as string,
                    short_name: formData.get("short_name") as string,
                    manager: formData.get("manager") as string,
                    stadium: formData.get("stadium") as string,
                    year_founded: formData.get("year_founded") as string,
                    logo_url: formData.get("logo_url") as string,
                  };
                  if (editTeamId) {
                    await updateTeam(editTeamId, data);
                    redirect("/admin/teams");
                  } else {
                    await createTeam(data);
                  }
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Team Name *
                  </label>
                  <input
                    required
                    type="text"
                    name="name"
                    defaultValue={editTeam?.name || ""}
                    className="w-full px-3 py-2 border rounded-md bg-background"
                    placeholder="e.g. Arsenal FC"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Short Name *
                    </label>
                    <input
                      required
                      type="text"
                      name="short_name"
                      defaultValue={editTeam?.short_name || ""}
                      className="w-full px-3 py-2 border rounded-md bg-background"
                      placeholder="e.g. ARS"
                      maxLength={4}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Founded
                    </label>
                    <input
                      type="text"
                      name="year_founded"
                      defaultValue={editTeam?.year_founded || ""}
                      className="w-full px-3 py-2 border rounded-md bg-background"
                      placeholder="e.g. 1886"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Manager
                  </label>
                  <input
                    type="text"
                    name="manager"
                    defaultValue={editTeam?.manager || ""}
                    className="w-full px-3 py-2 border rounded-md bg-background"
                    placeholder="e.g. Mikel Arteta"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Stadium
                  </label>
                  <input
                    type="text"
                    name="stadium"
                    defaultValue={editTeam?.stadium || ""}
                    className="w-full px-3 py-2 border rounded-md bg-background"
                    placeholder="e.g. Emirates Stadium"
                  />
                </div>
                <div>
                  <LogoUploadField initialUrl={editTeam?.logo_url || ""} />
                </div>

                <button
                  type="submit"
                  className="w-full bg-primary text-primary-foreground font-semibold py-2 rounded-md hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 mt-4"
                >
                  {editTeam ? (
                    <Pencil className="h-4 w-4" />
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                  {editTeam ? "Update Team" : "Add Team"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
