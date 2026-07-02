"use client";

import { useState, useEffect } from "react";
import { Plus, GripVertical, Trash2, ArrowUp, ArrowDown, Type, Heading, Image as ImageIcon, Quote } from "lucide-react";
import ImageUploader from "./ImageUploader";
import InlineRichText from "./InlineRichText";

export type BlockType = "paragraph" | "heading" | "image" | "quote";

export interface PostBlock {
  id: string;
  type: BlockType;
  content?: string;
  url?: string;
  caption?: string;
  alt?: string;
  credit?: string;
  level?: 1 | 2 | 3;
}

interface BlockBuilderProps {
  name: string;
  defaultValue?: string;
}

export default function BlockBuilder({ name, defaultValue }: BlockBuilderProps) {
  const [blocks, setBlocks] = useState<PostBlock[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (defaultValue) {
      try {
        const parsed = JSON.parse(defaultValue);
        if (Array.isArray(parsed)) {
          setBlocks(parsed);
        } else {
          // If old content is just a string, wrap it in a single paragraph block
          setBlocks([{ id: crypto.randomUUID(), type: "paragraph", content: defaultValue }]);
        }
      } catch (e) {
        // Fallback for raw HTML that wasn't JSON stringified
        setBlocks([{ id: crypto.randomUUID(), type: "paragraph", content: defaultValue }]);
      }
    } else {
      // Start with one empty paragraph
      setBlocks([{ id: crypto.randomUUID(), type: "paragraph", content: "" }]);
    }
  }, [defaultValue]);

  const addBlock = (type: BlockType, index: number) => {
    const newBlock: PostBlock = { id: crypto.randomUUID(), type, content: "" };
    if (type === "heading") newBlock.level = 2;
    
    const newBlocks = [...blocks];
    newBlocks.splice(index + 1, 0, newBlock);
    setBlocks(newBlocks);
  };

  const removeBlock = (id: string) => {
    if (blocks.length === 1) return; // Keep at least one block
    setBlocks(blocks.filter((b) => b.id !== id));
  };

  const moveBlock = (index: number, direction: "up" | "down") => {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === blocks.length - 1) return;

    const newBlocks = [...blocks];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    
    const temp = newBlocks[index];
    newBlocks[index] = newBlocks[targetIndex];
    newBlocks[targetIndex] = temp;
    
    setBlocks(newBlocks);
  };

  const updateBlock = (id: string, updates: Partial<PostBlock>) => {
    setBlocks(blocks.map((b) => (b.id === id ? { ...b, ...updates } : b)));
  };

  if (!mounted) {
    return <div className="h-64 w-full animate-pulse bg-muted rounded-xl" />;
  }

  return (
    <div className="space-y-6">
      {/* Hidden input to pass data to server actions */}
      <input type="hidden" name={name} value={JSON.stringify(blocks)} />
      
      <div className="space-y-4">
        {blocks.map((block, index) => (
          <div key={block.id} className="relative group border border-border rounded-xl bg-card transition-all hover:border-primary/30 hover:shadow-sm">
            
            {/* Block Controls Toolbar (Left) */}
            <div className="absolute -left-12 top-2 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-1 items-center bg-background border border-border rounded-lg p-1 shadow-sm">
              <button 
                type="button" 
                onClick={() => moveBlock(index, "up")} 
                disabled={index === 0}
                className="p-1 hover:bg-accent rounded disabled:opacity-30"
              >
                <ArrowUp className="h-4 w-4" />
              </button>
              <button 
                type="button" 
                onClick={() => moveBlock(index, "down")}
                disabled={index === blocks.length - 1}
                className="p-1 hover:bg-accent rounded disabled:opacity-30"
              >
                <ArrowDown className="h-4 w-4" />
              </button>
            </div>

            {/* Top Right Controls (Type switcher & Delete) */}
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
              <select
                value={block.type}
                onChange={(e) => updateBlock(block.id, { type: e.target.value as BlockType })}
                className="hidden md:block bg-accent/50 hover:bg-accent border border-border rounded-lg text-xs py-1 px-2 outline-none transition-colors"
              >
                <option value="paragraph">Paragraph</option>
                <option value="heading">Heading</option>
                <option value="image">Image</option>
                <option value="quote">Quote</option>
              </select>
              <button 
                type="button" 
                onClick={() => removeBlock(block.id)}
                className="p-1.5 text-destructive hover:bg-destructive/10 rounded-lg"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            <div className="p-4 md:p-6 pl-8">
              {/* Block Content Renderers */}
              {block.type === "paragraph" && (
                <InlineRichText
                  value={block.content || ""}
                  onChange={(val) => updateBlock(block.id, { content: val })}
                  placeholder="Type your paragraph here... (Highlight text to format or add links)"
                  className="min-h-[100px] text-foreground"
                />
              )}

              {block.type === "heading" && (
                <div className="flex items-start gap-3">
                  <select
                    value={block.level}
                    onChange={(e) => updateBlock(block.id, { level: Number(e.target.value) as 1 | 2 | 3 })}
                    className="bg-accent rounded border-none outline-none p-1 text-sm font-semibold h-full mt-1 shrink-0"
                  >
                    <option value={1}>H1</option>
                    <option value={2}>H2</option>
                    <option value={3}>H3</option>
                  </select>
                  <InlineRichText
                    value={block.content || ""}
                    onChange={(val) => updateBlock(block.id, { content: val })}
                    placeholder="Heading content..."
                    className={`font-bold ${block.level === 1 ? 'text-4xl' : block.level === 2 ? 'text-2xl' : 'text-xl'}`}
                  />
                </div>
              )}

              {block.type === "image" && (
                <div className="space-y-3 pt-6">
                  <ImageUploader 
                    value={block.url || ""} 
                    onChange={(url) => updateBlock(block.id, { url })} 
                    label="Upload Inline Image"
                  />
                  {block.url && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={block.caption || ""}
                        onChange={(e) => updateBlock(block.id, { caption: e.target.value })}
                        placeholder="Image caption (optional)"
                        className="w-full bg-accent/50 rounded-lg px-3 py-2 text-sm outline-none focus:bg-accent transition-colors"
                      />
                      <input
                        type="text"
                        value={block.credit || ""}
                        onChange={(e) => updateBlock(block.id, { credit: e.target.value })}
                        placeholder="Image credit/source (optional)"
                        className="w-full bg-accent/50 rounded-lg px-3 py-2 text-sm outline-none focus:bg-accent transition-colors"
                      />
                      <input
                        type="text"
                        value={block.alt || ""}
                        onChange={(e) => updateBlock(block.id, { alt: e.target.value })}
                        placeholder="Alt text for accessibility (optional)"
                        className="w-full md:col-span-2 bg-accent/50 rounded-lg px-3 py-2 text-sm outline-none focus:bg-accent transition-colors"
                      />
                    </div>
                  )}
                </div>
              )}

              {block.type === "quote" && (
                <div className="flex gap-4">
                  <div className="w-1.5 bg-primary rounded-full shrink-0" />
                  <InlineRichText
                    value={block.content || ""}
                    onChange={(val) => updateBlock(block.id, { content: val })}
                    placeholder="Enter quote here..."
                    className="min-h-[80px] text-xl italic text-foreground"
                  />
                </div>
              )}
            </div>

            {/* Add Block Toolbar - Shown below active block */}
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
              <div className="flex items-center gap-1 bg-card border border-border shadow-md rounded-full px-2 py-1">
                <span className="text-xs font-semibold text-muted-foreground mr-1 px-1"><Plus className="h-3 w-3 inline" /> Add</span>
                <button type="button" onClick={() => addBlock("paragraph", index)} className="p-1.5 hover:bg-accent rounded-full text-muted-foreground hover:text-foreground transition-colors" title="Paragraph"><Type className="h-4 w-4" /></button>
                <button type="button" onClick={() => addBlock("heading", index)} className="hidden md:block p-1.5 hover:bg-accent rounded-full text-muted-foreground hover:text-foreground transition-colors" title="Heading"><Heading className="h-4 w-4" /></button>
                <button type="button" onClick={() => addBlock("image", index)} className="hidden md:block p-1.5 hover:bg-accent rounded-full text-muted-foreground hover:text-foreground transition-colors" title="Image"><ImageIcon className="h-4 w-4" /></button>
                <button type="button" onClick={() => addBlock("quote", index)} className="hidden md:block p-1.5 hover:bg-accent rounded-full text-muted-foreground hover:text-foreground transition-colors" title="Quote"><Quote className="h-4 w-4" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Fallback add block at bottom if array is very small */}
      {blocks.length < 3 && (
        <div className="flex justify-center pt-4">
           <button 
             type="button" 
             onClick={() => addBlock("paragraph", blocks.length - 1)}
             className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors border border-dashed border-border hover:border-primary/50 px-6 py-2 rounded-full"
           >
             <Plus className="h-4 w-4" />
             Add New Block
           </button>
        </div>
      )}
    </div>
  );
}
