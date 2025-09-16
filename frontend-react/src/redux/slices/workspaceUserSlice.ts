import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import {  createAxiosInstance } from './authSlice';
import { User } from './userSlice';
import { Workspace } from './workspaceSlice';

export const axiosInstance = createAxiosInstance('workspace-user');

export const fetchAWorkspaceUser = createAsyncThunk(
  'user/fetchAWorkspaceUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('user-token')}`,
        },
      });

      return { workspaceUser: response.data.workspaceUser };
    } catch {
      return rejectWithValue('Fetch failed');
    }
  },
);

export const getUsers = createAsyncThunk('admin/getUsers', async (id, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get(`all-users/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    return { users: response.data.workspaceUsers };
  } catch {
    return rejectWithValue('Fetch failed');
  }
});

export const getUsersForUser = createAsyncThunk(
  'user/getUsers',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`all-users/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('user-token')}`,
        },
      });

      return { users: response.data.workspaceUsers };
    } catch {
      return rejectWithValue('Fetch failed');
    }
  },
);

export const addUser = createAsyncThunk(
  'admin/addUser',
  async (obj: {
    userId: string;
    workspaceId: string;
    permissions: { read: boolean; write: boolean; allowAdd: boolean };
  }) => {
    try {
      const response = await axiosInstance.post('add-user', obj, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      return { user: response.data.workspaceUser };
    } catch {
      throw new Error('Fetch failed');
    }
  },
);

export const removeUser = createAsyncThunk(
  'admin/removeUser',
  async (obj: { userId: string; workspaceId: string }) => {
    try {
      await axiosInstance.post('remove-user', obj, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      return true;
    } catch {
      throw new Error('Fetch failed');
    }
  },
);

interface WorkspaceState {
  workspaceUsers: WorkspaceUser[];
  workspaceUser: WorkspaceUser;
  permissions: {
    read: boolean;
    write: boolean;
    allowAdd: boolean;
  };
  users: User[];
  loading: boolean;
  error: string | null;
}

export type WorkspaceUser = {
  _id: string;
  userId: User | string;
  workspaceId: Workspace | string;
  permissions: {
    read: boolean;
    write: boolean;
    allowAdd: boolean;
  };
};

const initialState: WorkspaceState = {
  workspaceUsers: [],
  workspaceUser: {} as WorkspaceUser,
  permissions: { read: false, write: false, allowAdd: false },
  users: [],
  loading: false,
  error: null,
};

const WorkspaceSlice = createSlice({
  name: 'workspaces',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAWorkspaceUser.pending, (state: WorkspaceState) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchAWorkspaceUser.fulfilled,
        (state: WorkspaceState, action: PayloadAction<{ workspaceUser: WorkspaceUser }>) => {
          state.loading = false;
          state.workspaceUser = action.payload.workspaceUser;
          localStorage.setItem('write', action.payload.workspaceUser.permissions.write.toString());
          localStorage.setItem(
            'allowAdd',
            action.payload.workspaceUser.permissions.allowAdd.toString(),
          );
        },
      )
      .addCase(getUsers.pending, (state: WorkspaceState) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUsers.fulfilled, (state: WorkspaceState, action) => {
        state.loading = false;
        state.users = action.payload.users;
      })
      .addCase(getUsersForUser.pending, (state: WorkspaceState) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUsersForUser.fulfilled, (state: WorkspaceState, action) => {
        state.loading = false;
        state.users = action.payload.users;
      })
      .addCase(addUser.pending, (state: WorkspaceState) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addUser.fulfilled, (state: WorkspaceState, action) => {
        state.loading = false;
        state.users.push(action.payload.user);
      })
      .addCase(removeUser.pending, (state: WorkspaceState) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeUser.fulfilled, (state: WorkspaceState) => {
        state.loading = false;
        state.error = null;
      });
  },
});

export default WorkspaceSlice.reducer;
