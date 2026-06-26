import authAPI from "@/api/authAPI";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const login = createAsyncThunk(
  "login",
  async (data, { rejectWithValue }) => {
    try {
      const res = await authAPI.login(data);

      return res.data;
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

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: JSON.parse(localStorage.getItem("user")) || null,
    isLoggedIn: !!localStorage.getItem("token"),
    isAdmin: false,
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
        state.isLoggedIn = true;
        localStorage.setItem("token", action.payload.token);
        localStorage.setItem("user", JSON.stringify(state.user));
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = true;
      });
  },
});

export const { logout } = authSlice.actions;
export const authReducer = authSlice.reducer;
