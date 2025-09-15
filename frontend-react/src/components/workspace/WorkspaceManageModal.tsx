import React from "react";
import { useForm } from "react-hook-form";
import TagInput from "./TagInput";

export interface Workspace {
  _id?: string;
  name?: string;
  description?: string;
  tags?: string[];
  createdAt?: string;
  isDeleted?: boolean;
  creator?: string;
}

interface Props {
  open: boolean;
  workspace: Workspace;
  onClose: () => void;
  onSubmit: (data: {
    _id: string;
    name: string;
    description: string;
    tags: string[];
  }) => void;
}

interface FormData {
  _id: string;
  name: string;
  description: string;
  tags: string[];
}

const WorkspaceManageModal: React.FC<Props> = ({
  open,
  workspace,
  onClose,
  onSubmit,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues: {
      _id: workspace._id,
      name: workspace.name,
      description: workspace.description,
      tags: workspace.tags,
    },
  });
  if (!open || !workspace) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-lg rounded-lg shadow-lg p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold mb-4">Manage Workspace</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              Workspace Name
            </label>
            <input
              id="name"
              {...register("name", { required: "Name is required" })}
              disabled={isSubmitting}
              className={`w-full px-3 py-2 border rounded ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.name && (
              <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium mb-1"
            >
              Description
            </label>
            <textarea
              id="description"
              rows={4}
              {...register("description", {
                required: "Description is required",
              })}
              disabled={isSubmitting}
              className={`w-full px-3 py-2 border rounded resize-none ${
                errors.description ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.description && (
              <p className="text-sm text-red-500 mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Tags</label>
            <TagInput name="tags" setValue={setValue} watch={watch} />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-60"
            >
              {isSubmitting ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WorkspaceManageModal;
