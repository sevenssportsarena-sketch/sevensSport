import prisma from '../src/lib/prisma'

const mockPosts = [
  {
    category: { name: "World Cup", slug: "world-cup" },
    post: {
      title: "Canada Makes History: Advances to Last 16 with Dramatic 92nd-Minute Winner",
      slug: "canada-advances-last-16-dramatic-winner",
      content: "<p>In an unforgettable night at the 2026 FIFA World Cup, co-hosts Canada secured their spot in the Round of 16 after a breathtaking 1-0 victory over South Africa. Stephen Eustaquio became the national hero, netting the crucial goal in the 92nd minute to send the home crowd into a frenzy.</p>",
      status: "published",
      is_featured: true
    }
  },
  {
    category: { name: "Transfers", slug: "transfers" },
    post: {
      title: "Chelsea's £8m Bid for Granit Xhaka Rejected by Sunderland",
      slug: "chelsea-8m-bid-granit-xhaka-rejected",
      content: "<p>Chelsea's pursuit of veteran experience has hit a stumbling block as Sunderland officially rejected their initial £8 million offer for midfielder Granit Xhaka. The Blues are expected to return with an improved offer as they look to bolster their midfield options for the upcoming season.</p>",
      status: "published",
      is_featured: false
    }
  },
  {
    category: { name: "MLS", slug: "mls" },
    post: {
      title: "Robert Lewandowski Reaches Agreement with Chicago Fire",
      slug: "robert-lewandowski-chicago-fire-agreement",
      content: "<p>Major League Soccer is set to welcome another global superstar. Polish striker Robert Lewandowski has reportedly agreed to terms with the Chicago Fire as a free agent following the expiration of his contract with Barcelona. The move marks a significant coup for the MLS side.</p>",
      status: "published",
      is_featured: true
    }
  },
  {
    category: { name: "Managerial Changes", slug: "managerial-changes" },
    post: {
      title: "Saudi Arabia FA President Resigns After World Cup Exit",
      slug: "saudi-arabia-fa-president-resigns",
      content: "<p>Following a disappointing group-stage exit at the 2026 World Cup, Yasser Al-Misehal, the president of the Saudi Arabian Football Federation, has stepped down. In a public statement, Al-Misehal took full responsibility for the national team's underperformance on the global stage.</p>",
      status: "published",
      is_featured: false
    }
  },
  {
    category: { name: "La Liga", slug: "la-liga" },
    post: {
      title: "Barcelona Exploring Sensational Deal for Harry Kane",
      slug: "barcelona-exploring-deal-harry-kane",
      content: "<p>FC Barcelona is closely monitoring Harry Kane's situation, with reports suggesting the Catalan giants are preparing a major bid for the England captain. Formal talks are expected to commence once England's World Cup campaign reaches its conclusion.</p>",
      status: "published",
      is_featured: true
    }
  },
  {
    category: { name: "Premier League", slug: "premier-league" },
    post: {
      title: "Arsenal Strengthen Defense with Piero Hincapie Signing",
      slug: "arsenal-sign-piero-hincapie",
      content: "<p>Arsenal have finalized the signing of highly-rated defender Piero Hincapie. The addition is seen as a key move by the Gunners to solidify their backline ahead of a demanding Premier League and Champions League campaign.</p>",
      status: "published",
      is_featured: false
    }
  },
  {
    category: { name: "Serie A", slug: "serie-a" },
    post: {
      title: "Juventus Announce Pre-Season Tour Dates in North America",
      slug: "juventus-announce-pre-season-tour",
      content: "<p>Juventus have confirmed they will return to North America for their pre-season preparations. The Italian giants will face off against several top-tier European clubs in exhibition matches across the United States and Canada this August.</p>",
      status: "draft",
      is_featured: false
    }
  },
  {
    category: { name: "Champions League", slug: "champions-league" },
    post: {
      title: "UEFA Reveals New Format Details for Upcoming Season",
      slug: "uefa-reveals-new-format-details",
      content: "<p>UEFA has officially released the detailed scheduling and format tweaks for the upcoming Champions League season. The modifications aim to increase high-stakes matchups in the group phase, promising an exciting tournament for fans worldwide.</p>",
      status: "published",
      is_featured: false
    }
  },
  {
    category: { name: "Ligue 1", slug: "ligue-1" },
    post: {
      title: "PSG Target Midfield Reinforcements as Transfer Window Heats Up",
      slug: "psg-target-midfield-reinforcements",
      content: "<p>Paris Saint-Germain are aggressively pursuing new midfield options after identifying vulnerabilities in the center of the park last season. Several high-profile targets are reportedly on the Parisian club's shortlist as they aim for domestic and European dominance.</p>",
      status: "draft",
      is_featured: false
    }
  },
  {
    category: { name: "International Football", slug: "international-football" },
    post: {
      title: "South Korea Manager Steps Down Following Elimination",
      slug: "south-korea-manager-steps-down",
      content: "<p>In the wake of South Korea's early exit from the 2026 World Cup, manager Myung-Bo Hong has officially resigned from his position. The national federation has already begun the search for his successor to lead the team in upcoming Asian Cup qualifiers.</p>",
      status: "published",
      is_featured: false
    }
  }
]

async function main() {
  console.log("Starting database seeding...")

  // Ensure "Football" sport exists
  let sport = await prisma.sport.findFirst({ where: { name: 'Football' } })
  if (!sport) {
    sport = await prisma.sport.create({
      data: {
        name: 'Football',
        slug: 'football'
      }
    })
    console.log("Created sport: Football")
  }

  for (const item of mockPosts) {
    // Upsert Category
    const category = await prisma.category.upsert({
      where: { slug: item.category.slug },
      update: {},
      create: {
        name: item.category.name,
        slug: item.category.slug,
        sport_id: sport.id
      }
    })
    
    const existingPost = await prisma.post.findUnique({
      where: { slug: item.post.slug }
    })
    
    if (!existingPost) {
      // Insert post using a random valid UUID for author_id since it's just mock data
      const dummyAuthorId = '00000000-0000-0000-0000-000000000000'
      await prisma.post.create({
        data: {
          title: item.post.title,
          slug: item.post.slug,
          content: item.post.content,
          status: item.post.status as any,
          is_featured: item.post.is_featured,
          categories: { connect: { id: category.id } },
          author_id: dummyAuthorId
        }
      })
      console.log(`Created post: ${item.post.title}`)
    } else {
      console.log(`Post already exists: ${item.post.title}`)
    }
  }

  console.log("Seeding finished.")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
