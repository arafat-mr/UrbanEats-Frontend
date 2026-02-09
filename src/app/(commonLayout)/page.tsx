import Banner from '@/components/Banner';
import FAQSection from '@/components/Faq';
import HotDealsSection from '@/components/HotDeals';
import MealCard from '@/components/Meals/MealCard';
import NewMeals from '@/components/Meals/NewMeals';
import { MealService } from '@/services/meal.service'
import React from 'react'

export default async function page() {
 

  const {data}= await MealService.getMeals()

  
  return (
    <div>
      <Banner/>
      <NewMeals meals={data.data}/>
      <HotDealsSection/>
      <FAQSection/>
    </div>
  )
}
