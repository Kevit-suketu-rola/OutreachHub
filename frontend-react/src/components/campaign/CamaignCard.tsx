import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { IconTrash } from '@tabler/icons-react';

import {
  Campaign,
  UpdateCampaign,
  deleteCampaign,
  editCampaign,
} from '@/redux/slices/campaignSlice';
import type { AppDispatch, RootState } from '@/redux/store';

import { CampaignOptions } from './CampaignOptions';
import { UpdateCampaignModal } from './UpdateCampaignModal';

export const CampaignCard = ({ campaign }: { campaign: Campaign }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { templates } = useSelector((state: RootState) => state.messageTemplate);

  const [openEdit, setOpenEdit] = useState(false);

  const onDelete = (id: string) => {
    dispatch(deleteCampaign(id));
  };

  const onEdit = () => {
    setOpenEdit(true);
  };

  const handleUpdate = (data: Campaign) => {
    const formated: UpdateCampaign = {
      details: {
        templateId: data.templateId as string,
        name: data.name,
        startDate: new Date(data.startDate || ''),
        endDate: new Date(data.endDate || ''),
      },
      tags: data.tags,
    };

    dispatch(editCampaign({ id: campaign._id || '', data: formated }));
    setOpenEdit(false);
  };

  return (
    <div className="relative bg-white border border-gray-200 rounded-lg shadow-sm p-4 hover:shadow-md transition">
      <h2 className="text-lg font-semibold text-gray-800">{campaign.name}</h2>
      <div className="px-">
        {campaign.tags && campaign.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {campaign.tags.map((tag: string, index: number) => (
              <span
                key={index}
                className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
      <p className="text-sm text-gray-500 mt-2">
        <b>Start:</b> {new Date(campaign.startDate).toLocaleDateString()} <br />
        <b>End:</b> {new Date(campaign.endDate).toLocaleDateString()}
      </p>
      <span
        className={`absolute bottom-1 right-1 rounded px-3 py-1 text-xs font-semibold ${campaign.status}`}
      >
        {campaign.status}
      </span>
      {campaign.status === 'Draft' && (
        <CampaignOptions campaign={campaign} onEdit={onEdit} onDelete={onDelete} />
      )}

      {campaign.status === 'Completed' && (
        <button onClick={() => onDelete(campaign._id || '')}>
          <IconTrash className="text-red-600 absolute top-3 right-2 w-5 hover:cursor-pointer" />
        </button>
      )}
      {openEdit && (
        <UpdateCampaignModal
          campaign={{
            ...{ _id: '', name: '', tags: [], startDate: null, endDate: null, templateId: '' },
            ...campaign,
          }}
          templates={templates}
          onClose={() => setOpenEdit(false)}
          onSubmit={handleUpdate}
        />
      )}
    </div>
  );
};
