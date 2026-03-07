import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import TagInput from '../workspace/TagInput';
import { FileUploadField } from './FileUploadField';

export type ContactFormValues = {
  name: string;
  creator?: string;
  profilePicture?: string;
  contactInfo: {
    countryCode: string;
    email: string;
    phoneNumber: number;
  };
  jobTitle: string;
  company: string;
  tags: string[];
};

type UpdateContactModalProps = {
  contact: ContactFormValues;
  onClose: () => void;
  onSubmit: (data: ContactFormValues) => void;
};

export const UpdateContactModal: React.FC<UpdateContactModalProps> = ({
  contact,
  onClose,
  onSubmit,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ContactFormValues>({
    defaultValues: contact,
  });

  const methods = useForm();

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-lg z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-500 hover:text-gray-700 text-xl"
        >
          &times;
        </button>

        <h2 className="text-2xl font-semibold mb-6">
          {contact.name.length > 0 ? 'Edit Contact' : 'Add Contact'}
        </h2>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Name */}
            <div>
              <FileUploadField
                name="profilePicture"
                label="Profile Picture"
                // watch={watch}
                // setValue={setValue}
                url={contact.profilePicture}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                {...register('name', { required: 'Name is required' })}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
            </div>

            {/* Country Code */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Country Code</label>
              <input
                type="text"
                {...register('contactInfo.countryCode', {
                  required: 'Country code is required',
                })}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              />
              {errors.contactInfo?.countryCode && (
                <p className="text-red-500 text-sm">{errors.contactInfo.countryCode.message}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                {...register('contactInfo.email', {
                  required: 'Email is required',
                  pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: 'Invalid email format',
                  },
                })}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              />
              {errors.contactInfo?.email && (
                <p className="text-red-500 text-sm">{errors.contactInfo.email.message}</p>
              )}
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone Number</label>
              <input
                type="number"
                {...register('contactInfo.phoneNumber', {
                  required: 'Phone number is required',
                })}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              />
              {errors.contactInfo?.phoneNumber && (
                <p className="text-red-500 text-sm">{errors.contactInfo.phoneNumber.message}</p>
              )}
            </div>

            {/* Job Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Job Title</label>
              <input
                type="text"
                {...register('jobTitle')}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>

            {/* Company */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Company</label>
              <input
                type="text"
                {...register('company')}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
              <TagInput name="tags" watch={watch} setValue={setValue} />
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
              >
                Save Changes
              </button>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
};
