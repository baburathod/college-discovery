import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const locations = ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Pune"];
const types = ["Public", "Private"];

async function main() {
  console.log("Seeding database with mock colleges...");

  // Generate 30 mock colleges
  for (let i = 1; i <= 30; i++) {
    const location = locations[Math.floor(Math.random() * locations.length)];
    const isPublic = Math.random() > 0.5;
    
    // Randomize fees and packages
    const baseFees = Math.floor(Math.random() * 500000) + 50000;
    const averagePackage = Math.floor(Math.random() * 10) + 4; // 4 to 14 LPA
    
    const college = await prisma.college.upsert({
      where: { slug: `mock-college-${i}` },
      update: {},
      create: {
        name: `Institute of Technology & Management ${i}`,
        slug: `mock-college-${i}`,
        location: location,
        establishedYear: 1950 + Math.floor(Math.random() * 70),
        type: isPublic ? "Public" : "Private",
        overview: `A premier institute located in ${location}, known for excellence in education and strong industry connections.`,
        rating: Math.round((3.5 + Math.random() * 1.5) * 10) / 10, // 3.5 to 5.0
        placements: `${80 + Math.floor(Math.random() * 20)}%`,
        averagePackage: averagePackage,
        highestPackage: averagePackage + Math.floor(Math.random() * 20) + 10,
        fees: baseFees,
        imageUrl: `https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=800`,
        courses: {
          create: [
            {
              name: "B.Tech Computer Science",
              duration: "4 Years",
              fees: baseFees * 1.2,
            },
            {
              name: "B.Tech Mechanical",
              duration: "4 Years",
              fees: baseFees * 0.9,
            },
            {
              name: "MBA",
              duration: "2 Years",
              fees: baseFees * 1.5,
            }
          ]
        }
      },
    });

    console.log(`Created college: ${college.name}`);
  }

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
