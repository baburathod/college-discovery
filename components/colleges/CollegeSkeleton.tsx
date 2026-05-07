export function CollegeSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border bg-card shadow flex flex-col h-[400px]">
      <div className="h-48 w-full animate-pulse bg-muted" />
      <div className="flex flex-1 flex-col p-5 space-y-4">
        <div className="h-6 w-3/4 animate-pulse rounded bg-muted" />
        <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
        
        <div className="grid grid-cols-2 gap-4 mt-auto mb-5 border-t pt-4">
          <div className="space-y-2">
            <div className="h-3 w-16 animate-pulse rounded bg-muted" />
            <div className="h-4 w-20 animate-pulse rounded bg-muted" />
          </div>
          <div className="space-y-2">
            <div className="h-3 w-16 animate-pulse rounded bg-muted" />
            <div className="h-4 w-20 animate-pulse rounded bg-muted" />
          </div>
        </div>
        <div className="mt-auto h-10 w-full animate-pulse rounded bg-muted" />
      </div>
    </div>
  );
}
