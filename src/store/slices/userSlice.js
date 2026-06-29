import userAPI from "@/api/userApi";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchMe = createAsyncThunk(
  "user/profile",
  async (_, { rejectWithValue }) => {
    try {
      const res = await userAPI.fetchMe();
      return res;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Chưa đăng nhập");
    }
  },
);

export const updateProfile = createAsyncThunk(
  "user/update",
  async (form, { rejectWithValue }) => {
    try {
      const res = await userAPI.updateProfile(form);
      return res;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Cập nhật thông tin thất bại",
      );
    }
  },
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    loading: false,
    error: null,
    message: null,
  },
  reducers: {
    clearMessage: (state) => {
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMe.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchMe.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Chưa đăng nhập";
      })
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.message = "Cập nhất thành công";
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Chưa đăng nhập";
      });
  },
});

export const { clearMessage } = userSlice.actions;
export default userSlice.reducer;
