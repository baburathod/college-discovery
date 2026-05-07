import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Star, MapPin, Building, Briefcase } from "lucide-react";
import { CoursesSection } from "@/components/colleges/CoursesSection";
import { ReviewsSection } from "@/components/colleges/ReviewsSection";
import { ActionPanel } from "@/components/colleges/ActionPanel";
import { CollegeCard } from "@/components/colleges/CollegeCard";

// Using RSC to fetch data securely and efficiently
async function getCollege(slug: string) {
  const college = await prisma.college.findUnique({
    where: { slug },
    include: {
      courses: true,
      reviews: {
        include: { user: { select: { name: true, image: true } } },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!college) return null;

  const relatedColleges = await prisma.college.findMany({
    where: {
      location: college.location,
      id: { not: college.id },
    },
    take: 3,
  });

  return { college, relatedColleges };
}

export default async function CollegeDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const data = await getCollege(params.slug);

  if (!data) {
    notFound();
  }

  const { college, relatedColleges } = data;

  return (
    <div className="container py-10">
      {/* Hero Section */}
      <div className="relative w-full h-[300px] md:h-[400px] rounded-2xl overflow-hidden mb-8 shadow-sm">
        {college.imageUrl ? (
          <img
            src={college.imageUrl}
            alt={college.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground">
            No Image Available
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        
        <div className="absolute bottom-0 left-0 p-6 md:p-10 w-full text-white">
          <div className="flex items-center gap-2 mb-3">
            <span className="bg-primary px-3 py-1 text-xs font-semibold rounded-md shadow-sm">
              {college.type || "Institution"}
            </span>
            <div className="flex items-center bg-white/20 backdrop-blur-md px-3 py-1 rounded-md text-xs font-semibold">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
              <span>{college.rating.toFixed(1)}</span>
            </div>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-2">
            {college.name}
          </h1>
          <div className="flex items-center text-sm md:text-base opacity-90 font-medium">
            <MapPin className="h-4 w-4 mr-1" />
            <span>{college.location}</span>
            {college.establishedYear && (
              <>
                <span className="mx-3">•</span>
                <Building className="h-4 w-4 mr-1" />
                <span>Est. {college.establishedYear}</span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-12">
          {/* Overview */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold border-b pb-2">Overview</h2>
            <p className="text-muted-foreground leading-relaxed">
              {college.overview}
            </p>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
              <div className="flex flex-col p-4 bg-muted/50 rounded-lg text-center">
                <span className="text-2xl font-bold text-primary">
                  {college.placements || "N/A"}
                </span>
                <span className="text-xs text-muted-foreground uppercase font-medium mt-1">Placement Rate</span>
              </div>
              <div className="flex flex-col p-4 bg-muted/50 rounded-lg text-center">
                <span className="text-2xl font-bold text-primary">
                  {college.averagePackage ? `${college.averagePackage} LPA` : "N/A"}
                </span>
                <span className="text-xs text-muted-foreground uppercase font-medium mt-1">Avg Package</span>
              </div>
              <div className="flex flex-col p-4 bg-muted/50 rounded-lg text-center">
                <span className="text-2xl font-bold text-primary">
                  {college.highestPackage ? `${college.highestPackage} LPA` : "N/A"}
                </span>
                <span className="text-xs text-muted-foreground uppercase font-medium mt-1">Highest Package</span>
              </div>
              <div className="flex flex-col p-4 bg-muted/50 rounded-lg text-center">
                <span className="text-2xl font-bold text-primary">
                  {college.courses.length}
                </span>
                <span className="text-xs text-muted-foreground uppercase font-medium mt-1">Total Courses</span>
              </div>
            </div>
          </section>

          {/* Courses */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold border-b pb-2">Offered Courses</h2>
            <CoursesSection courses={college.courses} />
          </section>

          {/* Reviews */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold border-b pb-2">Student Reviews</h2>
            <ReviewsSection reviews={college.reviews} />
          </section>
        </div>

        {/* Sidebar Actions */}
        <div className="lg:col-span-1">
          <ActionPanel 
            collegeId={college.id} 
            collegeName={college.name} 
            collegeSlug={college.slug}
            collegeImage={college.imageUrl}
          />
        </div>
      </div>

      {/* Related Colleges */}
      {relatedColleges.length > 0 && (
        <div className="mt-20 pt-10 border-t">
          <h2 className="text-2xl font-bold mb-6">Similar Colleges in {college.location}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedColleges.map((rc) => (
              <CollegeCard key={rc.id} college={rc} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
