import React, { useState, useRef, useEffect } from "react";

interface MenuOption {
  label: string;
  onClick?: () => void;
  submenu?: MenuOption[];
}

interface ContactsProps {
  contact: any;
  onEdit: () => void;
  onDelete: (id: string) => void;
}

export const ContactOptions: React.FC<ContactsProps> = ({
  contact,
  onEdit,
  onDelete,
}) => {
  const menuOptions: MenuOption[] = [
    { label: "Edit", onClick: () => onEdit() },
    { label: "Delete", onClick: () => onDelete(contact._id) },
  ];

  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => setOpen(!open);

  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setOpen(false);
    }
  };

  useEffect(() => {
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  if (localStorage.getItem("write") == "false") return null;

  return (
    <div className="relative inline-block" ref={menuRef}>
      <button
        onClick={toggleMenu}
        className="text-2xl px-2 py-1 hover:bg-gray-100 rounded focus:outline-none"
      >
        <span className="sm:inline hidden">&#8942;</span>
        <span className="sm:hidden inline">&#8943;</span>
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-2 w-40 bg-white border border-gray-200 rounded shadow-md z-10">
          {menuOptions.map((option, index) => {
            if (option.submenu) {
              return (
                <div key={index} className=" relative group">
                  <div className="flex  justify-between items-center px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer">
                    {option.label}
                    <span className="ml-2">&#9666;</span>
                  </div>

                  <div className="absolute top-0 hidden group-hover:block hover:block w-40 bg-white border border-gray-200 rounded shadow-md z-20">
                    {option.submenu.map((subItem, subIndex) => (
                      <button
                        key={subIndex}
                        onClick={() => {
                          subItem.onClick?.();
                          setOpen(false);
                        }}
                        className="left-full w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                      >
                        {subItem.label}
                      </button>
                    ))}
                  </div>
                </div>
              );
            }

            return (
              <button
                key={index}
                onClick={() => {
                  option.onClick?.();
                  setOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
              >
                {option.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
