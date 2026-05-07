"use client";

import { useCompareStore } from "@/store/compare-store";
import { Check, X, Star, IndianRupee, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function CompareTable({ colleges }: { colleges: any[] }) {
  const { removeCollege } = useCompareStore();

  // Highlight logic helpers
  const maxRating = Math.max(...colleges.map(c => c.rating || 0));
  const minFees = Math.min(...colleges.map(c => c.fees || Infinity));
  const maxPackage = Math.max(...colleges.map(c => c.averagePackage || 0));

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left border-collapse min-w-[800px]">
        <thead>
          <tr>
            <th className="p-4 border-b w-1/4 bg-muted/30">Features</th>
            {colleges.map(college => (
              <th key={college.id} className="p-4 border-b w-1/4 align-top">
                <div className="flex flex-col h-full">
                  <div className="flex justify-between items-start mb-2">
                    {college.imageUrl ? (
                      <div className="h-12 w-12 rounded bg-muted overflow-hidden">
                        <img src={college.imageUrl} className="h-full w-full object-cover" alt="" />
                      </div>
                    ) : <div className="h-12 w-12 rounded bg-muted" />}
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => removeCollege(college.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <h3 className="font-semibold text-sm mb-1">{college.name}</h3>
                  <p className="text-xs text-muted-foreground flex items-center mb-4">
                    <MapPin className="h-3 w-3 mr-1" /> {college.location}
                  </p>
                  <Link href={`/colleges/${college.slug}`} className="mt-auto">
                    <Button variant="outline" size="sm" className="w-full text-xs h-8">
                      View College
                    </Button>
                  </Link>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="text-sm">
          {/* Rating Row */}
          <tr className="hover:bg-muted/10">
            <td className="p-4 border-b font-medium bg-muted/30">Rating</td>
            {colleges.map(college => {
              const isBest = college.rating === maxRating && maxRating > 0;
              return (
                <td key={college.id} className={`p-4 border-b ${isBest ? 'bg-primary/5' : ''}`}>
                  <div className="flex items-center">
                    <Star className={`h-4 w-4 mr-1 ${isBest ? 'fill-primary text-primary' : 'text-muted-foreground'}`} />
                    <span className={isBest ? 'font-bold text-primary' : ''}>
                      {college.rating.toFixed(1)}
                    </span>
                    {isBest && <span className="ml-2 text-[10px] uppercase font-bold bg-primary text-primary-foreground px-1.5 py-0.5 rounded">Highest</span>}
                  </div>
                </td>
              )
            })}
          </tr>

          {/* Fees Row */}
          <tr className="hover:bg-muted/10">
            <td className="p-4 border-b font-medium bg-muted/30">Average Fees (Yr)</td>
            {colleges.map(college => {
              const isBest = college.fees === minFees && minFees < Infinity;
              return (
                <td key={college.id} className={`p-4 border-b ${isBest ? 'bg-emerald-500/5' : ''}`}>
                  <div className="flex items-center">
                    <IndianRupee className={`h-4 w-4 mr-1 ${isBest ? 'text-emerald-600' : 'text-muted-foreground'}`} />
                    <span className={isBest ? 'font-bold text-emerald-600' : ''}>
                      {college.fees ? college.fees.toLocaleString() : 'N/A'}
                    </span>
                    {isBest && <span className="ml-2 text-[10px] uppercase font-bold bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded">Lowest</span>}
                  </div>
                </td>
              )
            })}
          </tr>

          {/* Placement Row */}
          <tr className="hover:bg-muted/10">
            <td className="p-4 border-b font-medium bg-muted/30">Placement Rate</td>
            {colleges.map(college => (
              <td key={college.id} className="p-4 border-b">
                {college.placements || 'N/A'}
              </td>
            ))}
          </tr>

          {/* Average Package Row */}
          <tr className="hover:bg-muted/10">
            <td className="p-4 border-b font-medium bg-muted/30">Average Package</td>
            {colleges.map(college => {
              const isBest = college.averagePackage === maxPackage && maxPackage > 0;
              return (
                <td key={college.id} className={`p-4 border-b ${isBest ? 'bg-blue-500/5' : ''}`}>
                  <div className="flex items-center">
                    <span className={isBest ? 'font-bold text-blue-600' : ''}>
                      {college.averagePackage ? `${college.averagePackage} LPA` : 'N/A'}
                    </span>
                    {isBest && <span className="ml-2 text-[10px] uppercase font-bold bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">Best Value</span>}
                  </div>
                </td>
              )
            })}
          </tr>

          {/* Institute Type */}
          <tr className="hover:bg-muted/10">
            <td className="p-4 border-b font-medium bg-muted/30">Institute Type</td>
            {colleges.map(college => (
              <td key={college.id} className="p-4 border-b">
                <span className="bg-muted px-2 py-1 rounded text-xs font-medium">
                  {college.type || 'Private'}
                </span>
              </td>
            ))}
          </tr>
          
          {/* Total Courses */}
          <tr className="hover:bg-muted/10">
            <td className="p-4 border-b font-medium bg-muted/30">Courses Offered</td>
            {colleges.map(college => (
              <td key={college.id} className="p-4 border-b">
                {college.courses?.length || 0} Courses
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
