"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createLeague(data: { name: string, season: string, logo_url?: string }) {
  const league = await prisma.league.create({
    data
  });
  revalidatePath("/admin/leagues");
  revalidatePath("/football/standings");
  return league;
}

export async function createTeam(data: { name: string, short_name: string, manager?: string, year_founded?: string, stadium?: string, logo_url?: string }) {
  const team = await prisma.team.create({
    data
  });
  revalidatePath("/admin/teams");
  return team;
}

export async function assignTeamToLeague(league_id: string, team_id: string) {
  const existing = await prisma.leagueTeam.findUnique({
    where: {
      league_id_team_id: { league_id, team_id }
    }
  });

  if (existing) return existing;

  const record = await prisma.leagueTeam.create({
    data: {
      league_id,
      team_id
    }
  });
  // Initialize standing
  await prisma.standing.create({
    data: {
      league_id,
      team_id
    }
  });
  revalidatePath(`/admin/leagues`);
  return record;
}

export async function createFixture(data: { league_id: string, home_team_id: string, away_team_id: string, date: Date }) {
  const fixture = await prisma.fixture.create({
    data: {
      ...data,
      status: "scheduled"
    }
  });
  revalidatePath("/admin/fixtures");
  revalidatePath("/football/fixtures");
  return fixture;
}

export async function updateLeague(id: string, data: { name?: string, season?: string, logo_url?: string, is_active?: boolean }) {
  const league = await prisma.league.update({
    where: { id },
    data
  });
  revalidatePath("/admin/leagues");
  revalidatePath("/football/standings");
  return league;
}

export async function updateTeam(id: string, data: { name?: string, short_name?: string, manager?: string, year_founded?: string, stadium?: string, logo_url?: string }) {
  const team = await prisma.team.update({
    where: { id },
    data
  });
  revalidatePath("/admin/teams");
  return team;
}

export async function updateFixture(id: string, data: { league_id?: string, home_team_id?: string, away_team_id?: string, date?: Date }) {
  const fixture = await prisma.fixture.update({
    where: { id },
    data
  });
  revalidatePath("/admin/fixtures");
  revalidatePath("/football/fixtures");
  return fixture;
}

export async function updateMatchStatus(fixture_id: string, status: "scheduled" | "live" | "finished" | "postponed") {
  const fixture = await prisma.fixture.update({
    where: { id: fixture_id },
    data: { status }
  });

  if (status === "finished") {
    await updateStandingsAfterMatch(fixture_id);
  }

  revalidatePath(`/admin/fixtures/${fixture_id}/live`);
  revalidatePath(`/match/${fixture_id}`);
  return fixture;
}

export async function updateMatchScore(fixture_id: string, home_score: number, away_score: number, minute?: string) {
  const fixture = await prisma.fixture.update({
    where: { id: fixture_id },
    data: { home_score, away_score, minute }
  });
  revalidatePath(`/admin/fixtures/${fixture_id}/live`);
  revalidatePath(`/match/${fixture_id}`);
  return fixture;
}

export async function addMatchEvent(data: { fixture_id: string, minute: string, type: any, team_id: string, player: string, details?: string }) {
  const event = await prisma.matchEvent.create({
    data
  });
  revalidatePath(`/admin/fixtures/${data.fixture_id}/live`);
  revalidatePath(`/match/${data.fixture_id}`);
  return event;
}

export async function addCommentary(data: { fixture_id: string, text: string, minute?: string, is_key?: boolean }) {
  const entry = await prisma.matchCommentary.create({ data });
  revalidatePath(`/admin/fixtures/${data.fixture_id}/live`);
  revalidatePath(`/match/${data.fixture_id}`);
  return entry;
}

export async function deleteCommentary(id: string, fixture_id: string) {
  await prisma.matchCommentary.delete({ where: { id } });
  revalidatePath(`/admin/fixtures/${fixture_id}/live`);
  revalidatePath(`/match/${fixture_id}`);
}

async function updateStandingsAfterMatch(fixture_id: string) {
  const fixture = await prisma.fixture.findUnique({
    where: { id: fixture_id }
  });
  if (!fixture || fixture.status !== "finished") return;

  const { league_id, home_team_id, away_team_id, home_score, away_score } = fixture;

  // Process Home Team
  await processTeamStanding(league_id, home_team_id, home_score, away_score);
  // Process Away Team
  await processTeamStanding(league_id, away_team_id, away_score, home_score);
}

async function processTeamStanding(league_id: string, team_id: string, goals_for: number, goals_against: number) {
  const standing = await prisma.standing.findUnique({
    where: {
      league_id_team_id: { league_id, team_id }
    }
  });

  if (!standing) return;

  const won = goals_for > goals_against ? 1 : 0;
  const drawn = goals_for === goals_against ? 1 : 0;
  const lost = goals_for < goals_against ? 1 : 0;
  const points = (won * 3) + (drawn * 1);

  await prisma.standing.update({
    where: { id: standing.id },
    data: {
      played: standing.played + 1,
      won: standing.won + won,
      drawn: standing.drawn + drawn,
      lost: standing.lost + lost,
      goals_for: standing.goals_for + goals_for,
      goals_against: standing.goals_against + goals_against,
      goal_difference: (standing.goals_for + goals_for) - (standing.goals_against + goals_against),
      points: standing.points + points
    }
  });
}
