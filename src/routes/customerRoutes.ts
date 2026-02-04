import { Route } from "@/types";

 export const customerRoutes :Route[]= [
    {
      title:'Customer Dashboard',
      items: [
        {
          title: "Analytics",
          url: "/dashboard/customer-analytics",
        },
        {
          title: "Profile",
          url: "/dashboard/customer-profile",
        },
        {
          title: "View Cart Itmes",
          url: "/dashboard/cart",
        },
        {
          title: "View Orders",
          url: "/dashboard/orders",
        },
        {
          title:"Back To Home",
          url:'/'
        }
    
      ],
    }
   
  ]