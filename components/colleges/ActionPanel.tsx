"use client";

import { useState } from "react";
import { Heart, Scale } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { useCompareStore } from "@/store/compare-store";

interface ActionPanelProps {
  collegeId: string;
  collegeName: string;
  collegeSlug: string;
  collegeImage?: string | null;
}

export function ActionPanel({ collegeId, collegeName, collegeSlug, collegeImage }: ActionPanelProps) {
  const { data: session } = useSession();
  const [isSaving, setIsSaving] = useState(false);
  
  const { colleges, addCollege, removeCollege } = useCompareStore();
  const isComparing = colleges.some(c => c.id === collegeId);
  
  const handleSave = async () => {
    if (!session) {
      toast.error("Please log in to save colleges.");
      return;
    }
    
    setIsSaving(true);
    try {
      const res = await fetch("/api/saved/college", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ collegeId }),
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      if (data.message === "Already saved") {
        toast.info(`${collegeName} is already saved.`);
      } else {
        toast.success(`${collegeName} saved to your dashboard!`);
      }
    } catch (err) {
      toast.error("Failed to save college.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCompare = () => {
    if (isComparing) {
      removeCollege(collegeId);
      toast.success(`${collegeName} removed from compare list.`);
    } else {
      addCollege({ id: collegeId, name: collegeName, slug: collegeSlug, imageUrl: collegeImage });
    }
  };

  return (
    <div className="sticky top-24 rounded-xl border bg-card p-6 shadow-sm">
      <h3 className="font-semibold text-lg mb-4">Interested in {collegeName}?</h3>
      <p className="text-sm text-muted-foreground mb-6">
        Save this college to your profile to review it later, or add it to a comparison list.
      </p>
      
      <div className="flex flex-col space-y-3">
        <Button 
          onClick={handleSave} 
          disabled={isSaving}
          className="w-full flex items-center justify-center"
        >
          <Heart className="mr-2 h-4 w-4" />
          {isSaving ? "Saving..." : "Save College"}
        </Button>
        
        <Button 
          variant={isComparing ? "secondary" : "outline"} 
          onClick={handleCompare}
          className="w-full flex items-center justify-center"
        >
          <Scale className="mr-2 h-4 w-4" />
          {isComparing ? "Remove from Compare" : "Add to Compare"}
        </Button>
      </div>
    </div>
  );
}
