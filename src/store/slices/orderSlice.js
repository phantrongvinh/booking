import orderAPI from "@/api/orderAPI";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchOrder = createAsyncThunk(
  "order/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await orderAPI.fetchAllOrder();

      return res;
    } catch (error) {
      return rejectWithValue("Không có đơn hàng nào");
    }
  },
);

export const getOrderById = createAsyncThunk(
  "order/getById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await orderAPI.fetchOrderById(id);
      return res;
    } catch (error) {
      return rejectWithValue("Không tìm thấy đơn hàng");
    }
  },
);

export const updateOrderStatus = createAsyncThunk(
  "order/updateStatus",
  async ({ orderId, newStatus, note }, { rejectWithValue }) => {
    try {
      const res = await orderAPI.updateOrderStatus(orderId, newStatus, note);
      return res;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  },
);

const orderSlice = createSlice({
  name: "order",
  initialState: {
    orders: [],
    loading: false,
    error: null,
    message: null,
    order: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrder.fulfilled, (state, action) => {
        state.orders = action.payload.data;
        state.loading = false;
        state.message = action.payload.message;
      })
      .addCase(fetchOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = "Không có đơn hàng";
      })
      .addCase(getOrderById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrderById.fulfilled, (state, action) => {
        state.order = action.payload.data;
        state.loading = false;
        state.message = action.payload.message;
      })
      .addCase(getOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = "Không có đơn hàng";
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default orderSlice.reducer;
