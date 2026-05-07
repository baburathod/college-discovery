import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify ownership before deleting
    const comparison = await prisma.savedComparison.findUnique({
      where: { id: params.id },
    });

    if (!comparison || comparison.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden or Not Found" }, { status: 403 });
    }

    await prisma.savedComparison.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Comparison deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("DELETE /api/saved/comparison error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
