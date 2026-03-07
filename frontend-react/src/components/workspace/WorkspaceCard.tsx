import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import axios from 'axios';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BASE_URL } from '@/redux/slices/authSlice';
import { User } from '@/redux/slices/userSlice';
import { Workspace } from '@/redux/slices/workspaceSlice';
import { WorkspaceUser } from '@/redux/slices/workspaceUserSlice';
import type { RootState } from '@/redux/store';

import { CreateUserModal } from './CreateUserModal';
import { ExistingUsers } from './ExistingUsers';
import { WorkspaceOptions } from './WorkspaceOptions';
import WorkspaceUsersModal from './WorkspaceUsersModal';

const WorkspaceCard: React.FC<{
  workspace: Workspace;
  onEdit: (_: Workspace) => void;
  onDelete: (_: string) => void;
}> = ({ workspace, onEdit, onDelete }) => {
  const [workspaceUsers, setWorkspaceUsers] = useState<WorkspaceUser[]>([]);
  const [campaigns, setCampaigns] = useState([]);
  const [openExisting, setOpenExisting] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);
  const [openUsers, setOpenUsers] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userCount, setUserCount] = useState(0);
  const users = useSelector((state: RootState) => state.user?.users);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        const res1 = await axios(`${BASE_URL}/workspace-user/all-users/${workspace._id}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setWorkspaceUsers(res1.data.workspaceUsers);

        const res2 = await axios(`${BASE_URL}/campaign/all-of-workspace/${workspace._id}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setCampaigns(res2.data.campaigns);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    setUserCount(workspaceUsers.length);
  }, [workspaceUsers]);

  const filterUsers = (wu: WorkspaceUser[], users: User[], flip: boolean): User[] => {
    const workspaceUserIds = wu.map((wu: WorkspaceUser) => {
      if (typeof wu.userId === 'string') {
        return wu.userId;
      } else {
        return wu.userId._id;
      }
    });
    let filtered = [];
    if (flip) {
      filtered = users.filter((user: User) => !workspaceUserIds.includes(user._id));
    } else {
      filtered = users.filter((user: User) => workspaceUserIds.includes(user._id));
    }
    return filtered;
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Card className="w-full max-w-md shadow-md border bg-gradient-to-br from-blue-100 to-purple-100">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>{workspace.name}</CardTitle>

            <WorkspaceOptions
              workspace={workspace}
              onEdit={onEdit}
              onDelete={onDelete}
              setOpenExisting={setOpenExisting}
              setOpenCreate={setOpenCreate}
              setOpenUsers={setOpenUsers}
            />
          </div>
          <p className="text-sm text-muted-foreground">{workspace.description.length > 50 ? workspace.description.slice(0, 50) + '...' : workspace.description}</p>
        </CardHeader>
        <CardContent>
          <div className="text-sm space-y-1">
            <p>
              <strong>Tags:</strong> {workspace.tags.join(', ')}
            </p>
            <p>
              <strong>Users:</strong> {userCount}
            </p>
            <p>
              <strong>Campaigns:</strong> {campaigns.length}
            </p>
            <p>
              <strong>Created:</strong>{' '}
              {new Date(workspace.createdAt as string).toLocaleDateString()}
            </p>
          </div>
        </CardContent>
      </Card>

      {openExisting && (
        <div>
          <ExistingUsers
            filterUsers={filterUsers}
            setOpenExisting={setOpenExisting}
            workspace={workspace}
            incrementCount={() => setUserCount(userCount + 1)}
          />
        </div>
      )}

      {openCreate && (
        <div>
          <CreateUserModal
            isOpen={openCreate}
            onClose={() => setOpenCreate(false)}
            workspace={workspace}
            incrementCount={() => setUserCount(userCount + 1)}
          />
        </div>
      )}

      {openUsers && (
        <div>
          <WorkspaceUsersModal
            users={filterUsers(workspaceUsers, users || [], false)}
            setOpenUsers={setOpenUsers}
            workspace={workspace}
            decrementCount={() => setUserCount(userCount - 1)}
          />
        </div>
      )}
    </div>
  );
};
export default WorkspaceCard;
