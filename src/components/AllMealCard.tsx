"use client";

import { Meal } from "@/types/types";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";
import { redirect } from "next/navigation";

interface AllMealCardProps {
  meal: Meal;
}

export default function AllMealCard({ meal }: AllMealCardProps) {
  const handleAddToCart = async () => {
    if (!meal.isAvailable) return;

    try {
      const res = await fetch("https://urban-eats-backend.vercel.app/orders", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          providerId: meal.providerId,
          deliveryAddress: "", // optionally, ask user for address in cart page
          items: [{ mealId: meal.id, quantity: 1 }],
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to add to cart");

      toast.success("Added to cart successfully!");
    } catch (err: any) {
      console.error(err);
      toast.error( "Error adding to cart ! Please login first");
      // redirect('/login')
    }
  };

  return (
    <div className="border rounded-xl p-4 shadow hover:shadow-lg transition flex flex-col">
      {/* Image */}
      <img
        src={meal.image || "https://placehold.co/400x250"}
        className="rounded-lg mb-3 object-cover h-48 w-full"
      />

      {/* Name & Description */}
      <h3 className="font-semibold text-lg">{meal.name}</h3>
      <p className="text-sm text-muted-foreground line-clamp-2">
        {meal.description}
      </p>

      {/* Price & Dietary Tags */}
      <div className="flex justify-between items-center mt-3">
        <span className="font-bold text-primary">BDT {meal.price}</span>
        <div className="flex gap-2">
          {meal.dietaryTags?.map((tag) => (
            <span
              key={tag}
              className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 mt-4">
        <Link href={`/meals/${meal.id}`} className="flex-1">
          <Button variant="outline" className="w-full">
            View Details
          </Button>
        </Link>

        <Button
          variant="default"
          className="flex-1"
          disabled={!meal.isAvailable}
          onClick={handleAddToCart}
        >
          {meal.isAvailable ? "Add to Cart" : "Out of Stock"}
        </Button>
      </div>
    </div>
  );
}
