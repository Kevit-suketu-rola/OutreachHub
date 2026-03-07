import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { IconMail, IconPhone } from '@tabler/icons-react';

import { Contact, deleteContact, editContact } from '@/redux/slices/contactSlice';
import { fetchAWorkspaceUser } from '@/redux/slices/workspaceUserSlice';
import type { AppDispatch } from '@/redux/store';

import { ContactOptions } from './ContactOptions';
import { UpdateContactModal } from './UpdateContactModal';

type ContactCardProps = {
  contact: Contact;
};

export const ContactCard: React.FC<ContactCardProps> = ({ contact }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [openUpdate, setOpenUpdate] = useState(false);

  useEffect(() => {
    dispatch(fetchAWorkspaceUser());
  }, [dispatch]);

  const onEdit = () => {
    setOpenUpdate(true);
  };

  const onDelete = (id: string) => {
    dispatch(deleteContact(id));
  };

  type SubmitData = {
    _id?: string;
    name: string;
    contactInfo: {
      email: string;
      countryCode: string;
      phoneNumber: number;
    };
    jobTitle: string;
    company: string;
    profilePicture?: string;
    tags: string[];
  };

  const HandleUpdate = (data: SubmitData): void => {
    const structData = {
      id: data._id,
      update: {
        details: {
          name: data.name,
          contactInfo: {
            countryCode: data.contactInfo.countryCode,
            email: data.contactInfo.email,
            phoneNumber: data.contactInfo.phoneNumber,
          },
          jobTitle: data.jobTitle,
          company: data.company,
          profilePicture: data.profilePicture || contact.profilePicture,
        },
        tags: data.tags,
      },
    };
    dispatch(editContact(structData));
    setOpenUpdate(false);
  };

  return (
    <div className="relative flex sm:flex-row flex-col items-center bg-white border border-gray-200 rounded-lg shadow-sm p-4 hover:shadow-md transition">
      <div className="flex-shrink-0 mr-4">
        <img
          src={contact.profilePicture}
          alt={contact.name}
          className="sm:w-24 sm:h-24 w-20 h-20 rounded-full object-cover"
        />
      </div>

      <div className="flex-grow sm:text-left text-center flex flex-col items-center sm:block">
        <h2 className="text-lg font-semibold text-gray-800">{contact.name}</h2>
        <p className="text-sm text-gray-600">
          {contact.jobTitle} at {contact.company}
        </p>
        <p className="text-sm text-gray-600">
          <strong className="hidden sm:inline">
            <IconMail className="w-5 inline" />
          </strong>{' '}
          {contact.contactInfo.email}
        </p>
        <p className="text-sm text-gray-600">
          <strong className="hidden sm:inline">
            <IconPhone className="w-5 inline" />
          </strong>{' '}
          {contact.contactInfo.countryCode} {contact.contactInfo.phoneNumber}
        </p>
        <div className="px-">
          {contact.tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {contact.tags.map((tag, index) => (
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
      </div>
      <ContactOptions contact={contact} onEdit={onEdit} onDelete={onDelete} />
      {openUpdate && (
        <UpdateContactModal
          contact={contact}
          onClose={() => setOpenUpdate(false)}
          onSubmit={HandleUpdate}
        />
      )}
    </div>
  );
};
