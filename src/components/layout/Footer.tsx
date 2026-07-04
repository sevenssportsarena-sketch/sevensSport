import Link from "next/link";
import { Trophy, Globe, MessageCircle, Tv } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative border-t border-border/50 mt-20">
      {/* Gradient divider */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px animated-border" />
      
      <div className="container mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* Brand */}
          <div className="md:col-span-4 space-y-5">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary glow-primary">
                <Trophy className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-extrabold tracking-tight text-xl">
                Sevens<span className="gradient-text">Arena</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Your ultimate destination for high-performance, real-time sports news, insights, and interactive discussions.
            </p>
            <div className="flex gap-3 pt-2">
              <a href="https://x.com/sevens_arena" target="_blank" rel="noopener noreferrer" className="h-9 w-9 rounded-lg flex items-center justify-center border border-border hover:bg-white/5 hover:border-primary/30 transition-all text-muted-foreground hover:text-foreground" title="X">
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="https://www.tiktok.com/@sevenssportsarena?_r=1&_t=ZS-93szPArd5E4" target="_blank" rel="noopener noreferrer" className="h-9 w-9 rounded-lg flex items-center justify-center border border-border hover:bg-white/5 hover:border-primary/30 transition-all text-muted-foreground hover:text-foreground" title="TikTok">
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z"/></svg>
              </a>
              <a href="https://www.facebook.com/share/1AWnsrtkoN/" target="_blank" rel="noopener noreferrer" className="h-9 w-9 rounded-lg flex items-center justify-center border border-border hover:bg-white/5 hover:border-primary/30 transition-all text-muted-foreground hover:text-foreground" title="Facebook">
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </a>
              <a href="https://www.instagram.com/sevenssportsarena?igsh=MXY1bHdoc3lrcXB3cA==" target="_blank" rel="noopener noreferrer" className="h-9 w-9 rounded-lg flex items-center justify-center border border-border hover:bg-white/5 hover:border-primary/30 transition-all text-muted-foreground hover:text-foreground" title="Instagram">
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line></svg>
              </a>
            </div>
          </div>

          {/* Links */}
          <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">Sports</h3>
              <ul className="space-y-3">
                {[
                  { href: "/european-football", label: "European Football" },
                  { href: "/nigerian-football", label: "Nigerian Football" },
                  { href: "/nba", label: "NBA" },
                  { href: "/athletics", label: "Athletics" },
                ].map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">Company</h3>
              <ul className="space-y-3">
                {[
                  { href: "/about", label: "About Us" },
                  { href: "/contact", label: "Contact" },
                  { href: "/careers", label: "Careers" },
                  { href: "/advertise", label: "Advertise" },
                ].map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">Legal</h3>
              <ul className="space-y-3">
                {[
                  { href: "/privacy", label: "Privacy Policy" },
                  { href: "/terms", label: "Terms of Service" },
                  { href: "/cookies", label: "Cookie Policy" },
                ].map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-border/50 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Sevens Sports Arena. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground flex items-center gap-1.5">
            Built for speed <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary animate-pulse" /> Designed for fans
          </p>
        </div>
      </div>
    </footer>
  );
}
