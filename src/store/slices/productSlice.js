import productAPI from "@/api/productAPI";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchAllProduct = createAsyncThunk(
  "product/productSlice",
  async (_, { rejectWithValue }) => {
    try {
      const res = await productAPI.fetchAllProduct();

      return res.data;
    } catch (error) {
      return rejectWithValue("Không có dữ liệu của sản phẩm");
    }
  },
);

const productSlice = createSlice({
  name: "product",
  initialState: {
    products: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchAllProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default productSlice.reducer;
