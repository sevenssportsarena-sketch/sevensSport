import { updateAd } from "@/app/actions/ads";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { Save, Megaphone } from "lucide-react";

export default async function EditAdPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const ad = await prisma.ad.findUnique({ where: { id } });

  if (!ad) notFound();

  // Bind the ID so we can use with a plain form action
  const updateAdWithId = updateAd.bind(null, ad.id);

  const fmt = (d: Date | null) =>
    d ? new Date(d).toISOString().split("T")[0] : "";

  return (
    <form
      action={updateAdWithId}
      className="flex-1 flex flex-col h-[calc(100vh-64px)] overflow-hidden"
    >
      {/* Header */}
      <header className="h-16 border-b bg-card flex items-center justify-between px-8 shrink-0">
        <div className="flex items-center gap-3">
          <Megaphone className="h-5 w-5 text-primary" />
          <h1 className="text-xl font-bold tracking-tight">Edit Ad</h1>
        </div>
        <button
          type="submit"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors"
        >
          <Save className="h-4 w-4" /> Save Changes
        </button>
      </header>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-2xl mx-auto space-y-6">

          {/* Preview */}
          {ad.image_url && (
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <img
                src={ad.image_url}
                alt={ad.title}
                className="w-full max-h-48 object-cover"
              />
            </div>
          )}

          {/* Details */}
          <div className="bg-card border border-border rounded-xl p-6 space-y-4">
            <h2 className="font-bold border-b pb-2">Ad Details</h2>

            <div className="space-y-2">
              <label className="text-sm font-medium">Ad Title</label>
              <input
                type="text"
                name="title"
                required
                defaultValue={ad.title}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Image URL</label>
              <input
                type="url"
                name="image_url"
                required
                defaultValue={ad.image_url}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Destination URL</label>
              <input
                type="url"
                name="target_url"
                required
                defaultValue={ad.target_url}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary"
              />
            </div>
          </div>

          {/* Placements */}
          <div className="bg-card border border-border rounded-xl p-6 space-y-4">
            <h2 className="font-bold border-b pb-2">Placements</h2>
            <p className="text-xs text-muted-foreground">Select all locations where this ad should appear.</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { value: "hero_banner", label: "Hero Banner", desc: "Top of home & category pages" },
                { value: "sidebar",     label: "Sidebar",     desc: "Article sidebar" },
                { value: "inline_post", label: "Inline Post", desc: "Inside article content" },
              ].map((p: any) => (
                <label key={p.value} className="flex items-start gap-3 p-3 rounded-lg border border-border hover:border-primary/40 hover:bg-primary/5 cursor-pointer transition-all has-[:checked]:border-primary has-[:checked]:bg-primary/10">
                  <input
                    type="checkbox"
                    name="placements"
                    value={p.value}
                    defaultChecked={ad.placements.includes(p.value as any)}
                    className="mt-0.5 accent-primary"
                  />
                  <div>
                    <p className="text-sm font-semibold">{p.label}</p>
                    <p className="text-xs text-muted-foreground">{p.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Status */}
          <div className="bg-card border border-border rounded-xl p-6 space-y-4">
            <h2 className="font-bold border-b pb-2">Status</h2>
            <select
              name="status"
              defaultValue={ad.status}
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary"
            >
              <option value="active">Active</option>
              <option value="paused">Paused</option>
            </select>
          </div>

          {/* Schedule */}
          <div className="bg-card border border-border rounded-xl p-6 space-y-4">
            <h2 className="font-bold border-b pb-2">Schedule (optional)</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Start Date</label>
                <input
                  type="date"
                  name="start_date"
                  defaultValue={fmt(ad.start_date)}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">End Date</label>
                <input
                  type="date"
                  name="end_date"
                  defaultValue={fmt(ad.end_date)}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary"
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    </form>
  );
}
