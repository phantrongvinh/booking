import categoryAPI from "@/api/categoryAPI";
import categories from "@/mockData/categories";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchAllCategory = createAsyncThunk(
  "category/categorySlice",
  async (_, { rejectWithValue }) => {
    try {
      const res = await categoryAPI.fetchCategory();

      return res;
    } catch (error) {
      return rejectWithValue("Không có dữ liệu danh mục");
    }
  },
);

const categorySlice = createSlice({
  name: "category",
  initialState: {
    categories: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchAllCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default categorySlice.reducer;
