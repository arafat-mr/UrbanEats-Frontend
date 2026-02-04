import MealCard from '@/components/Meals/MealCard';
import NewMeals from '@/components/Meals/NewMeals';
import { MealService } from '@/services/meal.service'
import React from 'react'

export default async function page() {
 

  const {data}= await MealService.getMeals()

  
  return (
    <div>
      <NewMeals meals={data.data}/>
    </div>
  )
}
