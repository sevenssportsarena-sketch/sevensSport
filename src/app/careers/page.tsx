import { Trophy } from "lucide-react";

export default function CareersPage() {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 min-h-[70vh] flex flex-col items-center justify-center text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 mb-8">
        <Trophy className="h-8 w-8 text-primary" />
      </div>
      <h1 className="text-4xl font-extrabold tracking-tight mb-4">Careers</h1>
      <p className="text-lg text-muted-foreground max-w-2xl">
        This page is currently under construction. Check back soon for exciting updates and new features!
      </p>
    </div>
  );
}
