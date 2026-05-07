"use client";

import Link from "next/link";
import { Star, MapPin, IndianRupee, Briefcase, Scale } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCompareStore } from "@/store/compare-store";

export interface College {
  id: string;
  name: string;
  slug: string;
  location: string;
  rating: number;
  fees: number | null;
  averagePackage: number | null;
  imageUrl: string | null;
  type: string | null;
}

export function CollegeCard({ college }: { college: College }) {
  const { colleges, addCollege, removeCollege } = useCompareStore();
  const isComparing = colleges.some(c => c.id === college.id);

  return (
    <div className="group overflow-hidden rounded-xl border bg-card text-card-foreground shadow transition-all hover:shadow-md flex flex-col h-full">
      <div className="relative h-48 w-full overflow-hidden bg-muted">
        {college.imageUrl ? (
          <img
            src={college.imageUrl}
            alt={college.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground">
            No Image
          </div>
        )}
        <div className="absolute right-2 top-2 rounded-md bg-background/90 px-2 py-1 text-xs font-semibold shadow-sm backdrop-blur">
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-primary text-primary" />
            <span>{college.rating.toFixed(1)}</span>
          </div>
        </div>
        {college.type && (
          <div className="absolute left-2 top-2 rounded-md bg-primary/90 px-2 py-1 text-xs font-semibold text-primary-foreground shadow-sm backdrop-blur">
            {college.type}
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-semibold text-lg leading-tight line-clamp-2 mb-2">
          {college.name}
        </h3>
        
        <div className="flex items-center gap-1 text-sm text-muted-foreground mb-4">
          <MapPin className="h-3 w-3" />
          <span>{college.location}</span>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-auto mb-5 text-sm border-t pt-4">
          <div className="flex flex-col gap-1">
            <span className="text-muted-foreground text-xs font-medium uppercase tracking-wider">Fees / Yr</span>
            <div className="flex items-center font-semibold">
              <IndianRupee className="h-3 w-3 mr-1" />
              <span>{college.fees ? (college.fees / 100000).toFixed(1) + 'L' : 'N/A'}</span>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-muted-foreground text-xs font-medium uppercase tracking-wider">Avg Pkg</span>
            <div className="flex items-center font-semibold">
              <Briefcase className="h-3 w-3 mr-1" />
              <span>{college.averagePackage ? college.averagePackage + ' LPA' : 'N/A'}</span>
            </div>
          </div>
        </div>

        <div className="mt-auto flex flex-col gap-2">
          <Link href={`/colleges/${college.slug}`} className="w-full">
            <Button className="w-full" variant="outline">
              View Details
            </Button>
          </Link>
          <Button 
            className="w-full text-xs" 
            variant={isComparing ? "secondary" : "ghost"}
            size="sm"
            onClick={() => isComparing ? removeCollege(college.id) : addCollege({
              id: college.id,
              name: college.name,
              slug: college.slug,
              imageUrl: college.imageUrl
            })}
          >
            <Scale className="mr-2 h-3 w-3" />
            {isComparing ? "Remove from Compare" : "Add to Compare"}
          </Button>
        </div>
      </div>
    </div>
  );
}
