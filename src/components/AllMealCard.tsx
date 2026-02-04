import { Meal } from "@/types/types";

interface AllMealCardProps {
  meal: Meal;
}

export default function AllMealCard({ meal }: AllMealCardProps) {
  return (
    <div className="border rounded-xl p-4 shadow hover:shadow-lg transition">
      <img
        src={meal.image || "https://placehold.co/400x250"}
        className="rounded-lg mb-3"
      />
      <h3 className="font-semibold text-lg">{meal.name}</h3>
      <p className="text-sm text-muted-foreground line-clamp-2">
        {meal.description}
      </p>

      <div className="flex justify-between items-center mt-3">
        <span className="font-bold text-primary">${meal.price}</span>
        <div className="flex gap-2">
          {meal.dietaryTags.map((tag) => (
            <span
              key={tag}
              className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
