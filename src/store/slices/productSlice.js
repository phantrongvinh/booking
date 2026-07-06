import productAPI from "@/api/productAPI";
import productIngredientAPI from "@/api/productIngredient";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchAllProduct = createAsyncThunk(
  "product/productSlice",
  async (_, { rejectWithValue }) => {
    try {
      const res = await productAPI.fetchProduct();

      return res;
    } catch (error) {
      return rejectWithValue("Không có dữ liệu của sản phẩm");
    }
  },
);

export const createProduct = createAsyncThunk(
  "product/createProduct",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await productAPI.createProduct(formData);

      return res;
    } catch (error) {
      return rejectWithValue("Tạo sản phẩm thất bại");
    }
  },
);

export const linkProductIngredient = createAsyncThunk(
  "product/linkIngredient",
  async (
    { productName, ingredientName, quantityRequired },
    { rejectWithValue },
  ) => {
    try {
      const res = await productIngredientAPI.linkProductIngredient({
        productName,
        ingredientName,
        quantityRequired,
      });
      return res;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          `Liên kết nguyên liệu "${ingredientName}" thất bại`,
      );
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
      })
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(linkProductIngredient.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(linkProductIngredient.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(linkProductIngredient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default productSlice.reducer;
