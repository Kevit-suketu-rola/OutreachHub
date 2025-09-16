// components/campaigns/CampaignOptions.tsx
import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';

import { Campaign, launchCampaign } from '@/redux/slices/campaignSlice';
import type { AppDispatch } from '@/redux/store';

export const CampaignOptions = ({
  campaign,
  onEdit,
  onDelete,
}: {
  campaign: Campaign;
  onEdit: () => void;
  onDelete: (id: string) => void;
}) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const handler = (e: Event) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLaunch = () => {
    dispatch(launchCampaign(campaign._id || ''));
  };

  if (localStorage.getItem('write') === 'false') return null;

  return (
    <div className="absolute top-2 right-2" ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        className="text-2xl px-2 py-1 hover:bg-gray-100 rounded"
      >
        &#8942;
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded shadow-md z-10">
          <button
            onClick={() => {
              onEdit();
              setOpen(false);
            }}
            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
          >
            Edit
          </button>
          <button
            onClick={() => {
              onDelete(campaign._id || '');
              setOpen(false);
            }}
            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
          >
            Delete
          </button>
          <button
            onClick={() => {
              handleLaunch();
              setOpen(false);
            }}
            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
          >
            Launch
          </button>
        </div>
      )}
    </div>
  );
};
