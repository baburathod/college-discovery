import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const idsParam = searchParams.get("ids");
    
    if (!idsParam) {
      return NextResponse.json({ error: "Missing ids parameter" }, { status: 400 });
    }

    const ids = idsParam.split(",").map(id => id.trim()).filter(Boolean);
    
    if (ids.length === 0) {
      return NextResponse.json({ data: [] });
    }
    
    if (ids.length > 3) {
      return NextResponse.json({ error: "Maximum 3 colleges can be compared" }, { status: 400 });
    }

    const colleges = await prisma.college.findMany({
      where: {
        id: { in: ids }
      },
      include: {
        courses: true
      }
    });

    // Ensure the order matches the requested ids
    const sortedColleges = ids.map(id => colleges.find(c => c.id === id)).filter(Boolean);

    return NextResponse.json({ data: sortedColleges });
    
  } catch (error) {
    console.error("GET /api/compare error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
