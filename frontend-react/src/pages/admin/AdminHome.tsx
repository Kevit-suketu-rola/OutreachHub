import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Outlet, useNavigate } from 'react-router-dom';

import AppNavbar from '@/components/shadcn/AppNavbar';
import { AppSidebar } from '@/components/shadcn/app-sidebar';
import { SiteHeader } from '@/components/shadcn/site-header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { fetchAllCampaigns } from '@/redux/slices/campaignSlice';
import type { AppDispatch } from '@/redux/store';

const AdminHome = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchAllCampaigns());
  }, [dispatch]);

  if (!localStorage.getItem('token')) navigate('/login');

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
        <AppSidebar variant="floating" />
        <AppNavbar />
        <SidebarInset>
          <SiteHeader />
          <Outlet />
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
};

export default AdminHome;
