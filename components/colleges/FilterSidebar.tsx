import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FilterSidebarProps {
  search: string;
  setSearch: (val: string) => void;
  location: string;
  setLocation: (val: string) => void;
  course: string;
  setCourse: (val: string) => void;
  sort: string;
  setSort: (val: string) => void;
  availableLocations: string[];
}

export function FilterSidebar({
  search,
  setSearch,
  location,
  setLocation,
  course,
  setCourse,
  sort,
  setSort,
  availableLocations,
}: FilterSidebarProps) {
  return (
    <div className="flex flex-col space-y-6 rounded-xl border bg-card p-6 shadow-sm">
      <div className="space-y-2">
        <h3 className="font-semibold text-lg">Search</h3>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search colleges..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t">
        <h3 className="font-semibold text-lg">Filters</h3>
        
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <select
            id="location"
            className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          >
            <option value="all">All Locations</option>
            {availableLocations.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="course">Course Level</Label>
          <select
            id="course"
            className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            value={course}
            onChange={(e) => setCourse(e.target.value)}
          >
            <option value="all">All Courses</option>
            <option value="B.Tech">B.Tech</option>
            <option value="MBA">MBA</option>
            <option value="B.Sc">B.Sc</option>
            <option value="M.Tech">M.Tech</option>
          </select>
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t">
        <h3 className="font-semibold text-lg">Sort By</h3>
        <select
          className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="rating-desc">Highest Rated</option>
          <option value="fees-asc">Lowest Fees</option>
          <option value="fees-desc">Highest Fees</option>
        </select>
      </div>
    </div>
  );
}
