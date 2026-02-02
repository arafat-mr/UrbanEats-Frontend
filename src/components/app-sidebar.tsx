import * as React from "react"


import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,

  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { adminRoutes } from "@/routes/adminRoutes"
import { customerRoutes } from "@/routes/customerRoutes"
import { providerRoutes } from "@/routes/providerRoutes"
import { Route } from "@/types"

// This is sample data.
const data = {
  versions: ["1.0.1", "1.1.0-alpha", "2.0.0-beta1"],
  navMain: [
    {
      title:'',
      items: [
        {
          title: "Admin",
          url: "/dashboard",
        },
        {
          title: "Customer",
          url: "/dashboard",
        },
      ],
    }
   
  ],
}

export function AppSidebar({user, ...props }:{user :{role:string} & React.ComponentProps<typeof Sidebar>}) {

  let routes :Route[]=[]

  switch (user.role) {
    case 'ADMIN':
      routes=adminRoutes
      
      break;
    case 'CUSTOMER':
      routes=customerRoutes
      
      break;
    case 'PROVIDER':
      routes=providerRoutes
      
      break;
  
    default:
      routes=[]
      break;
  }
  return (
    <Sidebar {...props}>
     
      <SidebarContent>
        {/* We create a SidebarGroup for each parent. */}
        {routes.map((item) => (
          <SidebarGroup key={item.title}>
            {/* <SidebarGroupLabel >{item.title}</SidebarGroupLabel> */}
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={item.isActive}>
                      <Link href={item.url}>{item.title}</Link>
                    </SidebarMenuButton>
                   </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
