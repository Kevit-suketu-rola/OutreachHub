import { IconCirclePlusFilled, type Icon } from "@tabler/icons-react";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useLocation, useNavigate } from "react-router-dom";
import { createWorkspace } from "@/redux/slices/workspaceSlice";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/redux/store";
import WorkspaceManageModal from "../workspace/WorkspaceManageModal";
import { useState } from "react";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: Icon;
  }[];
}) {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [open, setOpen] = useState(false);
  const { isAdmin } = useSelector((state: RootState) => state.auth);
  const location = useLocation();

  const handleCreateWorkspace = (workspace: any) => {
    dispatch(createWorkspace(workspace));
    setOpen(false);
  };

  return (
    <div>
      <SidebarGroup>
        <SidebarGroupContent className="flex flex-col gap-2">
          <SidebarMenu>
            <SidebarMenuItem className="flex items-center gap-2">
              {isAdmin && (
                <SidebarMenuButton
                  tooltip="Create Workspace"
                  className=" text-blue-600 bg-white font-bold border border-blue-600 hover:text-white hover:bg-blue-600 transition active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear"
                  onClick={() => setOpen(true)}
                >
                  <IconCirclePlusFilled />
                  <span>Create Workspace</span>
                </SidebarMenuButton>
              )}
            </SidebarMenuItem>
          </SidebarMenu>
          <SidebarMenu>
            {items.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  tooltip={item.title}
                  onClick={() => navigate(item.url)}
                >
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                  {!isAdmin &&
                    location.pathname !== "/user" &&
                    item.title === "Home" && (
                      <span className="ml-auto text-blue-500 font-bold">
                        Switch Workspace
                      </span>
                    )}
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      {open && (
        <WorkspaceManageModal
          onClose={() => {
            setOpen(false);
          }}
          onSubmit={handleCreateWorkspace}
          open={open}
          workspace={{
            _id: "",
            name: "",
            description: "",
            tags: [],
            createdAt: "",
            creator: "",
          }}
        />
      )}
    </div>
  );
}
