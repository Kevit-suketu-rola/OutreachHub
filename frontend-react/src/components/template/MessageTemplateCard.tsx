import { useState } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/redux/store";
import {
  deleteMessageTemplate,
  editMessageTemplate,
} from "@/redux/slices/messageTemplateSlice";
import { MessageTemplateOptions } from "./MessageTemplateOptions";
import { UpdateMessageTemplateModal } from "./UpdateMessageTemplateModal";

export const MessageTemplateCard = ({ template }: { template: any }) => {
  const [openUpdate, setOpenUpdate] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const onEdit = () => setOpenUpdate(true);

  const onDelete = (id: string) => {
    dispatch(deleteMessageTemplate(id));
  };

  const handleUpdate = (data: any) => {
    if (template.templateImage === "" || data.type === "text") {
      data.type = "text";
      delete data.templateImage;
    }
    dispatch(editMessageTemplate({ id: template._id, update: data }));
    setOpenUpdate(false);
  };

  return (
    <div className="relative bg-white border border-gray-200 rounded-lg shadow-sm p-4 hover:shadow-md transition">
      <h2 className="text-lg font-semibold text-gray-800">{template.title}</h2>
      {template.templateImage && (
        <img
          src={template.templateImage}
          alt={template.title}
          className="w-full h-auto rounded-md mt-2"
        />
      )}
      <p className="text-sm text-gray-600 whitespace-pre-wrap mt-2">
        {template.template}
      </p>
      <MessageTemplateOptions
        template={template}
        onEdit={onEdit}
        onDelete={onDelete}
      />
      {openUpdate && (
        <UpdateMessageTemplateModal
          template={template}
          onClose={() => setOpenUpdate(false)}
          onSubmit={handleUpdate}
        />
      )}
    </div>
  );
};
