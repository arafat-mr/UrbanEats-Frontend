import { env } from "@/env";
import { date } from "better-auth";
import { getSession } from "better-auth/api";
import { error } from "console";
import { cookies } from "next/headers";

const AUTH_URL= env.AUTH_URL
export const UserService = {

    getSession  : async function(){
        try {
             const cookieStore= await cookies()
  // console.log(cookieStore.get('better-auth.session_token'));
  console.log(cookieStore.toString());
  
  
  const res = await fetch(`${AUTH_URL}/get-session`,{
    headers :{
      Cookie :cookieStore.toString()
    },
    cache:'no-store'
  })

const session = await res.json()

if(!session){
    return {data:null,error:{message:'Session is missing'}}
}

return {
    data :session,error:null
}

        }
        
        catch (error) {
            console.log(error);
            return {
                data:null,error :{message:'something went wrong'}
            }
        }
        }
}