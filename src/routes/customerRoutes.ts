import { Route } from "@/types";

 export const customerRoutes :Route[]= [
    {
      title:'Customer Dashboard',
      items: [
        {
          title: "Analytics",
          url: "/dashboard/analytics",
        },
        {
          title: "Profile",
          url: "/dashboard/profile",
        },
        {
          title: "View Cart Itmes",
          url: "/dashboard/cart",
        },
        {
          title: "View Orders",
          url: "/dashboard/orders",
        }
    
      ],
    }
   
  ]