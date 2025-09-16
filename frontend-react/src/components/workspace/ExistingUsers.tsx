import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import axios from 'axios';

import { BASE_URL } from '@/redux/slices/authSlice';
import { User } from '@/redux/slices/userSlice';
import { Workspace } from '@/redux/slices/workspaceSlice';
import { WorkspaceUser } from '@/redux/slices/workspaceUserSlice';
import type { RootState } from '@/redux/store';

import { UserItem } from '../admin/UserItem';

export const ExistingUsers: React.FC<{
  setOpenExisting: (value: boolean) => void;
  workspace: Workspace;
  filterUsers: (wu: WorkspaceUser[], users: User[], flip: boolean) => User[];
  incrementCount: () => void;
}> = ({ setOpenExisting, workspace, filterUsers, incrementCount }) => {
  const { users } = useSelector((state: RootState) => state.user);
  const [workspaceUsers, setWorkspaceUsers] = useState<WorkspaceUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      const res = await axios(`${BASE_URL}/workspace-user/all-users/${workspace._id}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setWorkspaceUsers(res.data.workspaceUsers);
    };
    fetchData();
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="bg-white p-5 rounded-lg shadow-lg">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  const usersToShow = filterUsers(workspaceUsers, users, true);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={() => setOpenExisting(false)}
    >
      <div
        className="relative bg-white w-full max-w-lg rounded-lg shadow-lg px-5 h-80 overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 flex justify-between items-center z-10 p-2 bg-white">
          <h2 className="z-10 left-0 top-0 text-xl font-semibold ">Add User</h2>
          <button
            className="mt-1 px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition sticky"
            onClick={() => setOpenExisting(false)}
          >
            close
          </button>
        </div>
        {usersToShow.length > 0 ? (
          usersToShow.map((user, i) => (
            <UserItem
              key={i}
              user={user}
              workspaceId={workspace._id}
              onClose={() => setOpenExisting(false)}
              incrementCount={incrementCount}
            />
          ))
        ) : (
          <p>No users to show</p>
        )}
      </div>
    </div>
  );
};
