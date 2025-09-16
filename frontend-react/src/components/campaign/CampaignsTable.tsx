import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Campaign, fetchACampaign, fetchAllCampaigns } from '@/redux/slices/campaignSlice';
import type { AppDispatch, RootState } from '@/redux/store';

import { CampaignDetailsModal } from './CampaignDetailsModal';

export const CampaignsTable = () => {
  const { workspaceCampaigns, campaign, loading, campaigns } = useSelector(
    (state: RootState) => state.campaign,
  );
  const { isAdmin } = useSelector((state: RootState) => state.auth);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (isAdmin) {
      dispatch(fetchAllCampaigns());
    }
  }, [isAdmin, dispatch]);

  const allCampaigns = isAdmin ? campaigns : workspaceCampaigns;
  const runningCampaigns = allCampaigns.filter((c: Campaign) => c.status === 'Running');

  const handleNameClick = (id: string) => {
    setSelectedCampaignId(id);
    setShowModal(true);
    dispatch(fetchACampaign(id));
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4 text-gray-100">Recent Running Campaigns</h2>

      {runningCampaigns.length === 0 ? (
        <p className="text-gray-600">No running campaigns found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 rounded-md overflow-hidden shadow-sm">
            <thead className="bg-gray-100 text-left text-sm font-semibold text-gray-700">
              <tr>
                <th className="px-4 py-3 border-b">Name</th>
                <th className="px-4 py-3 border-b">Start Date</th>
                <th className="px-4 py-3 border-b">End Date</th>
                <th className="px-4 py-3 border-b">Tags</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-800 bg-white">
              {runningCampaigns
                .sort((a, b) => {
                  const dateA = new Date(a.startDate || '').getTime();
                  const dateB = new Date(b.startDate || '').getTime();
                  return dateB - dateA;
                })
                .slice(0, 5)
                .map((campaign: Campaign, i: number) => (
                  <tr key={i} className="even:bg-gray-50">
                    <td className="px-4 py-3 border-b">
                      <span
                        className="hover:underline text-blue-600 hover:cursor-pointer"
                        onClick={() => handleNameClick(campaign._id || '')}
                      >
                        {campaign.name}
                      </span>
                    </td>
                    <td className="px-4 py-3 border-b">
                      {formatDate(campaign.startDate.toString())}
                    </td>
                    <td className="px-4 py-3 border-b">
                      {formatDate(campaign.endDate.toString())}
                    </td>
                    <td className="px-4 py-3 border-b">{campaign.tags?.join(', ') || '-'}</td>
                  </tr>
                ))}
            </tbody>
          </table>
          {showModal && selectedCampaignId && (
            <CampaignDetailsModal
              onClose={() => setShowModal(false)}
              data={campaign}
              loading={loading}
            />
          )}
        </div>
      )}
    </div>
  );
};

const formatDate = (dateObj: string | null): string => {
  if (!dateObj) return '-';
  const date = new Date(dateObj);
  // Check if the date is valid before formatting
  if (isNaN(date.getTime())) {
    return '-';
  }
  return date.toISOString().split('T')[0] as string;
};
