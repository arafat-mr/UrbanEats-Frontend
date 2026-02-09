"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";
import { useTheme } from "next-themes";

type Meal = {
  id: string;
  name: string;
  description?: string;
  image: string;
  price: number;
  isAvailable: boolean;
  dietaryTags?: string[];
};

type HotDeal = {
  id: string;
  rating: number;
  meal: Meal;
};

export default function HotDealsSection() {
  const [deals, setDeals] = useState<HotDeal[]>([]);
  const [loading, setLoading] = useState(true);
  const { theme, resolvedTheme } = useTheme();
  const isDark = (resolvedTheme || theme) === "dark";

  const fetchHotDeals = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/reviews/hot-deals");
      const data = await res.json();
      setDeals(data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load hot deals");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotDeals();
  }, []);

  const handleAddToCart = (meal: Meal) => {
    toast.success(`${meal.name} added to cart!`);
  };

  if (loading)
    return <p className="p-4 text-center text-gray-500">Loading Popular Meals...</p>;
  if (!deals.length)
    return <p className="p-4 text-center text-gray-500">No Popular meals available.</p>;

  return (
    <section className="py-16 flex justify-center ">
      <div className="w-full max-w-6xl px-6 md:px-0 space-y-12">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
          Popular Meals Based on Customer Reviews
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 ">
          {deals.map(({ meal, rating }) => (
            <div
              key={meal.id}
              className={`border rounded-xl  shadow hover:shadow-lg transition flex flex-col ${
                isDark ? "bg-gray-800 text-white border-gray-700" : "bg-white text-gray-900"
              }`}
            >
              {/* Image */}
              <img
                src={meal.image || "https://placehold.co/400x250"}
                alt={meal.name}
                className="rounded-t-md mb-3 object-cover h-48 w-full"
              />

             <div className="p-4">
                 {/* Name & Description */}
              <h3 className="font-semibold text-lg">{meal.name}</h3>
              {meal.description && (
                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                  {meal.description}
                </p>
              )}

              {/* Rating */}
              <div className="flex items-center mt-2 mb-2 text-yellow-400 font-medium">
                ★ {rating.toFixed(1)}
              </div>

              {/* Price & Dietary Tags */}
              <div className="flex justify-between items-center mt-auto">
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
             </div>

              
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
