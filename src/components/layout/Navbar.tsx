"use client";

import Link from "next/link";
import {
  Trophy,
  Search,
  Menu,
  Zap,
  X,
  ChevronDown,
  Calendar,
} from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useState } from "react";

import { useRouter, usePathname } from "next/navigation";

const navLinks = [
  { href: "/european-football", label: "European Football" },
  { href: "/champions-league", label: "Champions League" },
  { href: "/nigerian-football", label: "Nigerian Football" },
  { href: "/nba", label: "NBA" },
  { href: "/athletics", label: "Athletics" },
  // { href: "/tennis", label: "Tennis" },
  { href: "/boxing", label: "Boxing" },
];

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [footballOpen, setFootballOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/80 border-b border-border shadow-sm">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl overflow-hidden transition-all duration-300 group-hover:scale-110">
              <img
                src="/logo.jpeg"
                alt="SevensArena Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="font-extrabold tracking-tight text-xl">
              Sevens Sports <span className="gradient-text">Arena</span>
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            {/* Football Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setFootballOpen(true)}
              onMouseLeave={() => setFootballOpen(false)}
            >
              <button
                className={`relative flex items-center gap-1 px-3 py-2 text-sm font-medium transition-colors rounded-lg hover:bg-white/5 ${
                  pathname?.startsWith("/football") ||
                  pathname?.startsWith("/match")
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Trophy className="h-3.5 w-3.5" />
                Football
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform ${footballOpen ? "rotate-180" : ""}`}
                />
              </button>
              {footballOpen && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-background/95 backdrop-blur-md border border-border rounded-xl shadow-xl overflow-hidden z-50">
                  <Link
                    href="/football/fixtures"
                    className="flex items-center gap-2.5 px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                    onClick={() => setFootballOpen(false)}
                  >
                    <Calendar className="h-4 w-4" /> Fixtures &amp; Results
                  </Link>
                  <Link
                    href="/football/standings"
                    className="flex items-center gap-2.5 px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                    onClick={() => setFootballOpen(false)}
                  >
                    <Trophy className="h-4 w-4" /> League Standings
                  </Link>
                </div>
              )}
            </div>

            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground rounded-lg hover:bg-white/5"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <form
            onSubmit={handleSearch}
            className="flex items-center relative transition-all"
          >
            <Search className="absolute left-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 pl-9 pr-4 rounded-lg bg-background border border-border text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all w-16 md:w-48 focus:w-40 md:focus:w-64 placeholder:text-muted-foreground"
            />
          </form>
          <ThemeToggle />
          <button
            className="md:hidden h-9 w-9 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
            <span className="sr-only">Toggle menu</span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-md">
          <div className="container mx-auto px-4 py-4 space-y-3">
            <nav className="flex flex-col space-y-1">
              {/* Football section in mobile */}
              <div className="px-3 py-1">
                <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-1 flex items-center gap-1.5">
                  <Trophy className="h-3 w-3" /> Football
                </p>
                <Link
                  href="/football/fixtures"
                  className="flex items-center gap-2 px-2 py-2 text-sm font-medium text-muted-foreground hover:text-foreground rounded-lg hover:bg-white/5"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Calendar className="h-4 w-4" /> Fixtures &amp; Results
                </Link>
                <Link
                  href="/football/standings"
                  className="flex items-center gap-2 px-2 py-2 text-sm font-medium text-muted-foreground hover:text-foreground rounded-lg hover:bg-white/5"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Trophy className="h-4 w-4" /> League Standings
                </Link>
              </div>
              <div className="border-t border-border/50 my-1" />
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-3 py-2 text-base font-medium text-muted-foreground transition-colors hover:text-foreground rounded-lg hover:bg-white/5"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
