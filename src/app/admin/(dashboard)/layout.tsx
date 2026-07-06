import { ShieldCheck, LayoutDashboard, FileText, MessageSquare, LogOut, Megaphone } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

import MobileAdminNav from "./MobileAdminNav";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  let user = null;
  try {
    const { data } = await supabase.auth.getUser();
    user = data.user;
  } catch (error) {
    // Graceful fallback
  }

  if (!user) {
    redirect("/admin/login");
  }

  const signOutNode = (
    <form action={async () => {
      "use server";
      const supabase = await createClient();
      await supabase.auth.signOut();
      redirect("/admin/login");
    }}>
      <button className="flex w-full items-center px-3 py-2 text-sm font-medium rounded-lg text-red-500 hover:bg-red-500/10 transition-colors">
        <LogOut className="h-4 w-4 mr-3" />
        Sign out
      </button>
    </form>
  );

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col md:flex-row">
      <MobileAdminNav userEmail={user?.email || ""} signOutNode={signOutNode} />
      <aside className="w-64 border-r bg-card h-screen sticky top-0 flex-col hidden md:flex">
          <div className="h-16 flex items-center px-6 border-b">
            <div className="h-6 w-6 rounded-md overflow-hidden mr-2">
              <img src="/logo.jpeg" alt="Logo" className="w-full h-full object-cover" />
            </div>
            <span className="font-bold tracking-tight text-lg">Admin Panel</span>
          </div>
          <nav className="flex-1 p-4 space-y-1">
            <Link href="/admin/dashboard" className="flex items-center px-3 py-2.5 text-sm font-medium rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
              <LayoutDashboard className="h-4 w-4 mr-3" />
              Dashboard
            </Link>
            <Link href="/admin/posts" className="flex items-center px-3 py-2.5 text-sm font-medium rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
              <FileText className="h-4 w-4 mr-3" />
              All Posts
            </Link>
            <Link href="/admin/posts/new" className="flex items-center px-3 py-2.5 text-sm font-medium rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
              <FileText className="h-4 w-4 mr-3" />
              Write Post
            </Link>
            <Link href="/admin/comments" className="flex items-center px-3 py-2.5 text-sm font-medium rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
              <MessageSquare className="h-4 w-4 mr-3" />
              Moderation
            </Link>
            <Link href="/admin/ads" className="flex items-center px-3 py-2.5 text-sm font-medium rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
              <Megaphone className="h-4 w-4 mr-3" />
              Ads Management
            </Link>
          </nav>
          <div className="p-4 border-t">
            <div className="flex items-center gap-3 px-3 py-2 mb-2">
              <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                {user.email?.charAt(0).toUpperCase()}
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="text-sm font-medium truncate">{user.email}</span>
                <span className="text-xs text-muted-foreground">Administrator</span>
              </div>
            </div>
            {signOutNode}
          </div>
        </aside>
      <main className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}
