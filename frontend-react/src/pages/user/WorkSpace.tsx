import { useSelector } from 'react-redux';

import UserDashboard from '@/components/user/UserDashboard';
import type { RootState } from '@/redux/store';

const WorkSpace = () => {
  const { currentWorkspace } = useSelector((state: RootState) => state.user);

  return (
    <div>
      <div className="md:flex mb-6 items-center justify-between">
        <h1 className="text-3xl font-bold text-white p-4">{currentWorkspace?.name}</h1>
        {/* {localStorage.getItem("write") === "true" && (
          <button
            className="flex justify-center mx-10 my-3 md:mx-6 items-center gap-2 px-4 py-2 rounded bg-transparent border-2 font-bold border-white text-white hover:bg-white hover:text-black"
            // onClick={() => setOpenAdd(true)}
          >
            <span>+ Add User</span>
          </button>
        )} */}
      </div>
      <UserDashboard />
    </div>
  );
};

export default WorkSpace;
