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

const orderSlice = createSlice({
  name: "order",
  initialState: {
    orders: [],
    loading: false,
    error: null,
    message: null,
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
      });
  },
});

export default orderSlice.reducer;
