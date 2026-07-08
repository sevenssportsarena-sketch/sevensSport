import prisma from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft, Users, MessageSquare, ThumbsUp, Flame, Target, Zap } from "lucide-react";
import { TrafficChart } from "@/components/admin/DashboardCharts";
import { notFound } from "next/navigation";

export default async function PostAnalyticsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      _count: {
        select: { comments: true }
      }
    }
  });

  if (!post) {
    notFound();
  }

  // Get reactions grouped by type
  const reactions = await prisma.reaction.groupBy({
    by: ['type'],
    where: { post_id: id },
    _count: {
      _all: true
    }
  });

  const reactionCounts = {
    like: reactions.find(r => r.type === 'like')?._count._all || 0,
    fire: reactions.find(r => r.type === 'fire')?._count._all || 0,
    goal: reactions.find(r => r.type === 'goal')?._count._all || 0,
    shock: reactions.find(r => r.type === 'shock')?._count._all || 0,
  };

  // Get view data for the last 7 days
  const viewsDataRaw = await prisma.$queryRaw<{ date: Date; views: number }[]>`
    SELECT DATE(created_at) as date, CAST(COUNT(*) AS INTEGER) as views
    FROM "PostView"
    WHERE post_id = ${id}::uuid AND created_at >= current_date - interval '6 days'
    GROUP BY DATE(created_at)
    ORDER BY DATE(created_at) ASC;
  `;

  const viewsMap = new Map();
  viewsDataRaw.forEach(row => {
    const dateStr = new Date(row.date).toLocaleDateString('en-US', { weekday: 'short' });
    viewsMap.set(dateStr, Number(row.views));
  });

  const chartData = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dayStr = d.toLocaleDateString('en-US', { weekday: 'short' });
    return {
      date: dayStr,
      views: viewsMap.get(dayStr) || 0
    };
  });

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/admin/posts" className="p-2 hover:bg-muted rounded-full transition-colors inline-flex">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Post Analytics</h1>
          <p className="text-muted-foreground mt-1 line-clamp-1">{post.title}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-card border rounded-xl p-4 shadow-sm flex flex-col items-center justify-center text-center">
          <Users className="h-6 w-6 text-blue-500 mb-2" />
          <div className="text-2xl font-bold">{post.views}</div>
          <div className="text-xs text-muted-foreground">Total Views</div>
        </div>
        <div className="bg-card border rounded-xl p-4 shadow-sm flex flex-col items-center justify-center text-center">
          <MessageSquare className="h-6 w-6 text-green-500 mb-2" />
          <div className="text-2xl font-bold">{post._count.comments}</div>
          <div className="text-xs text-muted-foreground">Comments</div>
        </div>
        <div className="bg-card border rounded-xl p-4 shadow-sm flex flex-col items-center justify-center text-center">
          <ThumbsUp className="h-6 w-6 text-blue-400 mb-2" />
          <div className="text-2xl font-bold">{reactionCounts.like}</div>
          <div className="text-xs text-muted-foreground">Likes</div>
        </div>
        <div className="bg-card border rounded-xl p-4 shadow-sm flex flex-col items-center justify-center text-center">
          <Flame className="h-6 w-6 text-orange-500 mb-2" />
          <div className="text-2xl font-bold">{reactionCounts.fire}</div>
          <div className="text-xs text-muted-foreground">Fires</div>
        </div>
        <div className="bg-card border rounded-xl p-4 shadow-sm flex flex-col items-center justify-center text-center">
          <Target className="h-6 w-6 text-red-500 mb-2" />
          <div className="text-2xl font-bold">{reactionCounts.goal}</div>
          <div className="text-xs text-muted-foreground">Goals</div>
        </div>
        <div className="bg-card border rounded-xl p-4 shadow-sm flex flex-col items-center justify-center text-center">
          <Zap className="h-6 w-6 text-yellow-500 mb-2" />
          <div className="text-2xl font-bold">{reactionCounts.shock}</div>
          <div className="text-xs text-muted-foreground">Shocks</div>
        </div>
      </div>

      <div className="bg-card border rounded-xl p-6 shadow-sm min-h-[300px]">
        <h3 className="font-semibold mb-2">7-Day View History</h3>
        <TrafficChart data={chartData} />
      </div>
    </div>
  );
}
