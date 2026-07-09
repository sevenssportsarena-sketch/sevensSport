import { signup } from "@/app/actions/auth";
import { Trophy, ShieldAlert, UserPlus } from "lucide-react";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export default async function RegisterPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    const canRegisterSetting = await prisma.appSetting.findUnique({
      where: { key: "canRegister" }
    });

    if (!canRegisterSetting || canRegisterSetting.value !== "true") {
      redirect("/");
    }
  }

  return (
    <div className="flex min-h-screen flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-card border shadow-xl rounded-2xl overflow-hidden">
        <div className="p-8 text-center bg-muted/30 border-b">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary mb-4">
            <UserPlus className="h-6 w-6 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Admin Registration</h1>
          <p className="text-sm text-muted-foreground mt-1">Create a new admin account for the Sevens Sports Arena</p>
        </div>
        
        <div className="p-8">
          <form className="space-y-6">
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

            <button
              formAction={signup}
              className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
            >
              Create Account
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
