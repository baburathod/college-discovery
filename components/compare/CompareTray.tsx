"use client";

import { useCompareStore } from "@/store/compare-store";
import { Button } from "@/components/ui/button";
import { X, Scale } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export function CompareTray() {
  const { colleges, removeCollege, clearCompare } = useCompareStore();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch by waiting for mount
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || colleges.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 pointer-events-none">
      <div className="container max-w-4xl mx-auto pointer-events-auto">
        <div className="bg-background/95 backdrop-blur-md border rounded-t-xl shadow-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-4 flex-1">
            <div className="hidden sm:flex flex-col">
              <span className="font-semibold text-sm">Compare Colleges</span>
              <span className="text-xs text-muted-foreground">{colleges.length}/3 selected</span>
            </div>
            
            <div className="flex items-center gap-2 flex-1 overflow-x-auto pb-2 md:pb-0">
              {colleges.map(c => (
                <div key={c.id} className="flex items-center bg-muted rounded-md border px-3 py-1.5 min-w-[140px] max-w-[200px]">
                  <span className="text-xs font-medium truncate flex-1">{c.name}</span>
                  <button onClick={() => removeCollege(c.id)} className="ml-2 text-muted-foreground hover:text-destructive shrink-0">
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              {colleges.length < 3 && (
                <div className="hidden md:flex items-center justify-center border border-dashed rounded-md px-3 py-1.5 text-xs text-muted-foreground min-w-[140px]">
                  Add more...
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-3 shrink-0 w-full md:w-auto">
            <Button variant="ghost" size="sm" onClick={clearCompare} className="text-xs">
              Clear All
            </Button>
            <Link href="/compare" className="flex-1 md:flex-none">
              <Button size="sm" className="w-full flex items-center justify-center shadow-md">
                <Scale className="mr-2 h-4 w-4" />
                Compare Now
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
