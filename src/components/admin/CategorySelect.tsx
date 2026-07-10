"use client";

import { useState, useTransition } from "react";
import { createCategory } from "@/app/actions/categories";
import { X, Plus, Loader2, Check } from "lucide-react";

type Category = {
  id: string;
  name: string;
};

export default function CategorySelect({ initialCategories, defaultValues = [] }: { initialCategories: Category[], defaultValues?: string[] }) {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>(defaultValues);
  const [isPending, startTransition] = useTransition();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  const toggleCategory = (id: string) => {
    setSelectedCategoryIds(prev => 
      prev.includes(id) ? prev.filter(cId => cId !== id) : [...prev, id]
    );
  };

  const handleCreateCategory = () => {
    if (newCategoryName.trim().length > 0) {
      startTransition(async () => {
        try {
          const newCat = await createCategory(newCategoryName.trim());
          setCategories([...categories, newCat]);
          setSelectedCategoryIds(prev => [...prev, newCat.id]);
          setIsModalOpen(false);
          setNewCategoryName("");
        } catch (error) {
          console.error("Failed to create category", error);
          alert("Failed to create category. It might already exist.");
        }
      });
    }
  };

  return (
    <div className="space-y-3">
      {/* Hidden inputs to pass to form submission */}
      {selectedCategoryIds.map(id => (
        <input key={id} type="hidden" name="category_id" value={id} />
      ))}
      {selectedCategoryIds.length === 0 && (
        <input type="hidden" name="category_id" required /> // To trigger HTML5 validation if empty
      )}

      <div className="flex flex-wrap gap-2">
        {categories.map(c => {
          const isSelected = selectedCategoryIds.includes(c.id);
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => toggleCategory(c.id)}
              disabled={isPending}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors border ${
                isSelected 
                  ? "bg-primary/10 border-primary text-primary" 
                  : "bg-background border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
              } disabled:opacity-50`}
            >
              {isSelected && <Check className="h-3.5 w-3.5" />}
              {c.name}
            </button>
          );
        })}
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          disabled={isPending}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-semibold border border-dashed border-primary/50 text-primary hover:bg-primary/5 transition-colors disabled:opacity-50"
        >
          <Plus className="h-3.5 w-3.5" />
          Create New
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-xl shadow-lg w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h3 className="font-bold">Create New Category</h3>
              <button 
                type="button" 
                onClick={() => setIsModalOpen(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Category Name</label>
                <input
                  type="text"
                  autoFocus
                  placeholder="e.g. Local Tournaments"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleCreateCategory();
                    }
                  }}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary"
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 p-4 border-t border-border bg-muted/20">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-sm font-medium rounded-lg hover:bg-accent transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreateCategory}
                disabled={isPending || newCategoryName.trim().length === 0}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-primary-foreground bg-primary rounded-lg shadow-sm hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
