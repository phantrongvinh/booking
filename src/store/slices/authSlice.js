import authAPI from "@/api/authAPI";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const login = createAsyncThunk(
  "auth/login",
  async (form, { rejectWithValue }) => {
    try {
      const res = await authAPI.login(form);
      return res;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Đăng nhập thất bại");
    }
  },
);

export const register = createAsyncThunk(
  "auth/register",
  async (form, { rejectWithValue }) => {
    try {
      const res = await authAPI.register(form);
      return res;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Đăng ký thất bại");
    }
  },
);

const getRole = (roleId) => {
  switch (Number(roleId)) {
    case 1:
      return "ADMIN";
    case 2:
      return "STAFF";
    default:
      return "CUSTOMER";
  }
};

// Load initial data
const savedRole = getRole(localStorage.getItem("roleId"));
const savedToken = localStorage.getItem("token");

const initialState = {
  role: savedRole ?? null,
  token: savedToken || null,
  isLoggedIn: !!savedToken,
  isAdmin: savedRole === "ADMIN",
  isStaff: savedRole === "STAFF",
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null;
      state.isLoggedIn = false;
      state.isAdmin = false;
      state.isStaff = false;
      state.error = null;

      localStorage.removeItem("token");
      localStorage.removeItem("roleId");
    },
  },
  extraReducers: (builder) => {
    builder
      // LOGIN
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;

        const token = action.payload.token;

        state.token = token;
        state.isLoggedIn = true;

        state.role = getRole(action.payload.roleId);

        state.isAdmin = state.role === "ADMIN";
        state.isStaff = state.role === "STAFF";

        localStorage.setItem("token", token);
        localStorage.setItem("roleId", action.payload.roleId);
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Đăng nhập thất bại";
      })

      // REGISTER
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Đăng ký thất bại";
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
