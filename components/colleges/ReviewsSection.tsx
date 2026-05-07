import { Star } from "lucide-react";

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: Date;
  user: {
    name: string | null;
    image: string | null;
  };
}

export function ReviewsSection({ reviews }: { reviews: Review[] }) {
  if (!reviews || reviews.length === 0) {
    return (
      <div className="rounded-lg border bg-card p-6 text-center text-muted-foreground">
        No reviews yet. Be the first to review this college!
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div key={review.id} className="rounded-lg border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 overflow-hidden rounded-full bg-muted flex items-center justify-center font-bold text-muted-foreground">
                {review.user.name ? review.user.name.charAt(0).toUpperCase() : "U"}
              </div>
              <div>
                <p className="font-medium text-sm">{review.user.name || "Anonymous User"}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(review.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex items-center bg-primary/10 px-2 py-1 rounded">
              <Star className="h-3 w-3 fill-primary text-primary mr-1" />
              <span className="text-sm font-semibold">{review.rating.toFixed(1)}</span>
            </div>
          </div>
          {review.comment && (
            <p className="text-sm leading-relaxed text-muted-foreground">
              "{review.comment}"
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
