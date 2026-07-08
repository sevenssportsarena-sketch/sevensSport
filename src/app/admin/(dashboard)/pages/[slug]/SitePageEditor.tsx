"use client";

import { useState } from "react";
import { updateSitePage } from "@/app/actions/sitePages";
import { Save, Check, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export function SitePageEditor({
  slug,
  title,
  initialContent
}: {
  slug: string;
  title: string;
  initialContent: string;
}) {
  const [content, setContent] = useState(initialContent);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");
  const router = useRouter();

  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus("idle");
    const result = await updateSitePage(slug, content);
    setIsSaving(false);
    
    if (result.success) {
      setSaveStatus("success");
      setTimeout(() => setSaveStatus("idle"), 3000);
      router.refresh();
    } else {
      setSaveStatus("error");
    }
  };

  return (
    <div className="bg-card rounded-2xl border border-border shadow-xl overflow-hidden flex flex-col h-[700px]">
      <div className="p-4 border-b border-border bg-muted/30 flex justify-between items-center">
        <h2 className="font-semibold text-lg">HTML Editor ({title})</h2>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-50"
        >
          {isSaving ? (
            <span className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
          ) : saveStatus === "success" ? (
            <Check className="h-4 w-4" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {saveStatus === "success" ? "Saved!" : "Save Changes"}
        </button>
      </div>
      
      {saveStatus === "error" && (
        <div className="p-3 bg-red-500/10 text-red-500 text-sm flex items-center font-semibold">
          <AlertCircle className="w-4 h-4 mr-2" />
          Failed to save changes. Please try again.
        </div>
      )}

      <div className="flex-1 flex flex-col lg:flex-row h-full overflow-hidden">
        {/* Editor Side */}
        <div className="flex-1 border-b lg:border-b-0 lg:border-r border-border p-4 bg-background">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
            Raw HTML content
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-[calc(100%-2rem)] bg-muted/10 border border-border rounded-xl p-4 font-mono text-sm text-foreground focus:ring-2 focus:ring-primary/50 focus:outline-none resize-none"
            placeholder="<p>Enter HTML here...</p>"
          />
        </div>

        {/* Preview Side */}
        <div className="flex-1 p-6 bg-card overflow-y-auto">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 block">
            Live Preview
          </label>
          <div 
            className="prose prose-lg dark:prose-invert max-w-none 
              prose-headings:font-extrabold prose-headings:tracking-tight
              prose-a:text-primary prose-a:no-underline hover:prose-a:underline
              [&_*]:!font-sans"
            dangerouslySetInnerHTML={{ __html: content }} 
          />
        </div>
      </div>
    </div>
  );
}
