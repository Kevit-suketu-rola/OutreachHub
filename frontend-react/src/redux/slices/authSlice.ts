import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// export const BASE_URL = "https://outreachhub.onrender.com";
export const BASE_URL = "http://localhost:5000";
export const navigateLogin = () => {
  window.location.href = "/login";
};

interface AuthState {
  email: string | null;
  token: string | null;
  error: string | null;
  loading: boolean;
  isAdmin: boolean;
}

const initialState: AuthState = {
  email: "",
  token: "",
  loading: false,
  isAdmin: false,
  error: null,
};

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 2000,
  headers: { "Content-Type": "application/json" },
});

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (
    credentials: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.post("/user/login", credentials);

      return {
        email: credentials.email,
        token: response.data.token,
        userId: response.data.user.userId,
        name: response.data.user.name,
      };
    } catch (error) {
      console.error("Error while logging in:", error);
      return rejectWithValue("Error during login.");
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        "/user/logout",
        { id: localStorage.getItem("userId") },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      if (response.data.message) {
        return response.data.message;
      } else {
        return rejectWithValue("Logout failed: No message in response");
      }
    } catch (error) {
      console.error("Error while logging in:", error);
      return rejectWithValue("Error during login.");
    }
  }
);

export const loginAdmin = createAsyncThunk(
  "auth/loginAdmin",
  async (credentials: { email: string; password: string }, thunkAPI) => {
    try {
      const response = await axiosInstance.post("/admin/login", credentials);
      return {
        email: credentials.email,
        token: response.data.token,
      };
    } catch (error) {
      console.error("Error while logging in:", error);
      return thunkAPI.rejectWithValue("Error during login.");
    }
  }
);

export const logoutAdmin = createAsyncThunk(
  "auth/logoutAdmin",
  async (_, { rejectWithValue }) => {
    try {
      let token = localStorage.getItem("token");
      localStorage.removeItem("token");
      const response = await axiosInstance.post(
        "/admin/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.message) {
        return response.data.message;
      } else {
        return rejectWithValue("Logout failed: No message in response");
      }
    } catch (error: any) {
      console.error("Error while logging out:", error);
      return rejectWithValue(error.response?.data?.message || "Logout failed");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.email = "";
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.email = action.payload.email;
        localStorage.setItem("user-token", action.payload.token);
        localStorage.setItem("userId", action.payload.userId);
        localStorage.setItem("username", action.payload.name);
        state.error = null;
        state.isAdmin = false;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
        state.token = null;
        state.email = null;
        localStorage.clear();
        state.isAdmin = false;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(loginAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.loading = false;
        localStorage.setItem("token", action.payload.token);
        state.email = action.payload.email;
        state.token = action.payload.token;
        state.error = null;
        state.isAdmin = true;
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(logoutAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutAdmin.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
        state.token = null;
        state.email = null;
        state.isAdmin = false;
      })
      .addCase(logoutAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
