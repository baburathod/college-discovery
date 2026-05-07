"use client";

import { useEffect, useState } from "react";
import { useCompareStore } from "@/store/compare-store";
import { CompareTable } from "@/components/compare/CompareTable";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Scale, Save } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

export default function ComparePage() {
  const { colleges } = useCompareStore();
  const { data: session } = useSession();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    async function fetchComparisonData() {
      if (colleges.length === 0) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const ids = colleges.map(c => c.id).join(",");
        const res = await fetch(`/api/compare?ids=${ids}`);
        if (!res.ok) throw new Error("Failed to fetch compare data");
        const json = await res.json();
        setData(json.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    if (mounted) {
      fetchComparisonData();
    }
  }, [colleges, mounted]);

  const handleSaveComparison = async () => {
    if (!session) {
      toast.error("Please log in to save comparisons.");
      return;
    }
    
    setSaving(true);
    try {
      const ids = colleges.map(c => c.id);
      const res = await fetch("/api/saved/comparison", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ collegeIds: ids, name: `Comparison (${colleges.length} colleges)` }),
      });
      if (!res.ok) throw new Error("Failed to save");
      toast.success("Comparison saved to your dashboard!");
    } catch (err) {
      toast.error("Could not save comparison.");
    } finally {
      setSaving(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="container py-10 min-h-[calc(100vh-8rem)]">
      <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <Link href="/colleges">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Compare Colleges</h1>
            <p className="text-muted-foreground">Make informed decisions by comparing metrics side-by-side.</p>
          </div>
        </div>
        {data.length >= 2 && (
          <Button onClick={handleSaveComparison} disabled={saving}>
            <Save className="mr-2 h-4 w-4" />
            {saving ? "Saving..." : "Save Comparison"}
          </Button>
        )}
      </div>

      {loading ? (
        <div className="h-[500px] w-full rounded-xl border bg-muted animate-pulse" />
      ) : colleges.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center rounded-xl border bg-card shadow-sm">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted mb-6">
            <Scale className="h-10 w-10 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold">Comparison list is empty</h3>
          <p className="mt-2 text-muted-foreground max-w-sm mb-6">
            Browse colleges and click "Add to Compare" to see them side-by-side here.
          </p>
          <Link href="/colleges">
            <Button>Browse Colleges</Button>
          </Link>
        </div>
      ) : data.length < 2 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center rounded-xl border bg-card shadow-sm">
          <h3 className="text-xl font-semibold">Need more data</h3>
          <p className="mt-2 text-muted-foreground max-w-sm mb-6">
            You need at least 2 colleges to make a comparison.
          </p>
          <Link href="/colleges">
            <Button variant="outline">Add another college</Button>
          </Link>
          
          <div className="mt-10 w-full max-w-md">
            <h4 className="text-sm font-semibold uppercase text-muted-foreground mb-4">Currently Selected</h4>
            <div className="flex items-center justify-between p-4 border rounded-md">
              <span className="font-medium">{data[0]?.name}</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
          <CompareTable colleges={data} />
        </div>
      )}
    </div>
  );
}
