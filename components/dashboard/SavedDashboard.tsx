"use client";

import { useState } from "react";
import { toast } from "sonner";
import { CollegeCard, type College } from "@/components/colleges/CollegeCard";
import { Button } from "@/components/ui/button";
import { Trash2, ExternalLink } from "lucide-react";
import { EmptyState } from "@/components/shared/EmptyState";
import { useRouter } from "next/navigation";
import { useCompareStore } from "@/store/compare-store";

export function SavedDashboard({
  initialSavedColleges,
  initialSavedComparisons,
}: {
  initialSavedColleges: any[];
  initialSavedComparisons: any[];
}) {
  const router = useRouter();
  const { clearCompare, addCollege } = useCompareStore();
  
  const [savedColleges, setSavedColleges] = useState(initialSavedColleges);
  const [savedComparisons, setSavedComparisons] = useState(initialSavedComparisons);

  const handleUnsaveCollege = async (collegeId: string) => {
    const previous = [...savedColleges];
    setSavedColleges(prev => prev.filter(sc => sc.college.id !== collegeId));
    toast.success("College unsaved");

    try {
      const res = await fetch(`/api/saved/college/${collegeId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to unsave");
    } catch (error) {
      toast.error("Failed to unsave. Rolling back.");
      setSavedColleges(previous);
    }
  };

  const handleDeleteComparison = async (id: string) => {
    const previous = [...savedComparisons];
    setSavedComparisons(prev => prev.filter(c => c.id !== id));
    toast.success("Comparison deleted");

    try {
      const res = await fetch(`/api/saved/comparison/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete comparison");
    } catch (error) {
      toast.error("Failed to delete. Rolling back.");
      setSavedComparisons(previous);
    }
  };

  const handleResumeComparison = async (collegeIds: string[]) => {
    try {
      clearCompare();
      // We need to fetch the basic details to hydrate the store properly
      const res = await fetch(`/api/compare?ids=${collegeIds.join(",")}`);
      if (!res.ok) throw new Error("Failed to resume comparison");
      const { data } = await res.json();
      
      data.forEach((c: any) => {
        addCollege({ id: c.id, name: c.name, slug: c.slug, imageUrl: c.imageUrl });
      });
      
      router.push("/compare");
    } catch (error) {
      toast.error("Error resuming comparison");
    }
  };

  return (
    <div className="space-y-12 mt-8">
      {/* Saved Colleges */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Saved Colleges</h2>
        {savedColleges.length === 0 ? (
          <div className="rounded-xl border bg-card shadow-sm">
            <EmptyState 
              title="No saved colleges" 
              description="Colleges you save will appear here for easy access later."
              actionLabel="Browse Colleges"
              onAction={() => router.push("/colleges")}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedColleges.map((sc) => (
              <div key={sc.id} className="relative group">
                <CollegeCard college={sc.college} />
                <button 
                  onClick={() => handleUnsaveCollege(sc.college.id)}
                  className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-destructive/90"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Saved Comparisons */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Saved Comparisons</h2>
        {savedComparisons.length === 0 ? (
          <div className="rounded-xl border bg-card shadow-sm">
            <EmptyState 
              title="No saved comparisons" 
              description="Save a comparison to quickly resume evaluating options later."
              actionLabel="Go to Compare"
              onAction={() => router.push("/compare")}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedComparisons.map((comp) => (
              <div key={comp.id} className="rounded-xl border bg-card p-6 shadow-sm flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-lg">{comp.name || "Custom Comparison"}</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Saved on {new Date(comp.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="text-muted-foreground hover:text-destructive -mt-2 -mr-2"
                    onClick={() => handleDeleteComparison(comp.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {comp.collegeIds.map((id: string, idx: number) => (
                    <span key={id} className="text-xs font-medium bg-muted px-2 py-1 rounded">
                      College {idx + 1}
                    </span>
                  ))}
                </div>

                <div className="mt-auto">
                  <Button 
                    className="w-full" 
                    variant="outline"
                    onClick={() => handleResumeComparison(comp.collegeIds)}
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Resume Comparison
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
