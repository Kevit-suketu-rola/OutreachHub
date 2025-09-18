import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Campaign } from '@/redux/slices/campaignSlice';
import { fetchAllContacts } from '@/redux/slices/contactSlice';
import { fetchAllWorkspaces } from '@/redux/slices/workspaceSlice';
import type { AppDispatch, RootState } from '@/redux/store';
import { User } from '@/redux/slices/userSlice';

export const AdminSectionCards: React.FC<{ campaigns: Campaign[], users: User[] }> = ({ campaigns, users }) => {
  const userLoading = useSelector((state: RootState) => state.user?.userLoading);
  const workspaces = useSelector((state: RootState) => state.workspace?.workspaces);
  const contacts = useSelector((state: RootState) => state.contact?.contacts);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchAllWorkspaces());
    dispatch(fetchAllContacts());
  }, [dispatch]);

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="text-center font-semibold text-2xl">
            Workspaces
          </CardDescription>
        </CardHeader>
        <CardTitle className="text-6xl text-center font-bold">
          {userLoading ? '-' : workspaces?.length}
        </CardTitle>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="text-center font-semibold text-2xl">Users</CardDescription>
        </CardHeader>
        <CardTitle className="text-6xl text-center font-bold">
          {userLoading ? '-' : users.length}
        </CardTitle>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="text-center font-semibold text-2xl">
            Campaigns
          </CardDescription>
        </CardHeader>
        <CardTitle className="text-6xl text-center font-bold">{campaigns.length}</CardTitle>
        <div className="m-auto bg-blue-500 rounded px-4 py-2 text-white">
          Running: {campaigns.filter((c: Campaign) => c.status === 'Running').length}
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
