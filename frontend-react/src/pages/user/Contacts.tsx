import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { IconArrowLeft, IconPlus } from '@tabler/icons-react';

import { LoaderCircle } from '@/components/LoaderCircle';
import { ContactCard } from '@/components/contacts/ContactCard';
import { ContactFormValues, UpdateContactModal } from '@/components/contacts/UpdateContactModal';
import { createContact, fetchContactsOfWorkspace } from '@/redux/slices/contactSlice';
import type { AppDispatch, RootState } from '@/redux/store';
import { useNavigate } from 'react-router-dom';

export const Contacts = () => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('');
  const [openCreate, setOpenCreate] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const contactsPerPage = 9;

  const contacts = useSelector((state: RootState) => state.contact?.contacts);
  const loading = useSelector((state: RootState) => state.contact?.loading);
  const currentWorkspace = useSelector(
    (state: RootState) => state.user?.currentWorkspace
  );
  const dispatch = useDispatch<AppDispatch>();

  // debouncing
  const [debouncedValue, setDebouncedValue] = useState(searchQuery);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(searchQuery);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  useEffect(() => {
    dispatch(fetchContactsOfWorkspace(currentWorkspace?.id));
  }, [dispatch, currentWorkspace?.id]);

  const HandleCreateClick = () => {
    setOpenCreate(true);
  };

  const HandleCreateSubmit = (data: ContactFormValues) => {
    dispatch(createContact({ ...data, workspaceId: currentWorkspace?.id as string }));
    setOpenCreate(false);
  };

  const filteredContacts = contacts?.filter((contact) => {
    const query = debouncedValue.toLowerCase();
    return (
      contact.name.toLowerCase().includes(query) ||
      contact.contactInfo.email.toLowerCase().includes(query) ||
      contact.company.toLowerCase().includes(query) ||
      contact.jobTitle.toLowerCase().includes(query)
    );
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const indexOfLastContact = currentPage * contactsPerPage;
  const indexOfFirstContact = indexOfLastContact - contactsPerPage;
  const currentContacts = filteredContacts?.slice(indexOfFirstContact, indexOfLastContact);
  const totalPages = Math.ceil((filteredContacts?.length || 0) / contactsPerPage);

  return (
    <div className="overflow-hidden h-full">
      <div className='flex m-3 text-white cursor-pointer hover:underline' onClick={() => navigate('/user/workspace')}><IconArrowLeft /><span>Dashboard</span></div>
      <h1 className="text-3xl font-bold text-white p-4">Contacts</h1>

      <div className="md:flex mb-4">
        <input
          type="text"
          placeholder="Search by name, email, company, or job title..."
          className="mx-10 w-4/5 md:w-1/2 rounded-sm px-4 py-3 shadow-sm bg-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {localStorage.getItem('write') === 'true' && (
          <button
            className="flex justify-center mx-10 my-3 md:m-0 items-center gap-2 px-4 py-2 rounded bg-transparent border-2 font-bold border-white text-white hover:bg-white hover:text-black transition"
            onClick={HandleCreateClick}
          >
            <IconPlus className="mx-auto" />
            <span>Add Contact</span>
          </button>
        )}
      </div>

      {!loading && totalPages > 1 && (
        <div className="pr-10 flex justify-end space-x-4 items-center">
          {!loading && totalPages > 1 && (
            <div className="pr-10 flex justify-end mt-3 space-x-4 items-center">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-1 rounded-md bg-white font-medium hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                &#0060;
              </button>
              <span className="text-white">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-1 rounded-md bg-white font-medium hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                &#0062;
              </button>
            </div>
          )}
        </div>
      )}

      <div className="m-10 grid grid-cols-1 gap-4 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
        {!loading ? (
          currentContacts?.map((contact) => <ContactCard key={contact._id} contact={contact} />)
        ) : (
          <LoaderCircle color="#fff" />
        )}
      </div>

      {openCreate && (
        <UpdateContactModal
          contact={
            {
              name: '',
              company: '',
              jobTitle: '',
              contactInfo: { email: '', phoneNumber: 9999999999, countryCode: '+' },
              tags: [],
            } as ContactFormValues
          }
          onClose={() => setOpenCreate(false)}
          onSubmit={HandleCreateSubmit}
        />
      )}
    </div>
  );
};
