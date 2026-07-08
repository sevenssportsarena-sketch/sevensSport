import prisma from "./src/lib/prisma";

async function main() {
  let sport = await prisma.sport.findFirst({ where: { slug: "general" } });
  if (!sport) {
    sport = await prisma.sport.create({
      data: { name: "General", slug: "general" }
    });
  }

  const categories = [
    { name: "Athletics", slug: "athletics" },
    { name: "Champions League", slug: "champions-league" },
    { name: "Formula 1", slug: "formula-1" },
    { name: "Tennis", slug: "tennis" },
    { name: "Boxing", slug: "boxing" },
    { name: "NFL", slug: "nfl" },
    { name: "European Football", slug: "european-football" },
    { name: "Nigerian Football", slug: "nigerian-football" },
    { name: "NBA", slug: "nba" },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: {
        name: cat.name,
        slug: cat.slug,
        sport_id: sport.id
      }
    });
    console.log(`Ensured category: ${cat.name}`);
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    // disconnect might fail with custom adapter but it's fine
  });
