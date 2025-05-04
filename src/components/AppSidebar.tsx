
import { Home, LineChart, PiggyBank, Receipt, Settings } from "lucide-react";
import { NavLink } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const menuItems = [
  {
    title: "Dashboard",
    icon: Home,
    path: "/",
  },
  {
    title: "Expenses",
    icon: Receipt,
    path: "/expenses",
  },
  {
    title: "Budgets",
    icon: PiggyBank,
    path: "/budgets",
  },
  {
    title: "Analytics",
    icon: LineChart,
    path: "/analytics",
  },
  {
    title: "Settings",
    icon: Settings,
    path: "/settings",
  },
];

export function AppSidebar() {
  return (
    <>
      <Sidebar className="border-r">
        <SidebarHeader className="p-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
              <span className="text-lg font-bold text-white">M</span>
            </div>
            <h1 className="text-lg font-bold">Mindful Money</h1>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.path}>
                <SidebarMenuButton asChild>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      isActive
                        ? "flex items-center gap-3 rounded-md bg-secondary text-secondary-foreground px-3 py-2"
                        : "flex items-center gap-3 rounded-md px-3 py-2 hover:bg-secondary/50"
                    }
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.title}</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <div className="fixed top-4 left-4 z-40 lg:hidden">
        <SidebarTrigger />
      </div>
    </>
  );
}
