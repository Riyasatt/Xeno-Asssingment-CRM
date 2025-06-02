import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "../components/ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  Plus,
  History,
  Menu,
  LogOut,
} from "lucide-react";

export default function DashboardLayout({ children, onLogout }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Customers", href: "/customers", icon: Users },
    { name: "Orders", href: "/orders", icon: ShoppingCart },
    { name: "Create Campaign", href: "/create-campaign", icon: Plus },
    { name: "Campaign History", href: "/campaign-history", icon: History },
  ];

  return (
    <div className="min-h-screen bg-[#0e0e11] text-gray-100 flex flex-col">
      {/* Top Navigation */}
      <nav className="bg-[#1a1a1d] border-b border-white/10 px-4 sm:px-6 lg:px-8 shadow-sm">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu className="h-6 w-6 text-gray-200" />
            </Button>
            <h1 className="text-xl font-bold text-white">XenoCRM</h1>
          </div>

          <div className="flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-8 w-8 p-0 rounded-full focus:outline-none"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src="/placeholder.svg?height=32&width=32"
                      alt="User"
                    />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48 bg-[#1a1a1d] border-white/10 text-gray-100" align="end">
                <DropdownMenuItem
                  onClick={onLogout}
                  className="hover:bg-white/10 cursor-pointer"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </nav>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside
          className={`${sidebarOpen ? "block" : "hidden"} lg:block lg:w-64 bg-[#141416] border-r border-white/10`}
        >
          <nav className="p-6 space-y-2">
            {navigation.map(({ name, href, icon: Icon }) => {
              const isActive = location.pathname === href;
              return (
                <Button
                  key={name}
                  variant={isActive ? "secondary" : "ghost"}
                  className={`w-full justify-start ${
                    isActive ? "bg-white/10 text-white" : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                  onClick={() => {
                    navigate(href);
                    setSidebarOpen(false);
                  }}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {name}
                </Button>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 bg-[#0e0e11]">{children}</main>
      </div>
    </div>
  );
}
