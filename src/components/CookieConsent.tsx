"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Cookie } from "lucide-react";

export function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = document.cookie.match(/(?:^|;)\s*cookie_consent=([^;]*)/);
    if (!consent) {
      setShow(true);
    }
  }, []);

  const accept = () => {
    const expires = new Date();
    expires.setFullYear(expires.getFullYear() + 1);
    document.cookie = `cookie_consent=true; path=/; expires=${expires.toUTCString()}; SameSite=Lax`;
    setShow(false);
  };

  const decline = () => {
    const expires = new Date();
    expires.setFullYear(expires.getFullYear() + 1);
    document.cookie = `cookie_consent=false; path=/; expires=${expires.toUTCString()}; SameSite=Lax`;
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6 md:max-w-[420px]">
      <div className="glass bg-background/95 backdrop-blur-xl rounded-2xl p-5 shadow-2xl border border-border/60">
        <div className="flex items-start gap-4">
          <div className="shrink-0 p-2.5 bg-primary/10 rounded-full text-primary glow-primary">
            <Cookie className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold mb-1.5 text-foreground">We value your privacy</h3>
            <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
              We use cookies to personalize content and ads, to provide social media features and to analyze our traffic. 
              <Link href="/cookies" className="text-primary hover:underline ml-1 font-semibold">Read more</Link>
            </p>
            <div className="flex gap-2">
              <button onClick={accept} className="flex-1 bg-primary text-primary-foreground text-sm font-bold py-2 px-4 rounded-xl hover:bg-primary/90 transition-all active:scale-95 glow-primary">
                Accept
              </button>
              <button onClick={decline} className="flex-1 bg-secondary text-secondary-foreground text-sm font-bold py-2 px-4 rounded-xl hover:bg-secondary/80 transition-all active:scale-95">
                Decline
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
