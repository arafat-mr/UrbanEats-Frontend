import { Route } from "@/types";

 export const adminRoutes : Route[]= [
    {
      title:'Admin Dashboard',
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
          title: "Manage Customers",
          url: "/dashboard/users",
        },
        {
          title: "Manage Providers",
          url: "/dashboard/providers",
        },
        {
          title: "Manage Meals",
          url: "/dashboard/meals",
        },
        {
          title: "Manage Orders",
          url: "/dashboard/orders",
        },
      ],
    }
   
  ]