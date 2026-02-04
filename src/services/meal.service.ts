import { env } from "@/env"
import { error } from "console"
import { da } from "zod/v4/locales"


const API_URL= env.API_URL
export const MealService= {
    getMeals : async function(){
        try {
            const res = await fetch(`${API_URL}/api/provider/meals`)
            const data= await res.json()

            return {data:data,error:null}
        } catch (error) {
            return {data:null,error:{message:'Something went wrong'}}
        }
    },

    getMealById :async function(id:string){

        console.log(id);
        try {

            const res= await fetch(`${API_URL}/api/provider/meals/${id}`)
            const data= await res.json()

            return data
            
            
        } catch (error) {
             return {data:null,error:{message:'Something went wrong'}}
        }

    }
//       getBlogById : async function(id: string){

//       console.log(id);
      
// try {
//    const url= new URL(`${API_URL}/posts/${id}`)
//    const res = await fetch(url.toString())
   
//    const data= await res.json()
//     console.log(data);
    
//    return {data:data,error:null}
// } catch (error) {
//    return {data:null , error :{message:'Something went wrong'}}
// }
//     }
// }
}