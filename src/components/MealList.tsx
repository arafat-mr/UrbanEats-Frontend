"use client";

import { useRouter, useSearchParams } from "next/navigation";
import AllMealCard from "./AllMealCard";
import { Meal } from "@/types/types";

interface MealsListProps {
  meals: Meal[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export default function MealsList({ meals, meta }: MealsListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page") || 1);

  const goToPage = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(newPage));
    router.push(`/meals?${params.toString()}`);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {meals.map((meal) => (
          <AllMealCard key={meal.id} meal={meal} />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-4 mt-8">
        <button
          disabled={page <= 1}
          onClick={() => goToPage(page - 1)}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Prev
        </button>

        <span className="px-4 py-2">
          Page {meta.page} of {meta.totalPages}
        </span>

        <button
          disabled={page >= meta.totalPages}
          onClick={() => goToPage(page + 1)}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </>
  );
}
