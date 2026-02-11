import Banner from '@/components/Banner';
import FAQSection from '@/components/Faq';
import HotDealsSection from '@/components/HotDeals';
import HotDealsPage from '@/components/layout/HotDeals';
import MealCard from '@/components/Meals/MealCard';
import NewMeals from '@/components/Meals/NewMeals';
import { ReviewService } from '@/services/hotDeal.service';
import { MealService } from '@/services/meal.service'
import { UserService } from '@/services/user.service';
import React from 'react'

export default async function page() {
 

  const {data}= await MealService.getMeals()
  // const data= await UserService.getSession()
  console.log('data is',data);
  
  
  return (
    <div>
      <Banner/>
      <NewMeals meals={data.data}/>
       <HotDealsPage/> 
      <FAQSection/>
    </div>
  )
}
