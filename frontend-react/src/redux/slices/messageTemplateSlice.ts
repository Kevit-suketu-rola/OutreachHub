import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL, navigateLogin } from "./authSlice";

const axiosInstance = axios.create({
  baseURL: `${BASE_URL}/message-template`,
  timeout: 2000,
  headers: { "Content-Type": "application/json" },
});

export const fetchMessageTemplates = createAsyncThunk(
  "template/fetchAll",
  async (workspaceId: string | undefined, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/all/${workspaceId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("user-token")}`,
        },
      });
      return { templates: res.data.templates };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Fetch failed");
    }
  }
);

export const createMessageTemplate = createAsyncThunk(
  "user/createTemplate",
  async (data: any, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(`/create`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("user-token")}`,
        },
      });
      return { template: res.data.template };
    } catch (error: any) {
      navigateLogin();
      return rejectWithValue(error.response?.data?.message || "Create failed");
    }
  }
);

export const editMessageTemplate = createAsyncThunk(
  "user/editTemplate",
  async (data: { id: string; update: any }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put(`/update/${data.id}`, data.update, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("user-token")}`,
        },
      });
      return { template: res.data.template };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Edit failed");
    }
  }
);

export const deleteMessageTemplate = createAsyncThunk(
  "user/deleteTemplate",
  async (id: string, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("user-token")}`,
        },
      });
      return { id };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Delete failed");
    }
  }
);

interface messageTemplateState {
  templates: any[];
  loading: boolean;
  error: string | null;
}
const initialState: messageTemplateState = {
  templates: [],
  loading: false,
  error: null,
};

const messageTemplateSlice = createSlice({
  name: "messageTemplate",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessageTemplates.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMessageTemplates.fulfilled, (state, action) => {
        state.loading = false;
        state.templates = action.payload.templates;
      })
      .addCase(createMessageTemplate.fulfilled, (state, action) => {
        state.templates = [...state.templates, action.payload.template];
      })
      .addCase(editMessageTemplate.fulfilled, (state, action) => {
        state.templates = state.templates.map((t: any) =>
          t._id === action.payload.template._id ? action.payload.template : t
        );
      })
      .addCase(deleteMessageTemplate.fulfilled, (state, action) => {
        state.templates = state.templates.filter(
          (t: any) => t._id !== action.payload.id
        );
      });
  },
});

export default messageTemplateSlice.reducer;
