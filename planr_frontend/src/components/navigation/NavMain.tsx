// src/components/navigation/NavMain.tsx

import { NavLink } from "react-router-dom";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import { Plus, Minus } from "lucide-react";
import { navItems } from "./navItems";

export default function NavMain() {
  return (
    <SidebarMenu>
      {navItems.map((item) => (
        <SidebarMenuItem key={item.title}>
          {item.subItems ? (
            <Collapsible>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton className="w-full justify-between">
                  <div className="flex items-center">
                    <item.icon className="mr-2 h-4 w-4" />
                    <span>{item.title}</span>
                  </div>
                  <Plus className="h-4 w-4 group-data-[state=open]:hidden" />
                  <Minus className="h-4 w-4 hidden group-data-[state=open]:block" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {item.subItems.map((subItem) => (
                    <SidebarMenuSubItem key={subItem.title}>
                      <NavLink to={`/dashboard/${subItem.url}`}>
                        <SidebarMenuSubButton>
                          {subItem.title}
                        </SidebarMenuSubButton>
                      </NavLink>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </Collapsible>
          ) : (
            <NavLink to={`/dashboard/${item.url}`}>
              <SidebarMenuButton>
                <div className="flex items-center">
                  <item.icon className="mr-2 h-4 w-4" />
                  <span>{item.title}</span>
                </div>
              </SidebarMenuButton>
            </NavLink>
          )}
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
