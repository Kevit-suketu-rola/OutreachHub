import { useState, useRef, useEffect } from "react";

export const MessageTemplateOptions = ({
  template,
  onEdit,
  onDelete,
}: {
  template: any;
  onEdit: () => void;
  onDelete: (id: string) => void;
}) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (localStorage.getItem("write") === "false") return null;

  return (
    <div className="absolute top-2 right-2" ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        className="text-2xl px-2 py-1 hover:bg-gray-100 rounded"
      >
        &#8942;
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded shadow-md z-10">
          <button
            onClick={() => {
              onEdit();
              setOpen(false);
            }}
            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
          >
            Edit
          </button>
          <button
            onClick={() => {
              onDelete(template._id);
              setOpen(false);
            }}
            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};
