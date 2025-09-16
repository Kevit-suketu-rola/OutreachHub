import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { MessageTemplate } from '@/redux/slices/messageTemplateSlice';

import { FileUploadField } from '../contacts/FileUploadField';

export type TemplateFormValues = {
  _id?: string;
  title: string;
  template: string;
  type: 'text' | 'text-image';
  templateImage?: string;
};

type Props = {
  template: MessageTemplate;
  onClose: () => void;
  onSubmit: (data: TemplateFormValues) => void;
};

export const UpdateMessageTemplateModal: React.FC<Props> = ({ template, onClose, onSubmit }) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TemplateFormValues>({
    defaultValues: {
      ...template,
      type: template.type === 'text-image' ? 'text-image' : 'text',
    },
  });

  const [typeImg, setTypeImg] = useState(template.type || 'text');
  const typeValue = watch('type'); // read from form
  const [isChecked, setIsChecked] = useState(typeValue === 'text-image');
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
          {template._id ? 'Edit' : 'Create'} Message Template
        </h2>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                Image
              </label>
              <input
                type="checkbox"
                id="type"
                checked={isChecked}
                onChange={(e) => {
                  const newValue = e.target.checked ? 'text-image' : 'text';
                  if (newValue === 'text') setValue('type', newValue);
                  setTypeImg(newValue);
                  setIsChecked(e.target.checked);
                }}
              />
            </div>
            {typeImg === 'text-image' && (
              <div>
                <FileUploadField name="templateImage" label="Template Image" />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                {...register('title', { required: 'Title is required' })}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              />
              {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Template</label>
              <textarea
                {...register('template', { required: 'Template is required' })}
                rows={6}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              ></textarea>
              {errors.template && <p className="text-red-500 text-sm">{errors.template.message}</p>}
            </div>

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
