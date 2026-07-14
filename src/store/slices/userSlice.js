import orderAPI from "@/api/orderAPI";
import userAPI from "@/api/userAPI";
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

export const fetchUsers = createAsyncThunk(
  "user/fetchUser",
  async (_, { rejectWithValue }) => {
    try {
      const res = await userAPI.fetchUsers();
      return res;
    } catch (error) {
      return rejectWithValue("Không tìm thấy khách hàng");
    }
  },
);

export const fetchMyOrders = createAsyncThunk(
  "user/myOrders",
  async (_, { rejectWithValue }) => {
    try {
      const res = await orderAPI.fetchMyOrders();
      return res;
    } catch (error) {
      return rejectWithValue("Chưa có đơn hàng");
    }
  },
);

export const cancelMyOrder = createAsyncThunk(
  "user/cancelOrder",
  async ({ id, cancelReason }, { rejectWithValue }) => {
    try {
      const res = await orderAPI.cancelOrder(id, cancelReason);
      return res;
    } catch (error) {
      return rejectWithValue("Hủy đơn hàng thất bại");
    }
  },
);

export const confirmMyOrder = createAsyncThunk(
  "user/confirmOrder",
  async (id, { rejectWithValue }) => {
    try {
      const res = await orderAPI.confirmOrder(id);
      return res;
    } catch (error) {
      return rejectWithValue("Xác nhận đơn hàng thất bại");
    }
  },
);

export const changePassword = createAsyncThunk(
  "user/changePassword",
  async (form, { rejectWithValue }) => {
    try {
      const res = await userAPI.changePassword(form);
      return res;
    } catch (error) {
      return rejectWithValue("Đổi mật khẩu thất bại");
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
    customers: [],
    myOrders: [],
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
      })
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.customers = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Chưa đăng nhập";
      })
      .addCase(fetchMyOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.myOrders = action.payload.data;
      })
      .addCase(fetchMyOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Chưa đăng nhập";
      });
  },
});

export const { clearMessage } = userSlice.actions;
export default userSlice.reducer;
