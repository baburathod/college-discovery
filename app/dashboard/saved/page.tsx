import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { SavedDashboard } from "@/components/dashboard/SavedDashboard";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const [savedColleges, savedComparisons] = await Promise.all([
    prisma.savedCollege.findMany({
      where: { userId: session.user.id },
      include: { college: true },
      orderBy: { createdAt: "desc" }
    }),
    prisma.savedComparison.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" }
    })
  ]);

  return (
    <div className="container py-10">
      <div className="flex flex-col space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {session.user?.name || "User"}. Manage your saved colleges and comparisons here.
        </p>

        <SavedDashboard 
          initialSavedColleges={savedColleges}
          initialSavedComparisons={savedComparisons}
        />
      </div>
    </div>
  );
}
