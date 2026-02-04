import { NextRequest, NextResponse } from "next/server"
import { UserService } from "./services/user.service"
import { Roles } from "./constants/userRole"

export async function proxy(request: NextRequest) {
const pathname=request.nextUrl.pathname
 let isAuthenticated= false
 let isAdmin=false

 const {data}= await UserService.getSession()
 if(data){
 isAuthenticated=true
 isAdmin=data.user.role===Roles.admin
 }
    console.log(data);
    
  if(!isAuthenticated){
    return NextResponse.redirect(new URL('/login',request.url))
  }  

  
  return NextResponse.next()
}
 
export const config = {
  matcher: '/dashboard',
}