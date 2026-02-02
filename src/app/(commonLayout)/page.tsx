import { Button } from "@/components/ui/button";
import { UserService } from "@/services/user.service";
import { cookies } from "next/headers";



export default async function Home() {
 

  const {data,error}= await UserService.getSession()
  

  console.log('data is',data);
  
  
  return (
    <div >
    <Button>Click here</Button>
    </div>
  );
}
