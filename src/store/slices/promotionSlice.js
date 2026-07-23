import promotionAPI from "@/api/promotionAPI";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const getPromotion = createAsyncThunk(
  "promotion/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await promotionAPI.getPromotion();

      return res.data;
    } catch (error) {
      return rejectWithValue(
        error?.data?.response?.message ?? "Không có khuyến mãi",
      );
    }
  },
);

export const deletePromotion = createAsyncThunk(
  "promotion/delete",
  async (id, { rejectWithValue }) => {
    try {
      await promotionAPI.deletePromotion(id);
      return id;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message ?? "Xóa thất bại");
    }
  },
);

export const createPromotion = createAsyncThunk(
  "promotion/create",
  async (form, { rejectWithValue }) => {
    try {
      const res = await promotionAPI.postPromotion(form);
      return res.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message ?? "Tạo thất bại");
    }
  },
);

export const updatePromotion = createAsyncThunk(
  "promotion/update",
  async ({ id, form }, { rejectWithValue }) => {
    try {
      const res = await promotionAPI.updatePromotion(id, form);
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ?? "Cập nhật thất bại",
      );
    }
  },
);

export const getPromotionById = createAsyncThunk(
  "promotion/getById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await promotionAPI.getPromotionById(id);
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ?? "Không tìm thấy",
      );
    }
  },
);

export const addPromotionOnProduct = createAsyncThunk(
  "promotion/addProduct",
  async ({ promotionId, productIds }, { rejectWithValue }) => {
    try {
      const res = await promotionAPI.addPromotionOnProduct(
        promotionId,
        productIds,
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ?? "Thêm sản phẩm thất bại",
      );
    }
  },
);

export const deletePromotionOnProduct = createAsyncThunk(
  "promotion/deleteProduct",
  async ({ promotionId, productIds }, { rejectWithValue }) => {
    try {
      const res = await promotionAPI.deletePromotionOnProduct(
        promotionId,
        productIds,
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ?? "Xóa sản phẩm thất bại",
      );
    }
  },
);

export const importPromotion = createAsyncThunk(
  "promotion/import",
  async (file, { rejectWithValue }) => {
    try {
      const res = await promotionAPI.importPromotion(file);

      return res.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ?? "Import thất bại",
      );
    }
  },
);

export const getPromotionOngoing = createAsyncThunk(
  "promotion/Ongoing",
  async (_, { rejectWithValue }) => {
    try {
      const res = await promotionAPI.getPromotionOngoing();
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ?? "Không có khuyến mãi",
      );
    }
  },
);

const promotionSlice = createSlice({
  name: "promotion",
  initialState: {
    promotions: [],
    loading: false,
    error: null,
    message: null,
    promotionOngoing: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getPromotion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPromotion.fulfilled, (state, action) => {
        state.loading = false;
        state.promotions = action.payload;
      })
      .addCase(getPromotion.rejected, (state, action) => {
        state.loading = false;
        state.error = "Không có khuyến mãi";
      })
      .addCase(getPromotionOngoing.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPromotionOngoing.fulfilled, (state, action) => {
        state.loading = false;
        state.promotionOngoing = action.payload;
      })
      .addCase(getPromotionOngoing.rejected, (state, action) => {
        state.loading = false;
        state.error = "Không có khuyến mãi";
      });
  },
});

export default promotionSlice.reducer;
