import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { createAxiosInstance } from './authSlice';
import { User } from './userSlice';
import { WorkspaceUser } from './workspaceUserSlice';

const axiosInstance = createAxiosInstance('workspace');

export const fetchAllWorkspaces = createAsyncThunk(
  'admin/fetchAllWorkspaces',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/all-for-admin', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      return { workspaces: response.data.workspaces };
    } catch {
      return rejectWithValue('Fetch failed');
    }
  },
);

export const fetchAllWorkspacesOfUser = createAsyncThunk(
  'user/fetchAllWorkspacesOfUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/all-for-user', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('user-token')}`,
        },
      });

      return { workspaces: response.data.workspaces };
    } catch {
      return rejectWithValue('Fetch failed');
    }
  },
);

export const fetchAWorkspace = createAsyncThunk(
  'admin/fetchAWorkspace',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/all-for-admin', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      return { workspace: response.data.workspace };
    } catch {
      return rejectWithValue('Fetch failed');
    }
  },
);

export const editWorkspace = createAsyncThunk(
  'admin/editWorkspace',
  async (
    workspace: {
      _id: string;
      name: string;
      description: string;
      tags: string[];
    },
    { rejectWithValue },
  ) => {
    try {
      const response = await axiosInstance.put(
        `/update/${workspace._id}`,
        { ...workspace },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        },
      );

      return { workspace: response.data.workspace };
    } catch {
      return rejectWithValue('Fetch failed');
    }
  },
);

export const deleteWorkspace = createAsyncThunk(
  'admin/deleteWorkspace',
  async (id: string, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      return id;
    } catch {
      return rejectWithValue('Fetch failed');
    }
  },
);

export const createWorkspace = createAsyncThunk(
  'admin/createWorkspace',
  async (
    workspace: {
      name: string;
      description: string;
      tags: string[];
    },
    { rejectWithValue },
  ) => {
    try {
      const response = await axiosInstance.post(
        `/create`,
        { ...workspace },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        },
      );

      return { workspace: response.data.workspace };
    } catch {
      return rejectWithValue('Fetch failed');
    }
  },
);

export type Workspace = {
  _id: string;
  creator?: string | User;
  name: string;
  description: string;
  tags: string[];
  isDeleted?: boolean;
  createdAt?: string;
};

interface WorkspaceState {
  workspaces: Workspace[];
  userWorkspaces: WorkspaceUser[];
  workspace: Workspace;
  loading: boolean;
  userWorkspacesLoading: boolean;
  error: string | null;
}

const initialState: WorkspaceState = {
  workspaces: [],
  userWorkspaces: [],
  workspace: {} as Workspace,
  loading: false,
  userWorkspacesLoading: false,
  error: null,
};

const WorkspaceSlice = createSlice({
  name: 'workspaces',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllWorkspaces.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllWorkspaces.fulfilled, (state, action) => {
        state.loading = false;
        state.workspaces = action.payload.workspaces;
      })
      .addCase(fetchAllWorkspacesOfUser.pending, (state) => {
        state.userWorkspacesLoading = true;
        state.error = null;
      })
      .addCase(fetchAllWorkspacesOfUser.fulfilled, (state, action) => {
        state.userWorkspacesLoading = false;
        state.userWorkspaces = action.payload.workspaces;
      })
      .addCase(fetchAWorkspace.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAWorkspace.fulfilled, (state, action) => {
        state.loading = false;
        state.workspace = action.payload.workspace;
      })
      .addCase(editWorkspace.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editWorkspace.fulfilled, (state, action) => {
        state.loading = false;
        state.workspaces = [
          ...state.workspaces.filter((w) => w._id !== action.payload.workspace._id),
          action.payload.workspace,
        ];
      })
      .addCase(deleteWorkspace.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteWorkspace.fulfilled, (state, action) => {
        state.loading = true;
        state.error = null;
        state.workspaces = state.workspaces.filter((w) => w._id !== action.payload) as Workspace[];
      })
      .addCase(createWorkspace.fulfilled, (state, action) => {
        state.loading = false;
        state.workspaces = [...state.workspaces, action.payload.workspace];
      });
  },
});

export default WorkspaceSlice.reducer;
