"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trophy, ShieldAlert, Loader2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError("Invalid credentials. Please try again.");
      setLoading(false);
      return;
    }

    // Hard navigation ensures the server re-evaluates the session cookie
    window.location.href = "/admin/dashboard";
  };

  return (
    <div className="flex min-h-screen flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-card border shadow-xl rounded-2xl overflow-hidden">
        <div className="p-8 text-center bg-muted/30 border-b">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary mb-4">
            <Trophy className="h-6 w-6 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Admin Portal</h1>
          <p className="text-sm text-muted-foreground mt-1">Sign in to manage the Sevens Sports Arena</p>
        </div>

        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                placeholder="admin@sevenssports.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:pointer-events-none"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In to Dashboard"
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <ShieldAlert className="h-4 w-4" />
            <span>Secure Supabase Authentication</span>
          </div>
        </div>
      </div>
    </div>
  );
}
