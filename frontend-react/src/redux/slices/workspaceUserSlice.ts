import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "./authSlice";

export const axiosInstance = axios.create({
  baseURL: `${BASE_URL}/workspace-user`,
  timeout: 2000,
  headers: { "Content-Type": "application/json" },
});

export const fetchAWorkspaceUser = createAsyncThunk(
  "user/fetchAWorkspaceUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("user-token")}`,
        },
      });

      return { workspaceUser: response.data.workspaceUser };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Fetch failed");
    }
  }
);

export const getUsers = createAsyncThunk(
  "admin/getUsers",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`all-users/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      return { users: response.data.workspaceUsers };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Fetch failed");
    }
  }
);

export const getUsersForUser = createAsyncThunk(
  "user/getUsers",
  async (id: any, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`all-users/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("user-token")}`,
        },
      });

      return { users: response.data.workspaceUsers };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Fetch failed");
    }
  }
);

export const addUser = createAsyncThunk(
  "admin/addUser",
  async (obj: {
    userId: string;
    workspaceId: string;
    permissions: { read: boolean; write: boolean; allowAdd: boolean };
  }) => {
    try {
      const response = await axiosInstance.post("add-user", obj, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return { user: response.data.workspaceUser };
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Fetch failed");
    }
  }
);

export const removeUser = createAsyncThunk(
  "admin/removeUser",
  async (obj: { userId: string; workspaceId: string }) => {
    try {
      await axiosInstance.post("remove-user", obj, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return true;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Fetch failed");
    }
  }
);

interface WorkspaceState {
  workspaceUsers: any[];
  workspaceUser: any;
  permissions: {
    read: boolean;
    write: boolean;
    allowAdd: boolean;
  };
  users: any[];
  loading: boolean;
  error: string | null;
}

const initialState: WorkspaceState = {
  workspaceUsers: [],
  workspaceUser: {},
  permissions: { read: false, write: false, allowAdd: false },
  users: [],
  loading: false,
  error: null,
};

const WorkspaceSlice = createSlice({
  name: "workspaces",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAWorkspaceUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAWorkspaceUser.fulfilled, (state, action) => {
        state.loading = false;
        state.workspaceUser = action.payload.workspaceUser;
        localStorage.setItem(
          "write",
          action.payload.workspaceUser.permissions.write
        );
        localStorage.setItem(
          "allowAdd",
          action.payload.workspaceUser.permissions.allowAdd
        );
      })
      .addCase(fetchAWorkspaceUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.users;
      })
      .addCase(getUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getUsersForUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUsersForUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.users;
      })
      .addCase(getUsersForUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users.push(action.payload.user);
      })
      .addCase(addUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(removeUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeUser.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(removeUser.rejected, (state) => {
        state.loading = false;
        state.error = "error removing user";
      });
  },
});

export default WorkspaceSlice.reducer;
