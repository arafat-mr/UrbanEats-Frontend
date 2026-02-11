"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AllMealCard from "@/components/AllMealCard";
import { Meal } from "@/types/types";
import { toast } from "sonner";

interface Meta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function MealsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // State
  const [meals, setMeals] = useState<Meal[]>([]);
  const [meta, setMeta] = useState<Meta>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(true);

  // Filters
  const page = Number(searchParams.get("page") || 1);
  const category = searchParams.get("category") || "";
  const dietary = searchParams.get("dietary") || "";
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";
  const search = searchParams.get("search") || "";

  
  const fetchMeals = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (page) params.set("page", String(page));
      if (category) params.set("category", category);
      if (dietary) params.set("dietary", dietary);
      if (minPrice) params.set("minPrice", minPrice);
      if (maxPrice) params.set("maxPrice", maxPrice);
      if (search) params.set("search", search);

      const res = await fetch(`https://urban-eats-backend.vercel.app/api/provider/meals?${params.toString()}`);
      const data = await res.json();

      setMeals(data.data || []);
      setMeta(data.meta || { page: 1, limit: 10, total: 0, totalPages: 1 });
    } catch (err) {
      console.error(err);
      toast.error("Failed to load meals");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeals();
  }, [page, category, dietary, minPrice, maxPrice, search]);

  // Pagination
  const goToPage = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(newPage));
    router.push(`/meals?${params.toString()}`);
  };

  // Filter form submit
  const handleFilter = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const params = new URLSearchParams();
    const searchVal = formData.get("search") as string;
    const categoryVal = formData.get("category") as string;
    const dietaryVal = formData.get("dietary") as string;
    const minPriceVal = formData.get("minPrice") as string;
    const maxPriceVal = formData.get("maxPrice") as string;

    if (searchVal) params.set("search", searchVal);
    if (categoryVal) params.set("category", categoryVal);
    if (dietaryVal) params.set("dietary", dietaryVal);
    if (minPriceVal) params.set("minPrice", minPriceVal);
    if (maxPriceVal) params.set("maxPrice", maxPriceVal);

    params.set("page", "1"); 
    router.push(`/meals?${params.toString()}`);
  };

  return (
    <div className="container py-10 px-6 md:px-10 mx-auto">
      <h1 className="text-3xl font-bold mb-6">All Meals</h1>

      {/* Filter Form */}
      <form onSubmit={handleFilter} className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          name="search"
          defaultValue={search}
          placeholder="Search by name..."
          className="border rounded px-3 py-2 flex-1 dark:text-white dark:bg-black"
        />

        <select
          name="category"
          defaultValue={category}
          className="border rounded px-3 py-2 dark:text-white dark:bg-black"
        >
          <option value="">All Categories</option>
          <option value="italian">Italian</option>
          <option value="indian">Indian</option>
          <option value="chinese">Chinese</option>
          <option value="thai">Thai</option>
          <option value="bengali">Bengali</option>
        </select>

        <select
          name="dietary"
          defaultValue={dietary}
          className="border rounded px-3 py-2 dark:text-white dark:bg-black"
        >
          <option value="">All Dietary</option>
          <option value="VEGAN">Vegan</option>
          <option value="HALAL">Halal</option>
        </select>

        <input
          type="number"
          name="minPrice"
          defaultValue={minPrice}
          placeholder="Min Price"
          className="border rounded px-3 py-2 w-24 dark:text-white dark:bg-black"
        />

        <input
          type="number"
          name="maxPrice"
          defaultValue={maxPrice}
          placeholder="Max Price"
          className="border rounded px-3 py-2 w-24 dark:text-white dark:bg-black"
        />

        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Filter
        </button>
      </form>

      {/* Meals List */}
      {loading ? (
        <p className="text-center text-gray-500">Loading meals...</p>
      ) : meals.length === 0 ? (
        <p className="text-center text-gray-500">No meals found.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {meals.map((meal) => (
              <AllMealCard key={meal.id} meal={meal} />
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center gap-4 mt-8">
            <button
              disabled={meta.page <= 1}
              onClick={() => goToPage(meta.page - 1)}
              className="px-4 py-2 border rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Prev
            </button>

            <span className="px-4 py-2">
              Page {meta.page} of {meta.totalPages}
            </span>

            <button
              disabled={meta.page >= meta.totalPages}
              onClick={() => goToPage(meta.page + 1)}
              className="px-4 py-2 border rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
