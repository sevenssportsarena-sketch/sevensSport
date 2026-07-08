import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { SitePageEditor } from "./SitePageEditor";

export const revalidate = 0;

export default async function AdminSitePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  
  const sitePage = await prisma.sitePage.findUnique({
    where: { slug }
  });

  if (!sitePage) {
    notFound();
  }

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight">Edit Site Content</h1>
        <p className="text-muted-foreground mt-2">
          Update the content for the <span className="font-semibold text-foreground capitalize">{sitePage.title}</span> page.
        </p>
      </div>

      <SitePageEditor 
        slug={sitePage.slug} 
        title={sitePage.title} 
        initialContent={sitePage.content} 
      />
    </div>
  );
}
