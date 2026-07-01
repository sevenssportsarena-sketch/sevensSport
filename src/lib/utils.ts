import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getExcerpt(content: string, maxLength: number = 180) {
  try {
    const blocks = JSON.parse(content);
    if (Array.isArray(blocks)) {
      let textBlocks = blocks
        .filter((b: any) => b.type === "paragraph" || b.type === "heading" || b.type === "quote")
        .map((b: any) => b.content)
        .join(" ");
      textBlocks = textBlocks.replace(/<[^>]*>?/gm, "");
      return textBlocks.length > maxLength ? textBlocks.substring(0, maxLength) + "..." : textBlocks;
    }
  } catch (e) {
    // fallback to HTML extraction
  }
  const stripped = content.replace(/<[^>]*>?/gm, "");
  return stripped.length > maxLength ? stripped.substring(0, maxLength) + "..." : stripped;
}
