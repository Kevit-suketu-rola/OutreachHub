import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "./authSlice";

const axiosInstance = axios.create({
  baseURL: `${BASE_URL}/workspace`,
  timeout: 2000,
  headers: { "Content-Type": "application/json" },
});

export const fetchAllWorkspaces = createAsyncThunk(
  "admin/fetchAllWorkspaces",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/all-for-admin", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      return { workspaces: response.data.workspaces };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Fetch failed");
    }
  }
);

export const fetchAllWorkspacesOfUser = createAsyncThunk(
  "admin/fetchAllWorkspacesOfUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/all-for-user", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("user-token")}`,
        },
      });

      return { workspaces: response.data.workspaces };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Fetch failed");
    }
  }
);

export const fetchAWorkspace = createAsyncThunk(
  "admin/fetchAWorkspace",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/all-for-admin", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      return { workspace: response.data.workspace };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Fetch failed");
    }
  }
);

export const editWorkspace = createAsyncThunk(
  "admin/editWorkspace",
  async (
    workspace: {
      _id: string;
      name: string;
      description: string;
      tags: string[];
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.put(
        `/update/${workspace._id}`,
        { ...workspace },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      return { workspace: response.data.workspace };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Fetch failed");
    }
  }
);

export const deleteWorkspace = createAsyncThunk(
  "admin/deleteWorkspace",
  async (id: string, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Fetch failed");
    }
  }
);

export const createWorkspace = createAsyncThunk(
  "admin/createWorkspace",
  async (
    workspace: {
      name: string;
      description: string;
      tags: string[];
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.post(
        `/create`,
        { ...workspace },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      return { workspace: response.data.workspace };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Fetch failed");
    }
  }
);

interface WorkspaceState {
  workspaces: any[];
  workspace: any;
  loading: boolean;
  userWorkspacesLoading: boolean;
  error: string | null;
}

const initialState: WorkspaceState = {
  workspaces: [],
  workspace: {},
  loading: false,
  userWorkspacesLoading: false,
  error: null,
};

const WorkspaceSlice = createSlice({
  name: "workspaces",
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
      .addCase(fetchAllWorkspaces.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchAllWorkspacesOfUser.pending, (state) => {
        state.userWorkspacesLoading = true;
        state.error = null;
      })
      .addCase(fetchAllWorkspacesOfUser.fulfilled, (state, action) => {
        state.userWorkspacesLoading = false;
        state.workspaces = action.payload.workspaces;
      })
      .addCase(fetchAllWorkspacesOfUser.rejected, (state, action) => {
        state.userWorkspacesLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchAWorkspace.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAWorkspace.fulfilled, (state, action) => {
        state.loading = false;
        state.workspace = action.payload.workspace;
      })
      .addCase(fetchAWorkspace.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(editWorkspace.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editWorkspace.fulfilled, (state, action) => {
        state.loading = false;
        state.workspaces = [
          ...state.workspaces.filter(
            (w) => w._id !== action.payload.workspace._id
          ),
          action.payload.workspace,
        ];
      })
      .addCase(editWorkspace.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteWorkspace.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteWorkspace.fulfilled, (state, action) => {
        state.loading = true;
        state.error = null;
        state.workspaces = state.workspaces.filter(
          (w) => w._id !== action.payload
        );
      })
      .addCase(deleteWorkspace.rejected, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createWorkspace.fulfilled, (state, action) => {
        state.loading = false;
        state.workspaces = [...state.workspaces, action.payload.workspace];
      })
      .addCase(createWorkspace.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default WorkspaceSlice.reducer;
