"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";

interface Meal {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  isAvailable: boolean;
  dietaryTags: string[];
  providerId: string;
  provider?: { user?: { name: string } };
}

interface Review {
  id: string;
  customerId: string;
  mealId: string;
  orderId: string;
  rating: number;
  comment?: string;
  createdAt: string;
  customer: { name: string };
}

export default function MealDetails() {
  const params = useParams();
  const id = params?.id as string;

  const [meal, setMeal] = useState<Meal | null>(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [userRating, setUserRating] = useState(0);
  const [userComment, setUserComment] = useState("");
  const [canReview, setCanReview] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null); // store orderId for review

  // Fetch meal, reviews, and review eligibility
  const fetchMeal = async () => {
    if (!id) return;
    try {
      // 1. Fetch meal
      const res = await fetch(`http://localhost:5000/api/provider/meals/${id}`, {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch meal");
      setMeal(data);

      // 2. Check if customer can review & get orderId
      const reviewCheck = await fetch(
        `http://localhost:5000/reviews/can-review/${id}`,
        { credentials: "include" }
      );
      const reviewResult = await reviewCheck.json();
      setCanReview(reviewResult.canReview);
      setOrderId(reviewResult.orderId ?? null); // store orderId

      // 3. Fetch existing reviews
      const revRes = await fetch(`http://localhost:5000/reviews/meal/${id}`,{
        credentials: "include",
      });
      const revData = await revRes.json();

      console.log(revData);
      
      setReviews(revData.data || []);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to load meal");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeal();
  }, [id]);

  // Add to cart
  const handleAddToCart = async () => {
    if (!meal?.isAvailable) return;
    try {
      const res = await fetch("http://localhost:5000/orders", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          providerId: meal.providerId,
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

  // Submit review
  const handleSubmitReview = async () => {
    if (userRating < 1) return toast.error("Please select a rating");
    if (!orderId) return toast.error("Cannot submit review: order ID missing");

    try {
      const res = await fetch(`http://localhost:5000/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          mealId: meal?.id,
          rating: userRating,
          comment: userComment,
          orderId: orderId, // important!
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to submit review");
      toast.success("Review submitted successfully ");
      setUserRating(0);
      setUserComment("");
      fetchMeal(); // refresh reviews
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Error submitting review");
    }
  };

  if (loading) return <p className="p-10 text-center">Loading meal...</p>;
  if (!meal) return <p className="p-10 text-center">Meal not found ❌</p>;

  return (
    <div className="container mx-auto px-6 py-12 space-y-10">
      {/* Meal Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
        <div className="w-full">
          <img
            src={meal.image}
            alt={meal.name}
            className="w-full h-[380px] object-cover rounded-2xl shadow-md"
          />
        </div>
        <div className="space-y-5">
          <h1 className="text-3xl font-bold">{meal.name}</h1>
          <p>
            Provided by:{" "}
            <span className="font-semibold text-primary">
              {meal.provider?.user?.name ?? "Unknown Provider"}
            </span>
          </p>

          <div className="flex items-center gap-4">
            <span className="text-2xl font-bold text-primary">BDT {meal.price}</span>
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

          <p>{meal.description}</p>

          <div className="flex flex-wrap gap-2">
            {meal.dietaryTags?.map((tag: string) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-full text-xs font-medium bg-zinc-100 dark:bg-zinc-800"
              >
                {tag}
              </span>
            ))}
          </div>

          <button
            disabled={!meal.isAvailable}
            onClick={handleAddToCart}
            className="px-6 py-3 rounded-xl font-semibold transition-all bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            Add to Cart
          </button>
        </div>
      </div>

      {/* Review Section */}
      <div className="space-y-5">
        <h2 className="text-2xl font-bold">Reviews</h2>

        {canReview ? (
          <div className="border rounded-xl p-4 space-y-3">
            <h3 className="font-semibold">Write a Review</h3>
            <div className="flex items-center gap-2">
              <span>Rating:</span>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  className={`text-2xl ${
                    userRating >= star ? "text-yellow-400" : "text-gray-300"
                  }`}
                  onClick={() => setUserRating(star)}
                >
                  ★
                </button>
              ))}
            </div>
            <textarea
              className="w-full border rounded-md p-2"
              rows={3}
              placeholder="Write a comment (optional)"
              value={userComment}
              onChange={(e) => setUserComment(e.target.value)}
            />
            <button
              onClick={handleSubmitReview}
              className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700"
            >
              Submit Review
            </button>
          </div>
        ) : (
          <p className="text-gray-500">You can only review meals you have purchased.</p>
        )}

        {/* Reviews List */}
        <div className="space-y-3">
          {reviews.length === 0 && <p className="text-gray-500">No reviews yet</p>}
          {reviews.map((rev) => (
            <div key={rev.id} className="border rounded-xl p-3">
              <div className="flex justify-between items-center">
                <span className="font-semibold">{rev.customer.name}</span>
                <span className="text-yellow-400">{rev.rating} ★</span>
              </div>
              {rev.comment && <p className="mt-1 text-gray-700">{rev.comment}</p>}
              <p className="text-xs text-gray-400">
                {new Date(rev.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
