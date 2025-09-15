import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "./authSlice";

const axiosInstance = axios.create({
  baseURL: `${BASE_URL}/campaign`,
  timeout: 2000,
  headers: { "Content-Type": "application/json" },
});

export const fetchAllCampaigns = createAsyncThunk(
  "admin/fetchAllCampaigns",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/all", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      return { campaigns: response.data.campaigns };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Fetch failed");
    }
  }
);

export const fetchACampaign = createAsyncThunk(
  "common/fetchACampaign",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/by-id/${id}`, {
        headers: {
          Authorization: `Bearer ${
            localStorage.getItem("token") || localStorage.getItem("user-token")
          }`,
        },
      });

      return { campaign: response.data.campaign };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Fetch failed");
    }
  }
);

export const getAllCampaignsForUser = createAsyncThunk(
  "user/getAllCampaigns",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/all-of-user", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("user-token")}`,
        },
      });

      return { campaigns: response.data.campaigns };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Fetch failed");
    }
  }
);

export const getAllCampaignsOfWorkspace = createAsyncThunk(
  "user/getAllCampaignsOfWorkspace",
  async (id: string | undefined, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/all-of-workspace/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("user-token")}`,
        },
      });

      return { campaigns: response.data.campaigns };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Fetch failed");
    }
  }
);

export const editCampaign = createAsyncThunk(
  "user/editCampaign",
  async ({ id, data }: { id: string; data: any }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(
        `/update/${id}`,
        { ...data },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("user-token")}`,
          },
        }
      );

      return { campaign: response.data.campaign };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Fetch failed");
    }
  }
);

export const launchCampaign = createAsyncThunk(
  "user/launchCampaign",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(
        `/launch/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("user-token")}`,
          },
        }
      );

      return { campaign: response.data.campaign };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Fetch failed");
    }
  }
);

export const createCampaign = createAsyncThunk(
  "user/createCampaign",
  async (
    campaign: {
      name: string;
      description: string;
      tags: string[];
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.post(
        `/create`,
        { ...campaign },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("user-token")}`,
          },
        }
      );

      return { campaign: response.data.campaign };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Fetch failed");
    }
  }
);

export const deleteCampaign = createAsyncThunk(
  "user/deleteCampaign",
  async (id: string, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("user-token")}`,
        },
      });

      return { id };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Fetch failed");
    }
  }
);

interface CampaignState {
  campaigns: any[];
  campaign: any;
  userCampaigns: any[];
  workspaceCampaigns: any[];
  loading: boolean;
  error: string | null;
}

const initialState: CampaignState = {
  campaign: {},
  campaigns: [],
  userCampaigns: [],
  workspaceCampaigns: [],
  loading: false,
  error: null,
};

const CampaignSlice = createSlice({
  name: "campaign",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllCampaigns.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllCampaigns.fulfilled, (state, action) => {
        state.loading = false;
        state.campaigns = action.payload.campaigns;
      })
      .addCase(fetchACampaign.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchACampaign.fulfilled, (state, action) => {
        state.loading = false;
        state.campaign = action.payload.campaign;
      })
      .addCase(getAllCampaignsForUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllCampaignsForUser.fulfilled, (state, action) => {
        state.loading = false;
        state.userCampaigns = action.payload.campaigns;
      })
      .addCase(getAllCampaignsOfWorkspace.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllCampaignsOfWorkspace.fulfilled, (state, action) => {
        state.loading = false;
        state.workspaceCampaigns = action.payload.campaigns;
      })
      .addCase(editCampaign.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editCampaign.fulfilled, (state, action) => {
        state.loading = false;
        state.workspaceCampaigns = [
          ...state.workspaceCampaigns.filter(
            (u) => u._id !== action.payload.campaign._id
          ),
          action.payload.campaign,
        ];
      })
      .addCase(launchCampaign.fulfilled, (state, action) => {
        state.loading = false;
        state.workspaceCampaigns = [
          ...state.workspaceCampaigns.filter(
            (u) => u._id !== action.payload.campaign._id
          ),
          action.payload.campaign,
        ];
      })
      .addCase(createCampaign.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCampaign.fulfilled, (state, action) => {
        state.loading = false;
        state.workspaceCampaigns = [
          ...state.workspaceCampaigns,
          action.payload.campaign,
        ];
      })
      .addCase(createCampaign.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteCampaign.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCampaign.fulfilled, (state, action) => {
        state.loading = false;
        state.workspaceCampaigns = state.workspaceCampaigns.filter(
          (u) => u._id !== action.payload.id
        );
      })
      .addCase(deleteCampaign.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default CampaignSlice.reducer;
