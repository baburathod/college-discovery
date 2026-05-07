import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

export const dynamic = "force-dynamic";

const querySchema = z.object({
  search: z.string().optional(),
  location: z.string().optional(),
  course: z.string().optional(),
  sort: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(9),
});

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = Object.fromEntries(searchParams.entries());
    
    // Validate inputs
    const parsed = querySchema.safeParse(query);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid query parameters" }, { status: 400 });
    }
    const { search, location, course, sort, page, limit } = parsed.data;

    // Build Prisma Where Clause dynamically
    const where: any = {};
    
    if (search) {
      where.name = { contains: search, mode: "insensitive" };
    }
    if (location && location !== "all") {
      where.location = { equals: location, mode: "insensitive" };
    }
    if (course && course !== "all") {
      where.courses = {
        some: {
          name: { contains: course, mode: "insensitive" },
        },
      };
    }

    // Determine Sort Order
    let orderBy: any = { rating: "desc" }; // default sort
    if (sort === "fees-asc") orderBy = { fees: "asc" };
    if (sort === "fees-desc") orderBy = { fees: "desc" };
    if (sort === "rating-desc") orderBy = { rating: "desc" };

    const skip = (page - 1) * limit;

    // Fetch total count and items concurrently
    const [total, colleges] = await Promise.all([
      prisma.college.count({ where }),
      prisma.college.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          slug: true,
          location: true,
          rating: true,
          fees: true,
          imageUrl: true,
          averagePackage: true,
          type: true,
        },
      }),
    ]);

    // Unique locations for filters (can be optimized or hardcoded, but dynamic is better)
    // In production, this might be a separate API or cached.
    const locations = await prisma.college.findMany({
      select: { location: true },
      distinct: ['location'],
    });

    return NextResponse.json({
      data: colleges,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      filters: {
        locations: locations.map(l => l.location).sort(),
      }
    });

  } catch (error) {
    console.error("GET /api/colleges error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
