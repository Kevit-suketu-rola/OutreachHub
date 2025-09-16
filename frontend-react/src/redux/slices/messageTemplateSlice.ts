import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { createAxiosInstance, navigateLogin } from './authSlice';

export const axiosInstance = createAxiosInstance('message-template');

export const fetchMessageTemplates = createAsyncThunk(
  'template/fetchAll',
  async (workspaceId: string | undefined, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/all/${workspaceId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('user-token')}`,
        },
      });
      return { templates: res.data.templates };
    } catch {
      return rejectWithValue('Fetch failed');
    }
  },
);

type CreateTemplate = {
  title: string;
  template: string;
  type: string;
  templateImage?: string;
  workspaceId: string;
};

export const createMessageTemplate = createAsyncThunk(
  'user/createTemplate',
  async (data: CreateTemplate, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(`/create`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('user-token')}`,
        },
      });
      return { template: res.data.template };
    } catch {
      navigateLogin();
      return rejectWithValue('Create failed');
    }
  },
);

type UpdateTemplate = { title: string; template: string; type: string; templateImage?: string };

export const editMessageTemplate = createAsyncThunk(
  'user/editTemplate',
  async (
    data: {
      id: string;
      update: UpdateTemplate;
    },
    { rejectWithValue },
  ) => {
    try {
      const res = await axiosInstance.put(`/update/${data.id}`, data.update, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('user-token')}`,
        },
      });
      return { template: res.data.template };
    } catch {
      return rejectWithValue('Edit failed');
    }
  },
);

export const deleteMessageTemplate = createAsyncThunk(
  'user/deleteTemplate',
  async (id: string, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('user-token')}`,
        },
      });
      return { id };
    } catch {
      return rejectWithValue('Delete failed');
    }
  },
);

export type MessageTemplate = {
  _id?: string;
  title: string;
  template: string;
  workspaceId?: string;
  templateImage?: string;
  type: string;
};

interface messageTemplateState {
  templates: MessageTemplate[];
  loading: boolean;
  error: string | null;
}
const initialState: messageTemplateState = {
  templates: [],
  loading: false,
  error: null,
};

const messageTemplateSlice = createSlice({
  name: 'messageTemplate',
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
        state.templates = state.templates.map((t: MessageTemplate) =>
          t._id === action.payload.template._id ? action.payload.template : t,
        );
      })
      .addCase(deleteMessageTemplate.fulfilled, (state, action) => {
        state.templates = state.templates.filter(
          (t: MessageTemplate) => t._id !== action.payload.id,
        );
      });
  },
});

export default messageTemplateSlice.reducer;
