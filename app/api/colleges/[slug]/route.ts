import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params.slug;

    if (!slug) {
      return NextResponse.json({ error: "Missing college slug" }, { status: 400 });
    }

    const college = await prisma.college.findUnique({
      where: { slug },
      include: {
        courses: true,
        reviews: {
          include: {
            user: {
              select: { name: true, image: true },
            },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!college) {
      return NextResponse.json({ error: "College not found" }, { status: 404 });
    }

    // Fetch related colleges in the same location
    const relatedColleges = await prisma.college.findMany({
      where: {
        location: college.location,
        id: { not: college.id },
      },
      take: 3,
      select: {
        id: true,
        name: true,
        slug: true,
        location: true,
        imageUrl: true,
        rating: true,
        fees: true,
      },
    });

    return NextResponse.json({
      data: {
        ...college,
        relatedColleges,
      },
    });
  } catch (error) {
    console.error("GET /api/colleges/[slug] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
