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
          title: "Manage Users",
          url: "/dashboard/users",
        },

        {
          title: "Manage Orders",
          url: "/dashboard/orders",
        },
        
        {
          title:'Manage Categories',
          url:'/dashboard/manage-categories'
        },{
          title:"Back To Home",
          url:'/'
        }
      ],
    }
   
  ]