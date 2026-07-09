"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, ShieldCheck, LayoutDashboard, FileText, MessageSquare, Megaphone, Globe, ChevronDown, ExternalLink, UserPlus } from "lucide-react";
import { usePathname } from "next/navigation";

export default function MobileAdminNav({ userEmail, signOutNode }: { userEmail: string, signOutNode: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const links = [
    { href: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/admin/posts", icon: FileText, label: "All Posts" },
    { href: "/admin/posts/new", icon: FileText, label: "Write Post" },
    { href: "/admin/comments", icon: MessageSquare, label: "Moderation" },
    { href: "/admin/ads", icon: Megaphone, label: "Ads Management" },
  ];

  return (
    <div className="md:hidden bg-card border-b p-4 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center">
        <div className="h-6 w-6 rounded-md overflow-hidden mr-2">
          <img src="/logo.jpeg" alt="Logo" className="w-full h-full object-cover" />
        </div>
        <span className="font-bold tracking-tight text-lg">Admin</span>
      </div>
      <button onClick={() => setIsOpen(!isOpen)} className="p-2">
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
            onClick={() => setIsOpen(false)} 
          />
          
          {/* Drawer */}
          <div className="relative w-72 max-w-sm h-full bg-card border-r shadow-2xl p-4 flex flex-col gap-2 animate-in slide-in-from-left duration-300">
            <div className="flex items-center justify-between mb-6 pb-4 border-b">
              <div className="flex items-center">
                <div className="h-7 w-7 rounded-md overflow-hidden mr-3 shadow-sm">
                  <img src="/logo.jpeg" alt="Logo" className="w-full h-full object-cover" />
                </div>
                <span className="font-bold tracking-tight text-xl">Admin</span>
              </div>
              <button 
                onClick={() => setIsOpen(false)} 
                className="p-2 rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto space-y-1">
              {links.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-colors ${
                      isActive 
                        ? "bg-primary text-primary-foreground shadow-md glow-primary" 
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    }`}
                  >
                    <Icon className="h-5 w-5 mr-3" />
                    {link.label}
                  </Link>
                );
              })}

              <details className="group pt-4 pb-2 px-2">
                <summary className="flex items-center justify-between px-2 py-2 text-sm font-medium rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                  <div className="flex items-center">
                    <Globe className="h-5 w-5 mr-3" />
                    Site Content
                  </div>
                  <ChevronDown className="h-5 w-5 opacity-50 transition-transform group-open:rotate-180" />
                </summary>
                <div className="mt-1 space-y-1 pl-4">
                  {['about', 'privacy', 'terms', 'cookies', 'advertise', 'contact'].map(slug => {
                    const isActive = pathname === `/admin/pages/${slug}`;
                    return (
                      <Link
                        key={slug}
                        href={`/admin/pages/${slug}`}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center px-4 py-2.5 mx-2 text-sm font-medium rounded-lg transition-colors capitalize ${
                          isActive
                            ? "bg-primary/20 text-foreground shadow-sm"
                            : "text-muted-foreground hover:text-foreground hover:bg-accent"
                        }`}
                      >
                        <FileText className="h-4 w-4 mr-3 opacity-50" />
                        {slug}
                      </Link>
                    );
                  })}
                </div>
              </details>
            </nav>

            <div className="mt-4 pt-4 border-t">
              <div className="px-2 mb-4 space-y-1">
                <Link href="/" target="_blank" onClick={() => setIsOpen(false)} className="flex w-full items-center px-2 py-2 text-sm font-medium rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
                  <ExternalLink className="h-4 w-4 mr-3" />
                  Go to main site
                </Link>
                <Link href="/admin/register" onClick={() => setIsOpen(false)} className="flex w-full items-center px-2 py-2 text-sm font-medium rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
                  <UserPlus className="h-4 w-4 mr-3" />
                  Add a new admin
                </Link>
              </div>
              <div className="flex items-center gap-3 px-3 py-2 mb-2 bg-accent/50 rounded-xl">
                <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                  {userEmail?.charAt(0).toUpperCase() || "A"}
                </div>
                <div className="flex flex-col overflow-hidden">
                  <span className="text-sm font-bold truncate">{userEmail}</span>
                  <span className="text-[11px] font-semibold text-primary uppercase tracking-widest">Administrator</span>
                </div>
              </div>
              <div className="mt-2" onClick={() => setIsOpen(false)}>
                {signOutNode}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
