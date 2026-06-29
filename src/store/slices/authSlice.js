import authAPI from "@/api/authAPI";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// Load initial data
const savedUser = JSON.parse(localStorage.getItem("user"));
const savedToken = localStorage.getItem("token");

export const login = createAsyncThunk(
  "auth/login",
  async (form, { rejectWithValue }) => {
    try {
      const res = await authAPI.login(form);
      return res;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Đăng nhập thất bại");
    }
  }
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
  }
);

const getRole = (roleId) => {
  switch (roleId) {
    case 1:
      return "ADMIN";
    case 2:
      return "STAFF";
    default:
      return "CUSTOMER";
  }
};

const initialState = {
  user: savedUser || null,
  token: savedToken || null,
  isLoggedIn: !!savedToken,
  isAdmin: savedUser?.role === "ADMIN",
  isStaff: savedUser?.role === "STAFF",
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isLoggedIn = false;
      state.isAdmin = false;
      state.isStaff = false;
      state.error = null;

      localStorage.removeItem("token");
      localStorage.removeItem("user");
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

        const user = {
          username: action.payload?.username,
          email: action.payload?.email,
          role: getRole(action.payload?.roleId),
        };

        state.token = token;
        state.user = user;
        state.isLoggedIn = true;
        state.isAdmin = user.role === "ADMIN";
        state.isStaff = user.role === "STAFF";

        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
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
export const authReducer = authSlice.reducer;