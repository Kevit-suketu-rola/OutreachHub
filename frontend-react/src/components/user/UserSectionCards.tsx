import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getAllCampaignsOfWorkspace } from '@/redux/slices/campaignSlice';
import { fetchContactsOfWorkspace } from '@/redux/slices/contactSlice';
import type { AppDispatch, RootState } from '@/redux/store';

export const UserSectionCards = () => {
  const dispatch = useDispatch<AppDispatch>();
  const workspaceCampaigns = useSelector((state: RootState) => state.campaign?.workspaceCampaigns);
  const contacts = useSelector((state: RootState) => state.contact?.contacts);
  const currentWorkspace = useSelector(
    (state: RootState) => state.user?.currentWorkspace
  );

  useEffect(() => {
    dispatch(getAllCampaignsOfWorkspace(currentWorkspace?.id));
    dispatch(fetchContactsOfWorkspace(currentWorkspace?.id));
  }, [dispatch]);

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-1 @5xl/main:grid-cols-2">

      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="text-center font-semibold text-2xl">
            Campaigns
          </CardDescription>
        </CardHeader>
        <CardTitle className="text-6xl text-center font-bold">
          {workspaceCampaigns?.length}
        </CardTitle>
        <div className="m-auto bg-blue-500 rounded px-4 py-2 text-white">
          Running: {workspaceCampaigns?.filter((c) => c.status === 'Running').length}
        </div>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="text-center font-semibold text-2xl">Contacts</CardDescription>
        </CardHeader>
        <CardTitle className="text-6xl text-center font-bold">{contacts?.length}</CardTitle>
      </Card>
    </div>
  );
};
