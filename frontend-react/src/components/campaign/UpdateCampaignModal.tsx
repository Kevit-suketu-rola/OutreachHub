import { useForm } from "react-hook-form";
import TagInput from "../workspace/TagInput";
import { fetchMessageTemplates } from "@/redux/slices/messageTemplateSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/redux/store";

type CampaignFormValues = {
  _id?: string;
  name: string;
  tags: string[];
  startDate: Date | string | null;
  endDate: Date | string | null;
  templateId?: string;
};

type Props = {
  templates: any[];
  campaign: CampaignFormValues;
  onClose: () => void;
  onSubmit: (data: CampaignFormValues) => void;
};

export const UpdateCampaignModal: React.FC<Props> = ({
  templates,
  campaign,
  onClose,
  onSubmit,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CampaignFormValues>({
    defaultValues: {
      ...campaign,
      templateId: campaign.templateId || "",
      startDate: campaign.startDate
        ? new Date(campaign.startDate).toISOString().split("T")[0]
        : "",
      endDate: campaign.endDate
        ? new Date(campaign.endDate).toISOString().split("T")[0]
        : "",
    },
  });
  const { currentWorkspace } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchMessageTemplates(currentWorkspace?.id));
  }, [dispatch]);

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
          {campaign._id ? "Edit" : "Create"} Campaign
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              {...register("name", { required: "Name is required" })}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>

          {/* Message Template Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Message Template
            </label>
            <select
              {...register("templateId", { required: "Template is required" })}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="">Select a template</option>
              {templates.map((t) => (
                <option key={t._id} value={t._id}>
                  {t.title}
                </option>
              ))}
            </select>
          </div>

          {/* Start Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Start Date
            </label>
            <input
              type="date"
              {...register("startDate", { required: "Start date is required" })}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
            {errors.startDate && (
              <p className="text-red-500 text-sm">{errors.startDate.message}</p>
            )}
          </div>

          {/* End Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              End Date
            </label>
            <input
              type="date"
              {...register("endDate", { required: "End date is required" })}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
            {errors.endDate && (
              <p className="text-red-500 text-sm">{errors.endDate.message}</p>
            )}
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tags
            </label>
            <TagInput name="tags" watch={watch} setValue={setValue} />
          </div>

          {/* Submit */}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
            >
              Save Campaign
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
