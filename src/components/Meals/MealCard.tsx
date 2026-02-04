'use client'

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Meal } from "@/types/types";
import Link from "next/link";

export default function MealCard({ meal }: { meal: Meal }) {
  return (
    <Card className="hover:shadow-lg transition rounded-2xl overflow-hidden bg-white dark:bg-zinc-900">
      <img
        src={meal.image}
        alt={meal.name}
        className="h-40 w-full object-cover"
      />

      <CardContent className="p-4 space-y-3">
        <h3 className="font-semibold text-lg">{meal.name}</h3>

        <p className="text-sm text-muted-foreground line-clamp-2">
          {meal.description}
        </p>

        <div className="flex items-center justify-between">
          <span className="font-bold text-primary">BDT {meal.price}</span>
          <span
            className={`text-xs font-medium ${
              meal.isAvailable ? "text-green-500" : "text-red-500"
            }`}
          >
            {meal.isAvailable ? "Available" : "Out of stock"}
          </span>
        </div>

        <div className="flex flex-wrap gap-1">
          {meal.dietaryTags?.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Link href={`/meals/${meal.id}`} className="flex-1">
            <Button
              variant="outline"
              className="w-full dark:border-zinc-700 dark:text-white"
            >
              View Details
            </Button>
          </Link>

          <Button
            disabled={!meal.isAvailable}
            className="flex-1"
            variant="default"
          >
            Add to Cart
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
