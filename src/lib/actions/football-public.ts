"use server";

import prisma from "@/lib/prisma";

export async function getMatchData(fixture_id: string) {
  const fixture = await prisma.fixture.findUnique({
    where: { id: fixture_id },
    include: {
      home_team: true,
      away_team: true,
      league: true,
      events: {
        orderBy: { minute: 'desc' }
      }
    }
  });

  return fixture;
}

export async function getMatchCommentary(fixture_id: string) {
  return prisma.matchCommentary.findMany({
    where: { fixture_id },
    orderBy: { created_at: 'desc' },
    take: 100,
  });
}
