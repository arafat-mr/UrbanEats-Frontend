import { Route } from "@/types";

 export const adminRoutes : Route[]= [
    {
      title:'Admin Dashboard',
      items: [
        {
          title: "Analytics",
          url: "/dashboard/admin-analytics",
        },
        {
          title: "Profile",
          url: "/dashboard/admin-profile",
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
        },{
          title:"Back To Home",
          url:'/'
        }
      ],
    }
   
  ]