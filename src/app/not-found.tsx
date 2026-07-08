import Link from "next/link";
import { AlertCircle, ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-md w-full text-center space-y-8 glass rounded-3xl p-10 border border-border/50 relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-primary/20 blur-[60px] pointer-events-none" />
        
        <div className="relative">
          <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 glow-primary">
            <AlertCircle className="w-12 h-12 text-primary" />
          </div>
          
          <h1 className="text-6xl font-black tracking-tighter mb-2">404</h1>
          <h2 className="text-2xl font-bold mb-4">Page Not Found</h2>
          
          <p className="text-muted-foreground mb-8 text-sm leading-relaxed">
            We couldn't find the page you're looking for. It might have been moved, deleted, or never existed in the first place.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link 
              href="/" 
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-lg transition-all hover:scale-105 active:scale-95 glow-primary"
            >
              <Home className="h-4 w-4" />
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
