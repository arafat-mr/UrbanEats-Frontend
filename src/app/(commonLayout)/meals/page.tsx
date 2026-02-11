import MealsPage from "@/components/Mealspage";
import React, { Suspense } from "react";


export default function Page() {
  return (
    <Suspense fallback={<p>Loading meals...</p>}>
      <MealsPage/>
    </Suspense>
  );
}
