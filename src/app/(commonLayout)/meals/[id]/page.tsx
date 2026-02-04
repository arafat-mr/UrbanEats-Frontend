import { MealService } from "@/services/meal.service";
import { UserService } from "@/services/user.service";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

export default async function MealDetails({
  params
}: {
  params: { id: string };
}) {
  const {id} = await params

  const meal = await MealService.getMealById(id);
  
  //  console.log(session.data.token);
  const handleCart=async(request:NextRequest)=>{
    const session= await UserService.getSession()
if(!session?.data?.token){
  return NextResponse.redirect(new URL(('/login'),request.url))
}
}

 

  if (!meal) {
    return <div className="p-10">Meal not found ❌</div>;
  }

  return (
    <div className="container mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-4">{meal.name}</h1>
      <p className="text-muted-foreground mb-2">
        Provided by:{" "}
        <span className="font-semibold text-primary">
          {meal.provider?.user?.name ?? "Unknown Provider"}
        </span>
      </p>

      <img
        src={meal.image}
        alt={meal.name}
        className="w-full max-w-md rounded-xl mb-6"
      />

      <p className="mb-4">{meal.description}</p>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Price and availability */}
        <div className="flex items-center gap-4">
          <span className="text-2xl font-bold text-primary">
            BDT {meal.price}
          </span>

          <span
            className={`font-medium ${
              meal.isAvailable ? "text-green-500" : "text-red-500"
            }`}
          >
            {meal.isAvailable ? "Available" : "Out of stock"}
          </span>
        </div>

        {/* Add to Cart button */}
        <button
          disabled={!meal.isAvailable}
         
          className="px-6 py-2 rounded-xl font-semibold transition-colors
                     bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600
                     disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
