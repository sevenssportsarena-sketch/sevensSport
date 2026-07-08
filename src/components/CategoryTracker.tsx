"use client";

import { useEffect } from "react";

export function CategoryTracker({ category }: { category: string }) {
  useEffect(() => {
    try {
      // Basic check to see if they've accepted cookies (optional, but good practice)
      const consentMatch = document.cookie.match(/(?:^|;)\s*cookie_consent=([^;]*)/);
      const hasConsent = consentMatch ? consentMatch[1] === 'true' : false;
      
      // If no consent, don't track
      if (!hasConsent) return;

      const match = document.cookie.match(/(?:^|;)\s*user_interests=([^;]*)/);
      let interests = match ? decodeURIComponent(match[1]).split(",") : [];
      
      if (!interests.includes(category)) {
        // Keep up to 3 most recent interests
        interests = [category, ...interests].slice(0, 3);
        const expires = new Date();
        expires.setFullYear(expires.getFullYear() + 1); // 1 year expiry
        document.cookie = `user_interests=${encodeURIComponent(interests.join(","))}; path=/; expires=${expires.toUTCString()}; SameSite=Lax`;
      }
    } catch (e) {
      // Ignore client-side cookie errors
    }
  }, [category]);

  return null;
}
