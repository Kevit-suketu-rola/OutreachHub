import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

import { BASE_URL } from './authSlice';
import { Workspace } from './workspaceSlice';

const axiosInstance = axios.create({
  baseURL: `${BASE_URL}/user`,
  timeout: 2000,
  headers: { 'Content-Type': 'application/json' },
});

export const fetchAllUsers = createAsyncThunk(
  'admin/fetchAllUsers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/all', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      return { users: response.data.users };
    } catch {
      return rejectWithValue('Fetch failed');
    }
  },
);
export const fetchAUser = createAsyncThunk('admin/fetchAUser', async (id, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get(`/by-id/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    return { user: response.data.user };
  } catch {
    return rejectWithValue('Fetch failed');
  }
});
export const editUser = createAsyncThunk(
  'common/editUser',
  async (
    user: {
      _id: string;
      name: string;
      description: string;
      tags: string[];
    },
    { rejectWithValue },
  ) => {
    try {
      const response = await axiosInstance.put(
        `/update/${user._id}`,
        { ...user },
        {
          headers: {
            Authorization: `Bearer ${
              localStorage.getItem('token') || localStorage.getItem('user-token')
            }`,
          },
        },
      );

      return { user: response.data.user };
    } catch {
      return rejectWithValue('Fetch failed');
    }
  },
);

interface createUser {
  name: string;
  password: string;
  contactInfo: {
    countryCode: string;
    phoneNumber: string;
    email: string;
  };
  workspaceId?: string;
  permissions?: {
    read?: boolean;
    write?: boolean;
    allowAdd?: boolean;
  };
}

export const createUser = createAsyncThunk(
  'common/createUser',
  async (data: createUser, { rejectWithValue }) => {
    const user: createUser = {
      name: data.name,
      password: data.password,
      contactInfo: {
        countryCode: data.contactInfo.countryCode,
        phoneNumber: data.contactInfo.phoneNumber,
        email: data.contactInfo.email,
      },
    };
    if (data.workspaceId) {
      user.workspaceId = data.workspaceId;
      user.permissions = data.permissions || {
        read: false,
        write: false,
        allowAdd: false,
      };
    }
    try {
      const response = await axiosInstance.post(
        `/create`,
        { ...user },
        {
          headers: {
            Authorization: `Bearer ${
              localStorage.getItem('token') || localStorage.getItem('user-token')
            }`,
          },
        },
      );

      return { user: response.data.user };
    } catch {
      return rejectWithValue('Fetch failed');
    }
  },
);

export const setCurrentWorkspace = createAsyncThunk(
  'user/setCurrentWorkspace',
  async ({ workspaceId, name }: { workspaceId: string; name: string }, { rejectWithValue }) => {
    if (name === '') return { id: workspaceId, name: name };
    try {
      await axiosInstance.post(
        '/set-current-workspace',
        { workspaceId: workspaceId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('user-token')}`,
          },
        },
      );
      return { id: workspaceId, name: name };
    } catch {
      return rejectWithValue('Fetch failed');
    }
  },
);

export type User = {
  _id: string;
  name: string;
  password?: string;
  contactInfo?: {
    email: string;
    countryCode: string;
    phoneNumber: number;
  };
  currentWorkspace?: string | Workspace;
  joinDate?: Date;
};

interface UserState {
  users: User[];
  user: User;
  currentWorkspace: { id: string; name: string } | null;
  userLoading: boolean;
  error: string | null;
}

const initialState: UserState = {
  users: [],
  user: {} as User,
  currentWorkspace: null,
  userLoading: false,
  error: null,
};

const UserSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllUsers.pending, (state) => {
        state.userLoading = true;
        state.error = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.userLoading = false;
        state.users = action.payload.users;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.userLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchAUser.pending, (state) => {
        state.userLoading = true;
        state.error = null;
      })
      .addCase(fetchAUser.fulfilled, (state, action) => {
        state.userLoading = false;
        state.error = null;
        state.user = action.payload.user;
      })
      .addCase(fetchAUser.rejected, (state, action) => {
        state.userLoading = false;
        state.error = action.payload as string;
      })
      .addCase(editUser.pending, (state) => {
        state.userLoading = true;
        state.error = null;
      })
      .addCase(editUser.fulfilled, (state, action) => {
        state.userLoading = false;
        state.users = [
          ...state.users.filter((u) => u._id !== action.payload.user._id),
          action.payload.user,
        ];
      })
      .addCase(editUser.rejected, (state, action) => {
        state.userLoading = false;
        state.error = action.payload as string;
      })
      .addCase(createUser.pending, (state) => {
        state.userLoading = true;
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.userLoading = false;
        state.users = [...state.users, action.payload.user];
      })
      .addCase(createUser.rejected, (state, action) => {
        state.userLoading = false;
        state.error = action.payload as string;
      })
      .addCase(setCurrentWorkspace.pending, (state) => {
        state.userLoading = true;
        state.error = null;
      })
      .addCase(setCurrentWorkspace.fulfilled, (state, action) => {
        state.userLoading = false;
        state.error = null;
        state.currentWorkspace = action.payload;
      })
      .addCase(setCurrentWorkspace.rejected, (state, action) => {
        state.userLoading = false;
        state.error = action.payload as string;
      });
  },
});

export default UserSlice.reducer;
