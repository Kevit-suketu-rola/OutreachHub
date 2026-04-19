import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

import { BASE_URL } from './authSlice';

const axiosInstance = axios.create({
  baseURL: `${BASE_URL}/contact/`,
  timeout: 2000,
  headers: { 'Content-Type': 'application/json' },
});

export const fetchAllContacts = createAsyncThunk(
  'admin/fetchAllContacts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('all', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      return { contacts: response.data.contacts };
    } catch {
      return rejectWithValue('Fetch failed');
    }
  },
);

export const fetchContactsOfWorkspace = createAsyncThunk(
  'user/fetchContactsOfWorkspace',
  async (id: string | undefined, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`workspace/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('user-token')}`,
        },
      });

      return { contacts: response.data.contacts };
    } catch {
      return rejectWithValue('Fetch failed');
    }
  },
);

export const editContact = createAsyncThunk(
  'user/editContact',
  async (
    data: {
      id: string | undefined;
      update: { details: { name: string; jobTitle: string; company: string }; tags: string[] };
    },
    { rejectWithValue },
  ) => {
    try {
      const response = await axiosInstance.put(
        `update/${data.id}`,
        { ...data.update },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('user-token')}`,
          },
        },
      );

      return { contact: response.data.contact };
    } catch {
      return rejectWithValue('Fetch failed');
    }
  },
);

export const createContact = createAsyncThunk(
  'user/createContact',
  async (contact: Contact, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        `create`,
        { ...contact },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('user-token')}`,
          },
        },
      );
      if (response.status == 400) {
        alert('Error with workspace or Name must be unique');
        return { contact: null };
      }
      return { contact: response.data.contact };
    } catch {
      return rejectWithValue('Creation failed');
    }
  },
);

export const deleteContact = createAsyncThunk(
  'user/deleteContact',
  async (id: string, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`delete/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('user-token')}`,
        },
      });

      return { id };
    } catch {
      return rejectWithValue('Deletion failed');
    }
  },
);

export type Contact = {
  _id?: string;
  creator?: string;
  name: string;
  contactInfo: {
    countryCode: string;
    email: string;
    phoneNumber: number;
  };
  profilePicture?: string;
  jobTitle: string;
  company: string;
  tags: string[];
  workspaceId?: string;
};

interface ContactState {
  contacts: Contact[];
  contact: Contact | null;
  loading: boolean;
  error: string | null;
}

const initialState: ContactState = {
  contacts: [],
  contact: null,
  loading: false,
  error: null,
};

const ContactSlice = createSlice({
  name: 'contacts',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllContacts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllContacts.fulfilled, (state, action) => {
        state.loading = false;
        state.contacts = action.payload.contacts;
      })
      .addCase(fetchAllContacts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchContactsOfWorkspace.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContactsOfWorkspace.fulfilled, (state, action) => {
        state.loading = false;
        state.contacts = action.payload.contacts;
      })
      .addCase(fetchContactsOfWorkspace.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(editContact.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editContact.fulfilled, (state, action) => {
        state.loading = false;
        state.contacts = [
          ...state.contacts.filter((u) => u._id !== action.payload.contact._id),
          action.payload.contact,
        ];
      })
      .addCase(editContact.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createContact.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createContact.fulfilled, (state, action) => {
        state.loading = false;
        state.contacts = [...state.contacts, action.payload.contact];
      })
      .addCase(createContact.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteContact.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteContact.fulfilled, (state, action) => {
        state.loading = false;
        state.contacts = state.contacts.filter((u) => u._id !== action.payload.id);
      })
      .addCase(deleteContact.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default ContactSlice.reducer;
