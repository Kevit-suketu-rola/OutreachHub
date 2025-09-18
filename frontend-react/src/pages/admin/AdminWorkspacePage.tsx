import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import WorkspaceCard from '@/components/workspace/WorkspaceCard';
import { WorkspaceDetailsDialog } from '@/components/workspace/WorkspaceDetailsDialog';
import WorkspaceManageModal from '@/components/workspace/WorkspaceManageModal';
import { fetchAllUsers } from '@/redux/slices/userSlice';
import {
  Workspace,
  deleteWorkspace,
  editWorkspace,
  fetchAllWorkspaces,
} from '@/redux/slices/workspaceSlice';
import type { AppDispatch, RootState } from '@/redux/store';

export default function WorkspacesPage() {
  const [selectedWorkspace, setSelectedWorkspace] = useState({
    _id: '',
    name: '',
    description: '',
    tags: [],
  });
  const { workspaces } = useSelector((state: RootState) => state.workspace);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchAllWorkspaces());
    dispatch(fetchAllUsers());
  }, [dispatch]);

  const handleCloseDialog = () => {
    setSelectedWorkspace({
      _id: '',
      name: '',
      description: '',
      tags: [],
    });
  };

  const [editingWorkspace, setEditingWorkspace] = useState<Workspace>({
    _id: '',
    name: '',
    description: '',
    tags: [],
  });

  const handleDelete = (workspaceId: string) => {
    if (confirm("Are you sure you want to delete this workspace?"))
      dispatch(deleteWorkspace(workspaceId));
  };

  const handleEditClick = (workspace: Workspace) => {
    setEditingWorkspace(workspace);
  };

  const handleUpdate = (data: {
    _id: string;
    name: string;
    description: string;
    tags: string[];
  }) => {
    dispatch(editWorkspace(data));
    setEditingWorkspace({
      _id: '',
      name: '',
      description: '',
      tags: [],
    });
  };

  return (
    <div className="p-6 bg-gradient-to-b from-blue-400 to-violet-500 h-[100vh]">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {workspaces.length > 0 ? (
          workspaces.map((workspace: Workspace) => (
            <WorkspaceCard
              key={workspace._id}
              workspace={workspace}
              onEdit={handleEditClick}
              onDelete={handleDelete}
            />
          ))
        ) : (
          <div className="text-gray-50 w-full text-center">No workspaces to show</div>
        )}
      </div>

      <WorkspaceDetailsDialog
        open={selectedWorkspace._id !== ''}
        onClose={handleCloseDialog}
        workspace={selectedWorkspace}
      />

      {editingWorkspace && (
        <WorkspaceManageModal
          open={editingWorkspace._id !== ''}
          workspace={editingWorkspace}
          onClose={() =>
            setEditingWorkspace({
              _id: '',
              name: '',
              description: '',
              tags: [],
            })
          }
          onSubmit={handleUpdate}
        />
      )}
    </div>
  );
}
