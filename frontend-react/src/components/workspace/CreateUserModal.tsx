import { createUser } from "@/redux/slices/userSlice";
import type { AppDispatch } from "@/redux/store";
import React, { useState } from "react";
import { useDispatch } from "react-redux";

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  workspace: any;
}

export const CreateUserModal: React.FC<CreateUserModalProps> = ({
  isOpen,
  onClose,
  workspace,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    countryCode: "",
    phoneNumber: "",
    write: false,
    allowAdd: false,
  });

  const dispatch = useDispatch<AppDispatch>();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    const data = {
      name: formData.name,
      password: formData.password,
      contactInfo: {
        countryCode: formData.countryCode,
        phoneNumber: formData.phoneNumber,
        email: formData.email,
      },
      workspaceId: workspace._id,
      permissions: {
        write: formData.write,
        allowAdd: formData.allowAdd,
        read: true,
      },
    };
    dispatch(createUser(data));
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg w-full max-w-md p-6 shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-500 hover:text-black text-2xl"
        >
          &times;
        </button>
        <h2 className="text-xl font-semibold mb-4">Create User</h2>
        <div className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />

          <div className="flex space-x-2">
            <input
              type="text"
              name="countryCode"
              placeholder="+1"
              value={formData.countryCode}
              onChange={handleChange}
              className="w-1/3 border px-3 py-2 rounded"
            />
            <input
              type="text"
              name="phoneNumber"
              placeholder="Phone Number"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="w-2/3 border px-3 py-2 rounded"
            />
          </div>
        </div>
        <div className="mt-4 space-x-4">
          <label className="inline-flex items-center space-x-1 text-sm">
            <input
              type="checkbox"
              name="write"
              className="accent-blue-600"
              checked={formData.write}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  write: e.target.checked,
                }))
              }
            />
            <span>Write</span>
          </label>

          <label className="inline-flex items-center space-x-1 text-sm">
            <input
              type="checkbox"
              name="allowAdd"
              className="accent-blue-600"
              checked={formData.allowAdd}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  allowAdd: e.target.checked,
                }))
              }
            />
            <span>Allow Add</span>
          </label>
        </div>

        <button
          onClick={handleSubmit}
          className="mt-6 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Create User
        </button>
      </div>
    </div>
  );
};
