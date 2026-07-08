import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { postId } = await request.json();

    if (!postId) {
      return NextResponse.json({ error: "Missing postId" }, { status: 400 });
    }

    // Connect to Prisma to update post view counts and insert a new view record
    const prisma = (await import('@/lib/prisma')).default;
    await prisma.$transaction([
      prisma.post.update({
        where: { id: postId },
        data: { views: { increment: 1 } }
      }),
      prisma.postView.create({
        data: { post_id: postId }
      })
    ]);

    return NextResponse.json({ success: true, postId });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
