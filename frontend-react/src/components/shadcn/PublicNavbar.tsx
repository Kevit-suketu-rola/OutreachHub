import { useState } from 'react';
import { NavLink } from 'react-router-dom';

import { Menu, X } from 'lucide-react';

export default function PublicNavbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="w-full bg-white shadow-md">
      <div className="px-6 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold text-blue-600">OutreachHub</div>

        <div className="hidden md:flex space-x-6 text-gray-700 font-medium">
          <NavLink to="/" className="hover:text-blue-600">
            Home
          </NavLink>
        </div>

        <div className="hidden md:flex space-x-4">
          <NavLink
            to="/login"
            className="px-4 py-2 rounded-lg border border-blue-600 text-blue-600 hover:bg-blue-50 transition"
          >
            Login
          </NavLink>
          <NavLink
            to="/admin-login"
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            Admin
          </NavLink>
        </div>

        <button className="md:hidden text-gray-700" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden px-6 pb-4 space-y-3 text-gray-700 font-medium">
          <NavLink to="/" className="block hover:text-blue-600">
            Home
          </NavLink>
          <NavLink to="/about" className="block hover:text-blue-600">
            About
          </NavLink>
          <NavLink
            to="/login"
            className="block px-4 py-2 rounded-lg border border-blue-600 text-blue-600 hover:bg-blue-50 transition"
          >
            Login
          </NavLink>
          <NavLink
            to="/admin-login"
            className="block px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            Admin
          </NavLink>
        </div>
      )}
    </nav>
  );
}
