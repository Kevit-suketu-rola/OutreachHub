import * as React from "react";

import { NavMain } from "@/components/shadcn/nav-main";
import { NavSecondary } from "@/components/shadcn/nav-secondary";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link } from "react-router-dom";
import {
  IconAnalyze,
  IconBrandCampaignmonitor,
  IconHelp,
  IconHttpConnect,
  IconNetwork,
  IconTemplate,
} from "@tabler/icons-react";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { isAdmin } = useSelector((state: RootState) => state.auth);

  const data = {
    navMain: isAdmin
      ? [
          { title: "Dashboard", url: "", icon: IconAnalyze },
          { title: "Workspaces", url: "workspaces", icon: IconNetwork },
        ]
      : [
          { title: "Home", url: "", icon: IconNetwork },
          {
            title: "Campaigns",
            url: "campaigns",
            icon: IconBrandCampaignmonitor,
          },
          { title: "Contacts", url: "contacts", icon: IconHttpConnect },
          { title: "Templates", url: "templates", icon: IconTemplate },
        ],
    navSecondary: [
      {
        title: "About",
        url: "#",
        icon: IconHelp,
      },
    ],
  };
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link to="/">
                <div className="inline w-8 h-14 rounded-full bg-gradient-to-b from-blue-400 to-purple-600"></div>
                <span className="text-base font-semibold">OutreachHub</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
    </Sidebar>
  );
}
