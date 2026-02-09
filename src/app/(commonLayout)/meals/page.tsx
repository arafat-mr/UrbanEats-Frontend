import MealsList from "@/components/MealList";
import { AllMealService } from "@/services/allmeal.service";

type SearchParams = {
  page?: string;
  category?: string;
  dietary?: string;
  minPrice?: string;
  maxPrice?: string;
  search?: string;
};

export default async function MealsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const page = Number(searchParams?.page || 1);

  const res = await AllMealService.getAllMeals({
    page,
    category: searchParams?.category,
    dietary: searchParams?.dietary,
    minPrice: searchParams?.minPrice,
    maxPrice: searchParams?.maxPrice,
    search: searchParams?.search,
    sort: "newest",
  });

  const data =
    res?.data ?? {
      data: [],
      meta: { page: 1, limit: 10, total: 0, totalPages: 1 },
    };

  return (
    <div className="container py-10 px-10 mx-auto">
      <h1 className="text-3xl font-bold mb-6">All Meals</h1>

      {/* Filter Form */}
      <div className="mb-6">
        <form action="/meals" method="GET" className="flex flex-wrap gap-4">
          <input
            type="text"
            name="search"
            defaultValue={searchParams?.search || ""}
            placeholder="Search by name..."
            className="border rounded px-3 py-2 flex-1 dark:text-white dark:bg-black"
          />

          <select
            name="category"
            defaultValue={searchParams?.category || ""}
            className="border rounded px-3 py-2 dark:text-white dark:bg-black"
          >
            <option value="">All Categories</option>
            <option value="ffffddff">Italian</option>
            <option value="ddff">Indian</option>
          </select>

          <select
            name="dietary"
            defaultValue={searchParams?.dietary || ""}
            className="border rounded px-3 py-2 dark:text-white dark:bg-black"
          >
            <option value="">All Dietary</option>
            <option value="VEGAN">Vegan</option>
            <option value="HALAL">Halal</option>
          </select>

          <input
            type="number"
            name="minPrice"
            defaultValue={searchParams?.minPrice || ""}
            placeholder="Min Price"
            className="border rounded px-3 py-2 w-24 dark:text-white dark:bg-black"
          />

          <input
            type="number"
            name="maxPrice"
            defaultValue={searchParams?.maxPrice || ""}
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
      </div>

      {/* Meals List */}
      <MealsList meals={data.data} meta={data.meta} />
    </div>
  );
}
