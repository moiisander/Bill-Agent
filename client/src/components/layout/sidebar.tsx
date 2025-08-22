import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "../ui/sidebar";
import { ThemeToggle } from "./theme-toggle";
import { FileText, FilePen } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export function AppSidebar() {
  const location = useLocation();

  return (
    <Sidebar className="overflow-hidden">
      <SidebarHeader className="px-2 py-4">
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <span className="text-sm font-bold">BA</span>
          </div>
          <div className="flex flex-col min-w-0">
            <h1 className="text-sm font-semibold truncate">Bill Agent</h1>
            <p className="text-xs text-muted-foreground truncate">Accounting System</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="overflow-hidden">
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <Link to="/" className="w-full">
                  <SidebarMenuButton 
                    className="w-full" 
                    data-active={location.pathname === "/"}
                  >
                    <FilePen className="h-4 w-4 shrink-0" />
                    <span className="truncate">New voucher</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Link to="/history" className="w-full">
                  <SidebarMenuButton 
                    className="w-full"
                    data-active={location.pathname === "/history"}
                  >
                    <FileText className="h-4 w-4 shrink-0" />
                    <span className="truncate">History</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarSeparator />
      <SidebarFooter className="px-4 py-4">
        <div className="flex items-center justify-between min-w-0">
          <span className="text-xs text-muted-foreground truncate">Theme</span>
          <ThemeToggle />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
} 