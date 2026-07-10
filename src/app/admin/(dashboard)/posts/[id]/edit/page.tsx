import { Save, Image as ImageIcon, LayoutTemplate, Send, Eye } from "lucide-react";
import prisma from "@/lib/prisma";
import { updatePost } from "@/app/actions/posts";
import { notFound } from "next/navigation";
import BlockBuilder from "@/components/admin/BlockBuilder";
import CoverImageInput from "@/components/admin/CoverImageInput";
import CategorySelect from "@/components/admin/CategorySelect";

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const post = await prisma.post.findUnique({
    where: { id },
    include: { categories: true }
  });

  if (!post) {
    notFound();
  }

  const categories = await prisma.category.findMany();

  return (
    <form action={async (formData) => {
      "use server";
      const content = formData.get("content") as string;
      await updatePost(post.id, formData, content);
    }} className="flex-1 flex flex-col h-[calc(100vh-64px)] overflow-hidden">
      
      <header className="h-16 border-b bg-card flex items-center justify-between px-8 shrink-0">
        <h1 className="text-xl font-bold tracking-tight">Edit Article</h1>
        <div className="flex items-center gap-3">
          <button type="submit" className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors">
            <Save className="h-4 w-4" />
            Save Changes
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          
          <div className="space-y-4">
            <input
              type="text"
              name="title"
              defaultValue={post.title}
              required
              placeholder="Article Title..."
              className="w-full text-4xl md:text-5xl font-extrabold bg-transparent border-none outline-none placeholder:text-muted-foreground/50 focus:ring-0 px-0"
            />
            <div className="flex flex-wrap gap-4">
              <CategorySelect initialCategories={categories} defaultValues={post.categories.map((c: any) => c.id)} />
              <select name="status" defaultValue={post.status} className="bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary">
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <input type="checkbox" id="is_featured" name="is_featured" defaultChecked={post.is_featured} className="rounded border-border" />
              <label htmlFor="is_featured" className="text-sm font-medium">Feature this post</label>
            </div>
          </div>

          <CoverImageInput defaultValue={post.cover_image_url || ""} />

          <div className="pt-4 border-t border-border mt-4">
            <h3 className="text-lg font-bold mb-4">Article Content</h3>
            <BlockBuilder name="content" defaultValue={post.content} />
          </div>

          {/* SEO Metadata Section */}
          <div className="border border-border rounded-xl bg-card shadow-sm p-6 space-y-4">
            <h3 className="font-bold border-b pb-2">SEO & Metadata</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Slug URL</label>
                <input 
                  type="text" 
                  name="slug"
                  defaultValue={post.slug}
                  required
                  placeholder="my-new-article"
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
