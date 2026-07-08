import prisma from "@/lib/prisma";
import { ShieldCheck } from "lucide-react";
import { notFound } from "next/navigation";

export const revalidate = 60;

export default async function PrivacyPage() {
  const page = await prisma.sitePage.findUnique({
    where: { slug: "privacy" }
  });

  if (!page) {
    notFound();
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="flex items-center gap-4 mb-8">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
          <ShieldCheck className="h-6 w-6 text-primary" />
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight">{page.title}</h1>
      </div>
      
      <div 
        className="prose prose-lg dark:prose-invert max-w-none 
          prose-headings:font-extrabold prose-headings:tracking-tight
          prose-a:text-primary prose-a:no-underline hover:prose-a:underline
          [&_*]:!font-sans"
        dangerouslySetInnerHTML={{ __html: page.content }} 
      />
    </div>
  );
}
