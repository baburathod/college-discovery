import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { collegeIds, name } = await req.json();
    if (!collegeIds || !Array.isArray(collegeIds) || collegeIds.length < 2) {
      return NextResponse.json({ error: "Invalid comparison data" }, { status: 400 });
    }

    const saved = await prisma.savedComparison.create({
      data: {
        userId: session.user.id,
        collegeIds: collegeIds,
        name: name || "Saved Comparison",
      },
    });

    return NextResponse.json({ data: saved }, { status: 201 });
  } catch (error) {
    console.error("POST /api/saved/comparison error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
