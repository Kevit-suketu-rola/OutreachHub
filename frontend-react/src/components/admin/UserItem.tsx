import { useState } from 'react';
import { useDispatch } from 'react-redux';

import { User } from '@/redux/slices/userSlice';
import { addUser } from '@/redux/slices/workspaceUserSlice';
import type { AppDispatch } from '@/redux/store';

export const UserItem: React.FC<{
  user: User;
  workspaceId: string;
  onClose: () => void;
  incrementCount: () => void;
}> = ({ user, workspaceId, onClose, incrementCount }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [permissions, setPermissions] = useState({
    read: false,
    write: false,
    allowAdd: false,
  });

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setPermissions((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleAdd = () => {
    try {
      incrementCount();
      dispatch(
        addUser({
          userId: user._id,
          workspaceId,
          permissions,
        }),
      );
      onClose();
    } catch {
      alert('error adding user');
    }
  };

  return (
    <div className="group flex items-center justify-between p-3 border rounded hover:shadow transition">
      <div>
        <p className="font-semibold text-gray-800">{user.name}</p>
        <p className="text-gray-600 text-sm">{user.contactInfo?.email}</p>
        <p className="text-gray-600 text-sm">
          {user.contactInfo?.countryCode}
          {user.contactInfo?.phoneNumber}
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleAdd();
        }}
        className="hidden group-hover:flex items-center space-x-3"
      >
        {['write', 'allowAdd'].map((perm, i) => (
          <label key={i} className="flex items-center space-x-1 text-sm capitalize">
            <input
              type="checkbox"
              name={perm}
              checked={permissions[perm as keyof typeof permissions]}
              onChange={handleCheckboxChange}
              className="accent-blue-600"
            />
            <span>{perm.replace('allowAdd', 'Allow Add')}</span>
          </label>
        ))}

        <button
          type="submit"
          className="ml-2 px-2 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Add
        </button>
      </form>
    </div>
  );
};
