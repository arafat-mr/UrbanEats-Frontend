"use client"
import { MealUpdate } from "@/components/MealUpdate";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { UserService } from "@/services/user.service";
type Meal = {
  id: string;
  name: string;
  price: number;
  description: string;
  image?: string;
};

export default  function MyMeals() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
 
  const fetchMeals = async () => {

  


    try {
       const user= await fetch('https://urban-eats-backend.vercel.app/api/auth/get-session',{
        method:"GET",
        credentials:"include"
       })
  
  const mySession= await user.json()

  if(!mySession?.id){
    return 
  }
  
      const res = await fetch(
        `https://urban-eats-backend.vercel.app/api/provider/meals/myMeals/${mySession.id}`,

        {
          method:"GET",
          credentials: "include",
        },
      );

      const data = await res.json();

   
      
      const mealsArray = Array.isArray(data) ? data : data?.data || [];
      setMeals(mealsArray);
    } catch {
      toast.error("Failed to load meals");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeals();
  }, []);

  const handleDelete = async (mealId: string) => {
    if (!confirm("Are you sure you want to delete this meal?")) return;
    try {
      const res = await fetch(
        `https://urban-eats-backend.vercel.app/api/provider/meals/${mealId}`,
        { method: "DELETE", credentials: "include" },
      );
      if (!res.ok) throw new Error();
      toast.success("Meal deleted");
      fetchMeals();
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Meals</h1>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

        <TableBody>
  {loading ? (
    <TableRow>
      <TableCell colSpan={5} className="text-center py-10">
        Loading meals...
      </TableCell>
    </TableRow>
  ) : meals.length === 0 ? (
    <TableRow>
      <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
        No meals added yet 🍽️  
        <br />
        Start by adding your first meal!
      </TableCell>
    </TableRow>
  ) : (
    meals.map((meal) => (
      <TableRow key={meal.id}>
        <TableCell>
          {meal.image ? (
            <img
              src={meal.image}
              alt={meal.name}
              className="w-12 h-12 rounded object-cover"
            />
          ) : (
            "N/A"
          )}
        </TableCell>
        <TableCell>{meal.name}</TableCell>
        <TableCell>BDT {meal.price}</TableCell>
        <TableCell className="max-w-xs truncate">
          {meal.description}
        </TableCell>
        <TableCell className="text-right space-x-2">
          <Button size="sm" variant="outline" onClick={() => setSelectedMeal(meal)}>
            Edit
          </Button>
          <Button size="sm" variant="destructive" onClick={() => handleDelete(meal.id)}>
            Delete
          </Button>
        </TableCell>
      </TableRow>
    ))
  )}
</TableBody>

        </Table>
      </div>

      {selectedMeal && (
        <MealUpdate
          meal={selectedMeal}
          onClose={() => setSelectedMeal(null)}
          onUpdated={() => fetchMeals()}
        />
      )}
    </div>
  );
}
