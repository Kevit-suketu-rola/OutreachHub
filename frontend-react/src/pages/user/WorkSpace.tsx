import { useSelector } from 'react-redux';

import UserDashboard from '@/components/user/UserDashboard';
import type { RootState } from '@/redux/store';

const WorkSpace = () => {
const currentWorkspace = useSelector(
  (state: RootState) => state.user?.currentWorkspace
);

  return (
    <div>
      <div className="md:flex mb-6 items-center justify-between">
        <h1 className="text-3xl font-bold text-white p-4">{currentWorkspace?.name}</h1>
      </div>
      <UserDashboard />
    </div>
  );
};

export default WorkSpace;
