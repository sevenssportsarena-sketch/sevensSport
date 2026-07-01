import { BarChart3, Users, FileText, MousePointerClick, TrendingUp } from "lucide-react";
import { TrafficChart, AdPerformanceChart } from "@/components/admin/DashboardCharts";
import prisma from "@/lib/prisma";

export default async function AdminDashboard() {
  const publishedPostsCount = await prisma.post.count({
    where: { status: 'published' }
  });

  const allPostsCount = await prisma.post.count();

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
        <p className="text-muted-foreground mt-1">Analytics and performance metrics for Sevens Sports Arena.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-card border rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-muted-foreground text-sm">Total Views (Dummy)</h3>
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Users className="h-5 w-5 text-primary" />
            </div>
          </div>
          <div className="text-3xl font-bold">124.5K</div>
          <div className="flex items-center mt-2 text-sm text-green-500 font-medium">
            <TrendingUp className="h-4 w-4 mr-1" />
            +14% this week
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

        <div className="bg-card border rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-muted-foreground text-sm">Ad Impressions (Dummy)</h3>
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-primary" />
            </div>
          </div>
          <div className="text-3xl font-bold">892.1K</div>
          <div className="flex items-center mt-2 text-sm text-green-500 font-medium">
            <TrendingUp className="h-4 w-4 mr-1" />
            +22% this week
          </div>
        </div>

        <div className="bg-card border rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-muted-foreground text-sm">Ad Clicks (Dummy)</h3>
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <MousePointerClick className="h-5 w-5 text-primary" />
            </div>
          </div>
          <div className="text-3xl font-bold">14.2K</div>
          <div className="flex items-center mt-2 text-sm text-red-500 font-medium">
            <TrendingUp className="h-4 w-4 mr-1 rotate-180" />
            -2% this week
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border rounded-xl p-6 shadow-sm min-h-[300px]">
          <h3 className="font-semibold mb-2">Weekly Traffic Sources</h3>
          <TrafficChart />
        </div>
        
        <div className="bg-card border rounded-xl p-6 shadow-sm min-h-[300px]">
          <h3 className="font-semibold mb-2">Ad Placement Performance (Clicks)</h3>
          <AdPerformanceChart />
        </div>
      </div>
    </div>
  );
}
