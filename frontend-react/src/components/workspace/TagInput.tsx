import React, { useState } from "react";
import type { UseFormSetValue, UseFormWatch } from "react-hook-form";

interface TagInputProps {
  name: string;
  watch: UseFormWatch<any>;
  setValue: UseFormSetValue<any>;
}

const TagInput: React.FC<TagInputProps> = ({ name, watch, setValue }) => {
  const tags: string[] = watch(name);
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e: any) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      const trimmed = inputValue.trim();
      if (trimmed && !tags.includes(trimmed)) {
        setValue(name, [...tags, trimmed]);
        setInputValue("");
      }
    }
  };

  const removeTag = (tagToRemove: string) => {
    setValue(
      name,
      tags.filter((tag) => tag !== tagToRemove)
    );
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map((tag, index) => (
          <button
            key={index}
            type="button"
            className="ml-2 text-blue-800 group-hover:text-red-600"
            onClick={() => removeTag(tag)}
          >
            <span
              key={tag}
              className="flex items-center bg-blue-200 text-blue-800 px-3 py-1 rounded-full text-sm hover:bg-red-200 hover:text-red-800 hover:cursor-pointer"
            >
              {tag}
            </span>
          </button>
        ))}
      </div>

      <input
        type="text"
        placeholder="Type and press space..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        className="w-full border px-3 py-2 rounded border-gray-300"
      />
    </div>
  );
};
export default TagInput;
