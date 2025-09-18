// import { RootState } from '@/redux/store';
// import { KeyboardEventHandler, useEffect, useState } from 'react';
// import type { FieldValues, UseFormSetValue, UseFormWatch } from 'react-hook-form';
// import type { Path, PathValue } from 'react-hook-form';
// import { useSelector } from 'react-redux';

// interface TagInputProps<TForm extends FieldValues> {
//   name: Path<TForm>;
//   watch: UseFormWatch<TForm>;
//   setValue: UseFormSetValue<TForm>;
// }

// const TagInput = <TForm extends FieldValues>({ name, watch, setValue }: TagInputProps<TForm>) => {
//   // const tags = (watch(name) as PathValue<TForm, typeof name>) || [];

//   const [workspaceTags, setWorkspaceTags] = useState<string[]>([]);
//   const { userWorkspaces } = useSelector((state: RootState) => state.workspace);
//   const { currentWorkspace } = useSelector((state: RootState) => state.user);

//   useEffect(() => {
//     const workspace = userWorkspaces.find((userWorkspace) => userWorkspace.workspaceId.name == currentWorkspace?.name);
//     if (workspace) {
//       console.log(workspace.workspaceId.tags);

//       setWorkspaceTags(workspace.workspaceId.tags);
//     } else {
//       setWorkspaceTags([]);
//     }

//   }, [watch, name]);

//   const getTags = (): string[] => {
//     const watchedValue = watch(name);
//     return Array.isArray(watchedValue)
//       ? watchedValue.filter((item: unknown) => typeof item === 'string')
//       : [];
//   };
//   const currentTags = getTags();

//   const [inputValue, setInputValue] = useState('');

//   const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) => {
//     if (e.key === ' ' || e.key === 'Enter') {
//       e.preventDefault();
//       const trimmed = inputValue.trim();
//       if (trimmed && !currentTags.includes(trimmed)) {
//         setValue(name, [...currentTags, trimmed] as PathValue<TForm, typeof name>);
//         setInputValue('');
//       }
//       return;
//     }
//   };

//   const removeTag = (tagToRemove: string) => {
//     setValue(
//       name,
//       currentTags.filter((tag) => tag !== tagToRemove) as PathValue<TForm, typeof name>,
//     );
//   };

//   return (
//     <div>
//       <div className="flex flex-wrap gap-2 mb-2">
//         {currentTags.map((tag, index) => (
//           <button
//             key={index}
//             type="button"
//             className="ml-2 text-blue-800 group-hover:text-red-600"
//             onClick={() => removeTag(tag)}
//           >
//             <span
//               key={tag}
//               className="flex items-center bg-blue-200 text-blue-800 px-3 py-1 rounded-full text-sm hover:bg-red-200 hover:text-red-800 hover:cursor-pointer"
//             >
//               {tag}
//             </span>
//           </button>
//         ))}
//       </div>

//       <input
//         type="text"
//         placeholder="Type and press space..."
//         value={inputValue}
//         onChange={(e) => setInputValue(e.target.value)}
//         onKeyDown={handleKeyDown}
//         className="w-full border px-3 py-2 rounded border-gray-300"
//       />
//     </div>
//   );
// };

// export default TagInput;


import { RootState } from '@/redux/store';
import { KeyboardEventHandler, useEffect, useState } from 'react';
import type { FieldValues, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import type { Path, PathValue } from 'react-hook-form';
import { useSelector } from 'react-redux';

interface TagInputProps<TForm extends FieldValues> {
  name: Path<TForm>;
  watch: UseFormWatch<TForm>;
  setValue: UseFormSetValue<TForm>;
}

const TagInput = <TForm extends FieldValues>({ name, watch, setValue }: TagInputProps<TForm>) => {
  const [workspaceTags, setWorkspaceTags] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');
  const { userWorkspaces } = useSelector((state: RootState) => state.workspace);
  const { currentWorkspace } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    const workspace = userWorkspaces.find(
      (userWorkspace) => userWorkspace.workspaceId.name === currentWorkspace?.name
    );
    if (workspace) {
      setWorkspaceTags(workspace.workspaceId.tags || []);
    } else {
      setWorkspaceTags([]);
    }
  }, [currentWorkspace, userWorkspaces]);

  const getTags = (): string[] => {
    const watchedValue = watch(name);
    return Array.isArray(watchedValue)
      ? watchedValue.filter((item: unknown) => typeof item === 'string')
      : [];
  };
  const currentTags = getTags();

  const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      const trimmed = inputValue.trim();
      if (trimmed && !currentTags.includes(trimmed)) {
        setValue(name, [...currentTags, trimmed] as PathValue<TForm, typeof name>);
        setInputValue('');
      }
    }
  };

  const removeTag = (tagToRemove: string) => {
    setValue(
      name,
      currentTags.filter((tag) => tag !== tagToRemove) as PathValue<TForm, typeof name>
    );
  };

  const filteredSuggestions = workspaceTags.filter(
    (tag) => tag.toLowerCase().includes(inputValue.toLowerCase()) && !currentTags.includes(tag)
  );

  const handleSuggestionClick = (tag: string) => {
    setValue(name, [...currentTags, tag] as PathValue<TForm, typeof name>);
    setInputValue('');
  };

  return (
    <div>
      {/* Current selected tags */}
      <div className="flex flex-wrap gap-2 mb-2">
        {currentTags.map((tag, index) => (
          <button
            key={index}
            type="button"
            className="ml-2 text-blue-800 group-hover:text-red-600"
            onClick={() => removeTag(tag)}
          >
            <span className="flex items-center bg-blue-200 text-blue-800 px-3 py-1 rounded-full text-sm hover:bg-red-200 hover:text-red-800 hover:cursor-pointer">
              {tag}
            </span>
          </button>
        ))}
      </div>

      {/* Suggestions */}
      {inputValue && filteredSuggestions.length > 0 && (
        <ul className="border rounded mt-1 bg-white shadow-md max-h-40 overflow-y-auto absolute z-20 left-36">
          {filteredSuggestions.map((tag, index) => (
            <li
              key={index}
              className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
              onClick={() => handleSuggestionClick(tag)}
            >
              {tag}
            </li>
          ))}
        </ul>
      )}

      {/* Input Field */}
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
