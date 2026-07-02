"use client";

import { useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { Suspense } from "react";

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q");

  return (
    <>
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 mb-8">
        <Search className="h-8 w-8 text-primary" />
      </div>
      <h1 className="text-4xl font-extrabold tracking-tight mb-4">
        Search Results
      </h1>
      <p className="text-lg text-muted-foreground max-w-2xl">
        {query ? (
          <>
            Showing results for <span className="font-semibold text-foreground">"{query}"</span>
          </>
        ) : (
          "Please enter a search term to see results."
        )}
      </p>
    </>
  );
}

export default function SearchPage() {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 min-h-[70vh] flex flex-col items-center justify-center text-center">
      <Suspense fallback={<div className="text-muted-foreground animate-pulse">Loading search results...</div>}>
        <SearchContent />
      </Suspense>
    </div>
  );
}

