import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { fetchAllCampaigns } from '@/redux/slices/campaignSlice';
import type { AppDispatch, RootState } from '@/redux/store';

import { CampaignsTable } from '../campaign/CampaignsTable';
import { UserBarChart } from '../shadcn/BarChart';
import { AdminCampaignsChart } from './AdminCampaignsChart';
import { AdminSectionCards } from './AdminSectionCards';

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const { campaigns } = useSelector((state: RootState) => state.campaign);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchAllCampaigns());
  }, [dispatch]);

  useEffect(() => {
    if (!localStorage.getItem('token')) navigate('/');
  });
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 sm:gap-6 md:py-6">
          <AdminSectionCards campaigns={campaigns} />
          <div className="px-4 lg:px-6 sm:flex xs:flex-col gap-3 justify-between">
            <UserBarChart />
            <AdminCampaignsChart />
          </div>
          <CampaignsTable />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
