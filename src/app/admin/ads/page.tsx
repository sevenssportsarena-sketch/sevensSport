import Link from "next/link";
import { Plus, Pencil, ToggleLeft, ToggleRight, Megaphone, BarChart2 } from "lucide-react";
import prisma from "@/lib/prisma";
import { toggleAdStatus } from "@/app/actions/ads";
import { DeleteAdButton } from "@/components/admin/DeleteAdButton";

const PLACEMENT_LABELS: Record<string, string> = {
  hero_banner: "Hero Banner",
  sidebar: "Sidebar",
  inline_post: "Inline Post",
};

export default async function AdsPage() {
  const ads = await prisma.ad.findMany({
    include: {
      _count: { select: { ad_analytics: true } },
    },
    orderBy: { start_date: "desc" },
  });

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <header className="h-16 border-b bg-card flex items-center justify-between px-8 shrink-0">
        <div className="flex items-center gap-3">
          <Megaphone className="h-5 w-5 text-primary" />
          <h1 className="text-xl font-bold tracking-tight">Ads Management</h1>
          <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">
            {ads.length}
          </span>
        </div>
        <Link
          href="/admin/ads/new"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-4 w-4" /> New Ad
        </Link>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-8">
        {ads.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
              <Megaphone className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground font-medium">No ads yet.</p>
            <Link
              href="/admin/ads/new"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
            >
              <Plus className="h-4 w-4" /> Create your first ad
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {ads.map((ad: any) => (
              <div
                key={ad.id}
                className="bg-card border border-border rounded-xl overflow-hidden"
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-5">
                  {/* Thumbnail */}
                  <div className="shrink-0 w-full sm:w-32 h-20 rounded-lg overflow-hidden bg-muted">
                    <img
                      src={ad.image_url}
                      alt={ad.title}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0 space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-bold text-sm truncate">{ad.title}</h3>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-wider ${
                          ad.status === "active"
                            ? "bg-green-500/15 text-green-500"
                            : "bg-yellow-500/15 text-yellow-500"
                        }`}
                      >
                        {ad.status}
                      </span>
                      {ad.placements.map((p: any) => (
                        <span key={p} className="rounded-full border border-border px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                          {PLACEMENT_LABELS[p] ?? p}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{ad.target_url}</p>
                    <div className="flex items-center gap-4 text-[11px] text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <BarChart2 className="h-3 w-3" />
                        {ad._count.ad_analytics} events
                      </span>
                      {ad.start_date && (
                        <span>From {new Date(ad.start_date).toLocaleDateString()}</span>
                      )}
                      {ad.end_date && (
                        <span>Until {new Date(ad.end_date).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    {/* Toggle status */}
                    <form
                      action={async () => {
                        "use server";
                        await toggleAdStatus(ad.id, ad.status);
                      }}
                    >
                      <button
                        type="submit"
                        title={ad.status === "active" ? "Pause" : "Activate"}
                        className="h-9 w-9 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                      >
                        {ad.status === "active" ? (
                          <ToggleRight className="h-4 w-4 text-green-500" />
                        ) : (
                          <ToggleLeft className="h-4 w-4 text-yellow-500" />
                        )}
                      </button>
                    </form>

                    {/* Edit */}
                    <Link
                      href={`/admin/ads/${ad.id}/edit`}
                      className="h-9 w-9 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                    >
                      <Pencil className="h-4 w-4" />
                    </Link>

                    {/* Delete */}
                    <DeleteAdButton id={ad.id} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
