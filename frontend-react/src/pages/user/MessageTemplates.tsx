import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { IconArrowLeft, IconPlus } from '@tabler/icons-react';

import { LoaderCircle } from '@/components/LoaderCircle';
import { MessageTemplateCard } from '@/components/template/MessageTemplateCard';
import {
  TemplateFormValues,
  UpdateMessageTemplateModal,
} from '@/components/template/UpdateMessageTemplateModal';
import {
  MessageTemplate,
  createMessageTemplate,
  fetchMessageTemplates,
} from '@/redux/slices/messageTemplateSlice';
import type { AppDispatch, RootState } from '@/redux/store';
import { useNavigate } from 'react-router-dom';

export const MessageTemplates = () => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('');
  const [openCreate, setOpenCreate] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const templatesPerPage = 6;

  const templates = useSelector((state: RootState) => state.messageTemplate?.templates);
  const loading = useSelector((state: RootState) => state.messageTemplate?.loading);
  const currentWorkspace = useSelector(
    (state: RootState) => state.user?.currentWorkspace
  );
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (currentWorkspace?.id) dispatch(fetchMessageTemplates(currentWorkspace.id));
  }, [dispatch, currentWorkspace]);

  const filteredTemplates: MessageTemplate[] = templates?.filter(
    (template: MessageTemplate) =>
      template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.template.toLowerCase().includes(searchQuery.toLowerCase()),
  ) || []

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const indexOfLastTemplate = currentPage * templatesPerPage;
  const indexOfFirstTemplate = indexOfLastTemplate - templatesPerPage;
  const currentTemplates = filteredTemplates.slice(indexOfFirstTemplate, indexOfLastTemplate);
  const totalPages = Math.ceil(filteredTemplates.length / templatesPerPage);

  const handleCreateSubmit = (data: TemplateFormValues) => {
    dispatch(createMessageTemplate({ ...data, workspaceId: currentWorkspace?.id as string }));
    setOpenCreate(false);
  };

  return (
    <div className="overflow-hidden h-full">
      <div className='flex m-3 text-white cursor-pointer hover:underline' onClick={() => navigate('/user/workspace')}><IconArrowLeft /><span>Dashboard</span></div>
      <h1 className="text-3xl font-bold text-white p-4">Message Templates</h1>

      <div className="md:flex mb-4">
        <input
          type="text"
          placeholder="Search by title..."
          className="mx-10 w-4/5 md:w-1/2 rounded-sm px-4 py-3 shadow-sm bg-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {localStorage.getItem('write') === 'true' && (
          <button
            className="flex justify-center mx-10 my-3 md:m-0 items-center gap-2 px-4 py-2 rounded bg-transparent border-2 font-bold border-white text-white hover:bg-white hover:text-black"
            onClick={() => setOpenCreate(true)}
          >
            <IconPlus className="mx-auto" />
            <span>Create Template</span>
          </button>
        )}
      </div>
      {!loading && totalPages > 1 && (
        <div className="pr-10 flex justify-end mt-4 space-x-4 items-center">
          {!loading && totalPages > 1 && (
            <div className="pr-10 flex justify-end mt-3 space-x-4 items-center">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-1 rounded-md bg-white text-black font-medium shadow hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                &#0060;
              </button>
              <span className="text-white">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-1 rounded-md bg-white text-black font-medium shadow hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                &#0062;
              </button>
            </div>
          )}
        </div>
      )}
      <div className="m-10 grid grid-cols-1 gap-4 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
        {!loading ? (
          currentTemplates.map((template) => (
            <MessageTemplateCard key={template._id} template={template} />
          ))
        ) : (
          <LoaderCircle color="#fff" />
        )}
      </div>

      {openCreate && (
        <UpdateMessageTemplateModal
          template={{ title: '', template: '', type: 'text' }}
          onClose={() => setOpenCreate(false)}
          onSubmit={handleCreateSubmit}
        />
      )}
    </div>
  );
};
