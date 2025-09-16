import { useState } from 'react';
import { useSelector } from 'react-redux';
import { NavLink, useLocation } from 'react-router-dom';

import {
  IconAnalyze,
  IconBrandCampaignmonitor,
  IconHelp,
  IconHttpConnect,
  IconNetwork,
  IconTemplate,
} from '@tabler/icons-react';

import type { RootState } from '@/redux/store';

import LogoutButton from '../auth/LogoutButton';

export default function AppNavbar() {
  const { isAdmin } = useSelector((state: RootState) => state.auth);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const data = {
    navMain: isAdmin
      ? [
          { title: 'Dashboard', url: '', icon: IconAnalyze },
          { title: 'Workspaces', url: 'workspaces', icon: IconNetwork },
        ]
      : [
          { title: 'Home', url: '', icon: IconNetwork },
          {
            title: 'Campaigns',
            url: 'campaigns',
            icon: IconBrandCampaignmonitor,
          },
          { title: 'Contacts', url: 'contacts', icon: IconHttpConnect },
          { title: 'Templates', url: 'templates', icon: IconTemplate },
        ],
    navSecondary: [
      {
        title: 'About',
        url: '/about',
        icon: IconHelp,
      },
    ],
  };

  return (
    <nav className="bg-white border-b border-gray-200 shadow-md fixed w-full top-0 z-50 block md:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-md"></div>
          <span className="font-bold text-lg select-none">OutreachHub</span>
        </div>

        <div className="hidden md:flex space-x-6 items-center">
          {data.navMain.map(({ title, url, icon: Icon }, idx) => (
            <NavLink
              key={idx}
              to={url}
              className={({ isActive }) =>
                `flex items-center space-x-2 px-3 py-2 rounded-md font-medium transition-colors
                 ${
                   isActive
                     ? 'bg-indigo-100 text-indigo-700'
                     : 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-600'
                 }`
              }
              onClick={() => setMenuOpen(false)}
            >
              {Icon && <Icon className="w-5 h-5" />}
              <span>
                {title + 'nknk'}
                {!isAdmin && location.pathname !== '/user' && title === 'Home' && (
                  <span className="ml-auto text-blue-500 font-bold">Switch Workspace</span>
                )}
              </span>
            </NavLink>
          ))}

          {data.navSecondary.map(({ title, url, icon: Icon }, idx) => (
            <NavLink
              key={idx}
              to={url}
              className={({ isActive }) =>
                `flex items-center space-x-2 px-3 py-2 rounded-md font-medium transition-colors
                 ${
                   isActive
                     ? 'bg-indigo-100 text-indigo-700'
                     : 'text-gray-500 hover:bg-indigo-50 hover:text-indigo-600'
                 }`
              }
              onClick={() => setMenuOpen(false)}
            >
              {Icon && <Icon className="w-5 h-5" />}
              <span>{title}</span>
            </NavLink>
          ))}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden flex items-center justify-center p-2 rounded-md text-gray-700 hover:bg-indigo-100 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {menuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>
      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-inner">
          <div className="px-4 py-3 space-y-1">
            {data.navMain.map(({ title, url, icon: Icon }, idx) => (
              <NavLink
                key={idx}
                to={url}
                className={({ isActive }) =>
                  `flex items-center space-x-2 px-3 py-2 rounded-md font-medium transition-colors
                   ${
                     isActive
                       ? 'bg-indigo-100 text-indigo-700'
                       : 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-600'
                   }`
                }
                onClick={() => setMenuOpen(false)}
              >
                {Icon && <Icon className="w-5 h-5" />}
                <span>{title}</span>
              </NavLink>
            ))}

            {data.navSecondary.map(({ title, url, icon: Icon }, idx) => (
              <NavLink
                key={idx}
                to={url}
                className={({ isActive }) =>
                  `flex items-center space-x-2 px-3 py-2 rounded-md font-medium transition-colors
                   ${
                     isActive
                       ? 'bg-indigo-100 text-indigo-700'
                       : 'text-gray-500 hover:bg-indigo-50 hover:text-indigo-600'
                   }`
                }
                onClick={() => setMenuOpen(false)}
              >
                {Icon && <Icon className="w-5 h-5" />}
                <span>{title}</span>
              </NavLink>
            ))}
            <div className="space-x-2f text-center bg-gray-200 hover:bg-red-600 hover:text-white rounded-md font-medium transition">
              <LogoutButton />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
