"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

// Type for Category
type Category = {
  id: string;
  name: string;
  description?: string;
};

// Modal Component
 export default function CategoryUpdateModal({
  category,
  onClose,
  onUpdated,
}: {
  category: Category;
  onClose: () => void;
  onUpdated: () => void;
}) {
  const [name, setName] = useState(category.name);
  const [description, setDescription] = useState(category.description || "");
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(
        `https://urban-eats-backend.vercel.app/api/admin/categories/${category.id}`,
        {
          method: "PATCH",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, description }),
        }
      );

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || "Update failed");
        return;
      }

      toast.success("Category updated ");
      onUpdated();
      onClose();
    } catch (err) {
      toast.error("Internal server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-black p-6 rounded-lg w-full max-w-md space-y-4">
        <h2 className="text-xl font-semibold">Update Category</h2>

        <div className="space-y-2">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>

         
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleUpdate} disabled={loading}>
            {loading ? "Updating..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
}
