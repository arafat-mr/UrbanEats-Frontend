import { MealService } from "@/services/meal.service";
import { UserService } from "@/services/user.service";
import { NextRequest, NextResponse } from "next/server";

export default async function MealDetails({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;

  const meal = await MealService.getMealById(id);

  if (!meal) {
    return <div className="p-10 text-center text-xl">Meal not found ❌</div>;
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
        {/* Image Section */}
        <div className="w-full">
          <img
            src={meal.image}
            alt={meal.name}
            className="w-full h-[380px] object-cover rounded-2xl shadow-md"
          />
        </div>

        {/* Info Section */}
        <div className="space-y-5">
          <h1 className="text-3xl font-bold">{meal.name}</h1>

          <p className="text-muted-foreground">
            Provided by:{" "}
            <span className="font-semibold text-primary">
              {meal.provider?.user?.name ?? "Unknown Provider"}
            </span>
          </p>

          <div className="flex items-center gap-4">
            <span className="text-2xl font-bold text-primary">
              BDT {meal.price}
            </span>

            <span
              className={`text-sm font-medium px-3 py-1 rounded-full ${
                meal.isAvailable
                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                  : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
              }`}
            >
              {meal.isAvailable ? "Available" : "Out of stock"}
            </span>
          </div>

          <p className="text-base leading-relaxed">{meal.description}</p>

          {/* Dietary Tags */}
          {meal.dietaryTags?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {meal.dietaryTags.map((tag: string) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full text-xs font-medium bg-zinc-100 dark:bg-zinc-800"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Action */}
          <div className="pt-4">
            <button
              disabled={!meal.isAvailable}
              className="px-6 py-3 rounded-xl font-semibold transition-all
                         bg-blue-600 text-white hover:bg-blue-700
                         dark:bg-blue-500 dark:hover:bg-blue-600
                         disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
