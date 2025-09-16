import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';

import { Menu, X } from 'lucide-react';

import { logoutAdmin } from '../../redux/slices/authSlice';
import type { AppDispatch } from '../../redux/store';

export const AdminNav = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const resultAction = await dispatch(logoutAdmin());

    if (logoutAdmin.fulfilled.match(resultAction)) {
      navigate('/');
    } else {
      alert('Error logging in: ' + resultAction.payload);
    }
  };

  return (
    <nav className="w-full bg-white shadow-md">
      <div className="px-6 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold text-gray-800">Admin Portal</div>

        <div className="hidden md:flex space-x-6 text-gray-700 font-medium">
          <NavLink
            to="/admin/workspaces"
            className={({ isActive }) =>
              isActive ? 'text-blue-600 font-semibold' : 'hover:text-blue-600'
            }
          >
            Workspaces
          </NavLink>
          <NavLink
            to="/admin/users"
            className={({ isActive }) =>
              isActive ? 'text-blue-600 font-semibold' : 'hover:text-blue-600'
            }
          >
            User Management
          </NavLink>
        </div>

        <div className="hidden md:flex">
          <button
            className="px-4 py-2 rounded-lg border border-red-600 text-red-600 hover:bg-red-50 transition"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>

        <button
          className="md:hidden text-gray-700"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden px-6 pb-4 space-y-3 text-gray-700 font-medium">
          <NavLink to="/admin/workspaces" className="block hover:text-blue-600">
            Workspaces
          </NavLink>
          <NavLink to="/admin/users" className="block hover:text-blue-600">
            User Management
          </NavLink>
          <button
            className="block px-4 py-2 rounded-lg border border-red-600 text-red-600 hover:bg-red-50 transition"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};
