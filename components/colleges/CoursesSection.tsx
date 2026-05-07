import { IndianRupee, Clock } from "lucide-react";

interface Course {
  id: string;
  name: string;
  duration: string;
  fees: number;
}

export function CoursesSection({ courses }: { courses: Course[] }) {
  if (!courses || courses.length === 0) {
    return (
      <div className="rounded-lg border bg-card p-6 text-center text-muted-foreground">
        No course information available at this time.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {courses.map((course) => (
        <div key={course.id} className="rounded-lg border bg-card p-5 shadow-sm transition-shadow hover:shadow-md">
          <h4 className="font-semibold text-lg mb-4">{course.name}</h4>
          <div className="flex flex-col space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center">
              <Clock className="mr-2 h-4 w-4" />
              <span>Duration: <span className="font-medium text-foreground">{course.duration}</span></span>
            </div>
            <div className="flex items-center">
              <IndianRupee className="mr-2 h-4 w-4" />
              <span>Fees: <span className="font-medium text-foreground">₹{course.fees.toLocaleString()}</span></span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
