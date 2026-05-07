import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "sonner";

export interface CompareCollege {
  id: string;
  name: string;
  slug: string;
  imageUrl?: string | null;
}

interface CompareStore {
  colleges: CompareCollege[];
  addCollege: (college: CompareCollege) => void;
  removeCollege: (id: string) => void;
  clearCompare: () => void;
}

export const useCompareStore = create<CompareStore>()(
  persist(
    (set, get) => ({
      colleges: [],
      addCollege: (college) => {
        const current = get().colleges;
        if (current.find((c) => c.id === college.id)) {
          toast.error(`${college.name} is already in the comparison list.`);
          return;
        }
        if (current.length >= 3) {
          toast.error("You can only compare up to 3 colleges at a time.");
          return;
        }
        set({ colleges: [...current, college] });
        toast.success(`${college.name} added to compare.`);
      },
      removeCollege: (id) => {
        set({ colleges: get().colleges.filter((c) => c.id !== id) });
      },
      clearCompare: () => set({ colleges: [] }),
    }),
    { name: "compare-storage" }
  )
);
