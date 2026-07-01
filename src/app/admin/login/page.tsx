import { login } from "@/app/actions/auth";
import { Trophy, ShieldAlert } from "lucide-react";
import { SubmitButton } from "./SubmitButton";

export default function LoginPage() {
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
          <form action={login} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
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
                className="block w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                placeholder="••••••••"
              />
            </div>

            <SubmitButton />
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
