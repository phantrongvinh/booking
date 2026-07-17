import voucherAPI from "@/api/voucherAPI";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const getAllVouchers = createAsyncThunk(
  "voucher/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await voucherAPI.getAllVouchers();

      return res;
    } catch (error) {
      return rejectWithValue("Không có mã khuyến mãi");
    }
  },
);

export const postVoucher = createAsyncThunk(
  "voucher/postVocuher",
  async (form, { rejectWithValue }) => {
    try {
      const res = await voucherAPI.postVoucher(form);
      return res;
    } catch (error) {
      return rejectWithValue("Không thể tạo mới voucher");
    }
  },
);

export const editVoucher = createAsyncThunk(
  "voucher/edit",
  async ({ id, form }, { rejectWithValue }) => {
    try {
      const res = await voucherAPI.editVoucher(id, form);
      return res;
    } catch (error) {
      return rejectWithValue("Không thể cập nhật voucher");
    }
  },
);

const voucherSlice = createSlice({
  name: "voucher",
  initialState: {
    vouchers: [],
    loading: false,
    error: null,
    message: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllVouchers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllVouchers.fulfilled, (state, action) => {
        state.vouchers = action.payload;
        state.loading = false;
      })
      .addCase(getAllVouchers.rejected, (state, action) => {
        state.error = "Không có mã khuyến mãi";
        state.loading = false;
      });
  },
});

export default voucherSlice.reducer;
