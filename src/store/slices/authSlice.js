import authAPI from "@/api/authAPI";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { useNavigate } from "react-router-dom";

export const login = createAsyncThunk(
  "login",
  async (form, { rejectWithValue }) => {
    try {
      const res = await authAPI.login(form);
      return res;
    } catch (error) {
      return rejectWithValue("Đăng nhập thất bại");
    }
  },
);

// export const logout = createAsyncThunk('logout',async(_,{rejectWithValue})=>{
//   try {
//     const res = await authAPI.logout
//   } catch (error) {

//   }
// })
const savedUser = JSON.parse(localStorage.getItem("user")) || null;

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: JSON.parse(localStorage.getItem("user")) || null,
    isLoggedIn: !!localStorage.getItem("token"),
    isAdmin: savedUser?.role === "ADMIN",
    isStaff: savedUser?.role === "STAFF",
    token: localStorage.getItem("token") || null,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isLoggedIn = false;
      state.token = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = {
          username: action.payload?.username,
          email: action.payload?.email,
          role:
            action.payload?.roleId === 1
              ? "ADMIN"
              : action.payload?.roleId === 2
                ? "STAFF"
                : "CUSTOMER",
        };
        state.isLoggedIn = !!localStorage.getItem("token");
        localStorage.setItem("token", action.payload.token);
        localStorage.setItem("user", JSON.stringify(state.user));
        state.isAdmin = state.user.role === "ADMIN";
        state.isStaff = state.user.role === "STAFF";
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = true;
      });
  },
});

export const { logout } = authSlice.actions;
export const authReducer = authSlice.reducer;
