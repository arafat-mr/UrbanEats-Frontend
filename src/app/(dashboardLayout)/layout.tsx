import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

export default function DashboardLayout({admin,customer,provider}:{

  admin:React.ReactNode;
  customer:React.ReactNode;
  provider:React.ReactNode;
}) {


  const userInfo= {
    role:'ADMIN'
  }
  return (
    <SidebarProvider>
      <AppSidebar user={userInfo} />
      <SidebarInset>
        <header className="bg-background sticky top-0 flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
        {
          userInfo.role==='ADMIN'?admin:userInfo.role==='CUSTOMER'?customer:userInfo.role==='PROVIDER'?provider:null
        }
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
