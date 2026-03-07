import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { LoaderCircle } from '@/components/LoaderCircle';
import { CampaignCard } from '@/components/campaign/CamaignCard';
import { UpdateCampaignModal } from '@/components/campaign/UpdateCampaignModal';
import { Campaign, createCampaign, getAllCampaignsOfWorkspace } from '@/redux/slices/campaignSlice';
import type { AppDispatch, RootState } from '@/redux/store';
import { IconArrowLeft, IconArrowLeftCircle, IconArrowLeftCircleFilled } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';

export const Campaigns = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [search, setSearch] = useState('');
  const [openCreate, setOpenCreate] = useState(false);
  const navigate = useNavigate()
  const currentWorkspace = useSelector(
    (state: RootState) => state.user?.currentWorkspace
  );
  const workspaceCampaigns = useSelector((state: RootState) => state.campaign?.workspaceCampaigns);
  const loading = useSelector((state: RootState) => state.campaign?.loading);
  const templates = useSelector((state: RootState) => state.messageTemplate?.templates);

  useEffect(() => {
    if (currentWorkspace?.id) {
      dispatch(getAllCampaignsOfWorkspace(currentWorkspace.id));
    }
  }, [currentWorkspace, dispatch]);

  const filtered = workspaceCampaigns?.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()),
  );

  const handleCreate = (data: Campaign) => {
    dispatch(createCampaign({ ...data, workspaceId: currentWorkspace?.id || '' }));
    setOpenCreate(false);
  };

  return (
    <div className="overflow-hidden h-full">
      <div className='flex m-3 text-white cursor-pointer hover:underline' onClick={() => navigate('/user/workspace')}><IconArrowLeft /><span>Dashboard</span></div>
      <h1 className="text-3xl font-bold text-white p-4">Campaigns</h1>
      <div className="md:flex mb-6 items-center">
        <input
          type="text"
          placeholder="Search campaigns..."
          className="mx-10 w-4/5 md:w-1/2 rounded-sm px-4 py-3 shadow-sm bg-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {localStorage.getItem('write') === 'true' && (
          <button
            className="flex justify-center mx-10 my-3 md:m-0 items-center gap-2 px-4 py-2 rounded bg-transparent border-2 font-bold border-white text-white hover:bg-white hover:text-black"
            onClick={() => setOpenCreate(true)}
          >
            <span>+ Create Campaign</span>
          </button>
        )}
      </div>

      <div className="m-10 grid grid-cols-1 gap-4 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
        {!loading ? (
          filtered?.map((c) => {
            return <CampaignCard key={c._id} campaign={c} />;
          })
        ) : (
          <LoaderCircle color="#fff" />
        )}
      </div>

      {openCreate && (
        <UpdateCampaignModal
          campaign={{
            name: '',
            templateId: '',
            startDate: new Date(),
            endDate: new Date(),
            tags: [],
          }}
          templates={templates || []}
          onClose={() => setOpenCreate(false)}
          onSubmit={handleCreate}
        />
      )}
    </div>
  );
};
