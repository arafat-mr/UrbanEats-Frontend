import { Route } from "@/types";

 export const providerRoutes :Route[]= [
    {
      title:'Provider Dashboard',
      items: [
        {
          title: "Analytics",
          url: "/dashboard/provider-analytics",
        },
        {
          title: "Profile",
          url: "/dashboard/provider-profile",
        },
        {
          title: "See Orders",
          url: "/dashboard/my-orders",
        },
        {
          title: "Add Meal",
          url: "/dashboard/add-meals",
        },
        {
          title: "My Menu",
          url: "/dashboard/my-meals",
        },{
          title:"Back To Home",
          url:'/'
        }
      ],
    }
   
  ]