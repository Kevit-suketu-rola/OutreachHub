import React from 'react';
import { useDispatch } from 'react-redux';

import { User } from '@/redux/slices/userSlice';
import { Workspace } from '@/redux/slices/workspaceSlice';
import { removeUser } from '@/redux/slices/workspaceUserSlice';
import type { AppDispatch } from '@/redux/store';

const WorkspaceUsersModal: React.FC<{
  users: User[];
  setOpenUsers: (value: boolean) => void;
  workspace: Workspace;
  decrementCount: () => void;
}> = ({ users, setOpenUsers, workspace, decrementCount }) => {
  const dispatch = useDispatch<AppDispatch>();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={() => setOpenUsers(false)}
    >
      <div
        className="relative bg-white w-full max-w-lg rounded-lg shadow-lg px-5 h-80 overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 flex justify-between items-center z-10 p-2 bg-white">
          <h2 className="z-10 left-0 top-0 text-xl font-semibold ">Users</h2>
          <button
            className="mt-1 px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition sticky"
            onClick={() => setOpenUsers(false)}
          >
            close
          </button>
        </div>
        {users.length > 0 ? (
          users.map((user, i) => {
            const handleDelete = () => {
              dispatch(removeUser({ userId: user._id, workspaceId: workspace._id }));
              users.filter((u) => u._id !== user._id);
              setOpenUsers(false);
              decrementCount();
            };

            return (
              <div
                key={i}
                className="group flex items-center justify-between p-3 border rounded hover:shadow transition"
              >
                <div>
                  <p className="font-semibold text-gray-800">{user.name}</p>
                  <p className="text-gray-600 text-sm">{user.contactInfo?.email}</p>
                  <p className="text-gray-600 text-sm">
                    {user.contactInfo?.countryCode}
                    {user.contactInfo?.phoneNumber}
                  </p>
                </div>

                <button
                  type="submit"
                  className="hidden group-hover:flex ml-2 px-2 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                  onClick={handleDelete}
                >
                  Remove
                </button>
              </div>
            );
          })
        ) : (
          <p>No users to show</p>
        )}
      </div>
    </div>
  );
};

export default WorkspaceUsersModal;
