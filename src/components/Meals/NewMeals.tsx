// components/Meals/NewMeals.tsx
"use client";


import { Meal } from "@/types/types";
import MealCard from "./MealCard";

export default function NewMeals({ meals }: { meals: Meal[] }) {
  return (
    <section className="container mx-auto py-10">
      <h2 className="text-2xl font-bold mb-6">🔥 New Items</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {meals.slice(0, 6).map((meal) => (
          <MealCard key={meal.id} meal={meal} />
        ))}
      </div>
    </section>
  );
}
