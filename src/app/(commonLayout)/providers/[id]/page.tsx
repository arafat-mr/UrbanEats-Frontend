"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Link from "next/link";

interface Meal {
  id?: string;
  name: string;
  description: string;
  price?: number;
  image?: string;
  isAvailable?: boolean;
}

interface Provider {
  id: string;
  restaurantName?: string | null;
  description?: string | null;
  meals: Meal[];
  user: {
    name: string;
    email: string;
  };
}

export default function ProviderDetails() {
  const params = useParams();
  const providerId = params.id as string;

  const [provider, setProvider] = useState<Provider | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProviderDetails = async () => {
    try {
      const res = await fetch(`https://urban-eats-backend.vercel.app/api/providers/${providerId}`, {
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch provider");
      setProvider(data);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Error fetching provider details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProviderDetails();
  }, [providerId]);

  const handleAddToCart = async (meal: Meal) => {
    try {
      const res = await fetch("https://urban-eats-backend.vercel.app/orders", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          providerId: provider?.id,
          deliveryAddress: "",
          items: [{ mealId: meal.id, quantity: 1 }],
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to add to cart");
      toast.success("Meal added to cart ");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to add to cart");
    }
  };

  if (loading) return <p className="p-10 text-center">Loading provider details...</p>;
  if (!provider) return <p className="p-10 text-center">Provider not found ❌</p>;

  return (
    <div className="container mx-auto px-6 py-12 space-y-10">
      {/* Provider Info */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">{provider.user.name}</h1>
        {provider.restaurantName && <p className="text-xl font-semibold">{provider.restaurantName}</p>}
        {provider.description && <p className="text-gray-600">{provider.description}</p>}
      </div>

      {/* Meals Caption */}
      <h2 className="text-2xl font-bold">All meals by this provider</h2>

      {/* Meals Grid */}
      {provider.meals.length === 0 ? (
        <p className="text-gray-500">No meals available</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {provider.meals.map((meal, idx) => (
            <Card key={idx} className="border rounded-xl shadow hover:shadow-lg transition">
              <CardHeader>
                <img
                  src={meal.image || "https://placehold.co/300x200"}
                  alt={meal.name}
                  className="w-full h-48 object-cover rounded-lg"
                />
              </CardHeader>
              <CardContent>
                <CardTitle>{meal.name}</CardTitle>
                <p className="text-gray-600 line-clamp-3">{meal.description}</p>
                {meal.price && <p className="font-semibold mt-2">BDT {meal.price}</p>}
                {meal.isAvailable !== undefined && (
                  <p
                    className={`text-sm font-medium mt-1 ${
                      meal.isAvailable ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {meal.isAvailable ? "Available" : "Out of stock"}
                  </p>
                )}
              </CardContent>
              <CardFooter className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => handleAddToCart(meal)}
                  disabled={meal.isAvailable === false}
                >
                  Add to Cart
                </Button>
               <Button asChild>
  <Link href={`/meals/${meal.id}`}>View Details</Link>
</Button>

              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
