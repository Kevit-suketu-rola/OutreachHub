import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

import AppNavbar from '@/components/shadcn/AppNavbar';
import { AppSidebar } from '@/components/shadcn/app-sidebar';
import { SiteHeader } from '@/components/shadcn/site-header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

const UserHome = () => {
  const navigate = useNavigate();
  useEffect(() => {
    if (!localStorage.getItem('user-token')) navigate('/');
  });

  return (
    <div>
      <SidebarProvider
        style={
          {
            '--sidebar-width': 'calc(var(--spacing) * 72)',
            '--header-height': 'calc(var(--spacing) * 12)',
          } as React.CSSProperties
        }
      >
        <AppSidebar variant="inset" />
        <AppNavbar />
        <SidebarInset>
          <SiteHeader />
          <Outlet />
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
};

export default UserHome;
