import React from "react";
import { PostBlock } from "@/components/admin/BlockBuilder";

interface BlockRendererProps {
  content: string;
  adNode?: React.ReactNode;
}

export function BlockRenderer({ content, adNode }: BlockRendererProps) {
  let blocks: PostBlock[] = [];
  let isJson = false;

  try {
    const parsed = JSON.parse(content);
    if (Array.isArray(parsed)) {
      blocks = parsed;
      isJson = true;
    }
  } catch (e) {
    // Not JSON, fallback to raw HTML
  }

  if (!isJson) {
    // Backwards compatibility for old TinyMCE HTML content
    return <div dangerouslySetInnerHTML={{ __html: content }} />;
  }

  return (
    <div className="space-y-6 flex flex-col">
      {blocks.map((block, index) => {
        let renderedBlock = null;
        switch (block.type) {
          case "paragraph":
            renderedBlock = (
              <p 
                key={block.id} 
                className="whitespace-pre-wrap leading-relaxed text-lg text-foreground/90 [&_a]:text-primary [&_a]:underline [&_a]:cursor-pointer hover:[&_a]:text-primary/80"
                dangerouslySetInnerHTML={{ __html: block.content || "" }}
              />
            );
            break;
          
          case "heading": {
            const level = block.level || 2;
            const className = `font-extrabold tracking-tight mt-10 mb-4 [&_a]:text-primary [&_a]:underline hover:[&_a]:text-primary/80 ${
              level === 1 ? "text-4xl" : level === 2 ? "text-3xl" : "text-2xl"
            }`;
            
            if (level === 1) renderedBlock = <h1 key={block.id} className={className} dangerouslySetInnerHTML={{ __html: block.content || "" }} />;
            else if (level === 3) renderedBlock = <h3 key={block.id} className={className} dangerouslySetInnerHTML={{ __html: block.content || "" }} />;
            else renderedBlock = <h2 key={block.id} className={className} dangerouslySetInnerHTML={{ __html: block.content || "" }} />;
            break;
          }
          
          case "image":
            renderedBlock = (
              <figure key={block.id} className="my-10 flex flex-col items-center">
                <img 
                  src={block.url} 
                  alt={block.alt || block.caption || "Article image"} 
                  className="rounded-2xl shadow-xl w-full max-h-[700px] object-cover"
                />
                {(block.caption || block.credit) && (
                  <figcaption className="mt-3 text-sm text-muted-foreground text-center flex flex-col items-center gap-1">
                    {block.caption && <span className="italic">{block.caption}</span>}
                    {block.credit && <span className="text-xs opacity-75">Credit: {block.credit}</span>}
                  </figcaption>
                )}
              </figure>
            );
            break;
            
          case "quote":
            renderedBlock = (
              <blockquote 
                key={block.id} 
                className="my-8 border-l-4 border-primary bg-card/50 rounded-r-xl py-4 px-6 md:px-8 italic text-xl md:text-2xl text-foreground/80 leading-relaxed shadow-sm [&_a]:text-primary [&_a]:underline hover:[&_a]:text-primary/80"
                dangerouslySetInnerHTML={{ __html: `"${block.content || ""}"` }}
              />
            );
            break;
            
          default:
            renderedBlock = null;
        }

        // Inject ad in the middle of the post (after half the blocks)
        const middleIndex = Math.floor(blocks.length / 2);
        if (adNode && index === middleIndex) {
          return (
            <React.Fragment key={block.id + "-wrapper"}>
              {renderedBlock}
              <div className="my-10 not-prose">
                {adNode}
              </div>
            </React.Fragment>
          );
        }

        return renderedBlock;
      })}
    </div>
  );
}
