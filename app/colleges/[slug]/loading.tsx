export default function Loading() {
  return (
    <div className="container py-10 animate-pulse">
      <div className="w-full h-[300px] md:h-[400px] rounded-2xl bg-muted mb-8" />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-12">
          <section className="space-y-4">
            <div className="h-8 w-1/3 bg-muted rounded mb-4" />
            <div className="h-4 w-full bg-muted rounded" />
            <div className="h-4 w-full bg-muted rounded" />
            <div className="h-4 w-3/4 bg-muted rounded" />
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-24 bg-muted rounded-lg" />
              ))}
            </div>
          </section>
          
          <section className="space-y-4">
            <div className="h-8 w-1/3 bg-muted rounded mb-4" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2].map((i) => (
                <div key={i} className="h-32 bg-muted rounded-lg" />
              ))}
            </div>
          </section>
        </div>
        
        <div className="lg:col-span-1">
          <div className="h-64 bg-muted rounded-xl" />
        </div>
      </div>
    </div>
  );
}
