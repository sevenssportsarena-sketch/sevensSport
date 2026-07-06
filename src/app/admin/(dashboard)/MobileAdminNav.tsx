"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, ShieldCheck, LayoutDashboard, FileText, MessageSquare, Megaphone } from "lucide-react";
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
        <div className="absolute top-full left-0 right-0 bg-card border-b shadow-lg p-4 flex flex-col gap-2 z-50">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                  isActive ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-accent"
                }`}
              >
                <Icon className="h-4 w-4 mr-3" />
                {link.label}
              </Link>
            );
          })}
          <div className="mt-4 pt-4 border-t">
            <div className="flex items-center gap-3 px-3 py-2 mb-2">
              <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                {userEmail?.charAt(0).toUpperCase() || "A"}
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="text-sm font-medium truncate">{userEmail}</span>
                <span className="text-xs text-muted-foreground">Administrator</span>
              </div>
            </div>
            <div className="mt-2" onClick={() => setIsOpen(false)}>
              {signOutNode}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
