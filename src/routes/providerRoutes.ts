import { Route } from "@/types";

 export const providerRoutes :Route[]= [
    {
      title:'Provider Dashboard',
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
          title: "See Orders",
          url: "/dashboard/my-orders",
        },
        {
          title: "Add Meal",
          url: "/dashboard/add-meals",
        },
        {
          title: "My Meals",
          url: "/dashboard/me-meals",
        },
      ],
    }
   
  ]