// src/services/review.service.ts

import { env } from "@/env";


const API_URL = env.API_URL;

export const ReviewService = {
  getHotDeals: async function () {
    try {
      const res = await fetch(`${API_URL}/reviews/hot-deals`, {
        credentials: "include",
        cache: "no-store", // prevent stale cache on Vercel
      });

      if (!res.ok) {
        throw new Error("Failed to fetch hot deals");
      }

      const data = await res.json();
      return { data, error: null };
    } catch (error) {
      console.error("Hot deals fetch error:", error);
      return { data: null, error: { message: "Failed to load hot deals" } };
    }
  },
};
