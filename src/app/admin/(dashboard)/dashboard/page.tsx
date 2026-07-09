import { BarChart3, Users, FileText, MousePointerClick, TrendingUp } from "lucide-react";
import { TrafficChart, AdPerformanceChart } from "@/components/admin/DashboardCharts";
import prisma from "@/lib/prisma";

export default async function AdminDashboard() {
  const publishedPostsCount = await prisma.post.count({
    where: { status: 'published' }
  });

  const allPostsCount = await prisma.post.count();

  const totalViewsResult = await prisma.post.aggregate({
    _sum: { views: true }
  });
  const totalViews = totalViewsResult._sum.views || 0;

  const mostViewedPost = await prisma.post.findFirst({
    where: { status: 'published' },
    orderBy: { views: 'desc' },
    select: { title: true, views: true, slug: true }
  });

  const viewsDataRaw = await prisma.$queryRaw<{ date: Date; views: number }[]>`
    SELECT DATE(created_at) as date, CAST(COUNT(*) AS INTEGER) as views
    FROM "PostView"
    WHERE created_at >= current_date - interval '6 days'
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

  const adClicksRaw = await prisma.adAnalytics.groupBy({
    by: ['placement'],
    where: {
      event_type: 'click',
    },
    _count: {
      id: true,
    },
  });

  const adClicksMap = {
    'Hero Banner': 0,
    'Sidebar': 0,
    'Inline Post': 0,
  };
  
  adClicksRaw.forEach(item => {
    const name = item.placement.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    if (name in adClicksMap) {
      adClicksMap[name as keyof typeof adClicksMap] = item._count.id;
    }
  });

  const adClicksData = Object.entries(adClicksMap).map(([name, clicks]) => ({ name, clicks }));

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
        <p className="text-muted-foreground mt-1">Analytics and performance metrics for Sevens Sports Arena.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-card border rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-muted-foreground text-sm">Total Views</h3>
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Users className="h-5 w-5 text-primary" />
            </div>
          </div>
          <div className="text-3xl font-bold">{totalViews.toLocaleString()}</div>
          <div className="flex items-center mt-2 text-sm text-muted-foreground font-medium">
            Across all posts
          </div>
        </div>

        <div className="bg-card border rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-muted-foreground text-sm">Published Posts</h3>
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <FileText className="h-5 w-5 text-primary" />
            </div>
          </div>
          <div className="text-3xl font-bold">{publishedPostsCount}</div>
          <div className="flex items-center mt-2 text-sm text-muted-foreground font-medium">
            Out of {allPostsCount} total posts
          </div>
        </div>

        <div className="bg-card border rounded-xl p-6 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-muted-foreground text-sm">Most Viewed Post</h3>
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
          </div>
          {mostViewedPost ? (
            <>
              <div className="text-xl font-bold line-clamp-1">{mostViewedPost.title}</div>
              <div className="flex items-center mt-2 text-sm text-green-500 font-medium">
                {mostViewedPost.views.toLocaleString()} views
              </div>
            </>
          ) : (
            <div className="text-muted-foreground">No posts found</div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border rounded-xl p-6 shadow-sm min-h-[300px]">
          <h3 className="font-semibold mb-2">Weekly Traffic Sources</h3>
          <TrafficChart data={chartData} />
        </div>
        
        <div className="bg-card border rounded-xl p-6 shadow-sm min-h-[300px]">
          <h3 className="font-semibold mb-2">Ad Placement Performance (Clicks)</h3>
          <AdPerformanceChart data={adClicksData} />
        </div>
      </div>
    </div>
  );
}
