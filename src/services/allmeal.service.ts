interface GetMealsParams {
  page?: number;
  category?: string;
  dietary?: string;
  minPrice?: string;
  maxPrice?: string;
  search?: string;
  sort?: "newest" | "oldest";
}

export const AllMealService = {
  getAllMeals: async (params?: GetMealsParams) => {
    const query = new URLSearchParams();

    if (params?.page) query.set("page", params.page.toString());
    if (params?.category) query.set("category", params.category);
    if (params?.dietary) query.set("dietary", params.dietary);
    if (params?.minPrice) query.set("minPrice", params.minPrice);
    if (params?.maxPrice) query.set("maxPrice", params.maxPrice);
    if (params?.search) query.set("search", params.search);
    if (params?.sort) query.set("sort", params.sort);

    const res = await fetch(
      `http://localhost:5000/api/provider/meals?${query.toString()}`,
      { cache: "no-store" }
    );

    if (!res.ok) throw new Error("Failed to fetch meals");

    const data = await res.json();
    return { data, error: null };
  },
};
