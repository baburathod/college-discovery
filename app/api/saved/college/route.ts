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

    const { collegeId } = await req.json();
    if (!collegeId) {
      return NextResponse.json({ error: "Missing collegeId" }, { status: 400 });
    }

    // Upsert or create safely, but schema has unique constraint @@unique([userId, collegeId])
    // So we can check or just attempt create and handle error
    const existing = await prisma.savedCollege.findUnique({
      where: {
        userId_collegeId: {
          userId: session.user.id,
          collegeId: collegeId,
        },
      },
    });

    if (existing) {
      return NextResponse.json({ message: "Already saved" }, { status: 200 });
    }

    const saved = await prisma.savedCollege.create({
      data: {
        userId: session.user.id,
        collegeId: collegeId,
      },
    });

    return NextResponse.json({ data: saved }, { status: 201 });
  } catch (error) {
    console.error("POST /api/saved/college error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
