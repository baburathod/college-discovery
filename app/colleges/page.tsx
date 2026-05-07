"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { CollegeCard, type College } from "@/components/colleges/CollegeCard";
import { FilterSidebar } from "@/components/colleges/FilterSidebar";
import { Pagination } from "@/components/colleges/Pagination";
import { CollegeSkeleton } from "@/components/colleges/CollegeSkeleton";
import { EmptyState } from "@/components/shared/EmptyState";
import { useDebounce } from "@/hooks/use-debounce";

export default function CollegesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // State mapping from URL or defaults
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [location, setLocation] = useState(searchParams.get("location") || "all");
  const [course, setCourse] = useState(searchParams.get("course") || "all");
  const [sort, setSort] = useState(searchParams.get("sort") || "rating-desc");
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);

  // Data state
  const [colleges, setColleges] = useState<College[]>([]);
  const [availableLocations, setAvailableLocations] = useState<string[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // Debounce search input to avoid spamming the API
  const debouncedSearch = useDebounce(search, 500);

  // Fetch logic
  const fetchColleges = useCallback(async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      if (debouncedSearch) query.set("search", debouncedSearch);
      if (location !== "all") query.set("location", location);
      if (course !== "all") query.set("course", course);
      query.set("sort", sort);
      query.set("page", page.toString());
      query.set("limit", "9");

      // Update URL for sharable links without refreshing page
      router.replace(`/colleges?${query.toString()}`, { scroll: false });

      const res = await fetch(`/api/colleges?${query.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch colleges");

      const data = await res.json();
      setColleges(data.data);
      setTotalPages(data.meta.totalPages);
      
      // Update locations only if it's empty (first load)
      if (availableLocations.length === 0 && data.filters.locations) {
        setAvailableLocations(data.filters.locations);
      }
    } catch (error) {
      toast.error("Error loading colleges. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, location, course, sort, page]);

  // Trigger fetch when dependencies change
  useEffect(() => {
    fetchColleges();
  }, [fetchColleges]);

  // Reset page to 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, location, course, sort]);

  const handleClearFilters = () => {
    setSearch("");
    setLocation("all");
    setCourse("all");
    setSort("rating-desc");
    setPage(1);
  };

  return (
    <div className="container py-10">
      <div className="flex flex-col space-y-4 mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Explore Colleges</h1>
        <p className="text-muted-foreground">
          Find and compare the best educational institutions tailored to your needs.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-1">
          <div className="sticky top-20">
            <FilterSidebar
              search={search}
              setSearch={setSearch}
              location={location}
              setLocation={setLocation}
              course={course}
              setCourse={setCourse}
              sort={sort}
              setSort={setSort}
              availableLocations={availableLocations}
            />
          </div>
        </div>

        <div className="md:col-span-3 flex flex-col">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <CollegeSkeleton key={i} />
              ))}
            </div>
          ) : colleges.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {colleges.map((college) => (
                  <CollegeCard key={college.id} college={college} />
                ))}
              </div>
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            </>
          ) : (
            <div className="flex-1 rounded-xl border bg-card flex items-center justify-center min-h-[400px]">
              <EmptyState onAction={handleClearFilters} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
