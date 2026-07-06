import ingredientAPI from "@/api/ingredientAPI";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchAllIngredient = createAsyncThunk(
  "ingredient/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await ingredientAPI.fetchAllIngredient();

      return res;
    } catch (error) {
      return rejectWithValue("Không tìm thấy nguyên liệu");
    }
  },
);

export const updateIngredientStock = createAsyncThunk(
  "ingredient/update",
  async ({ name, currentStock }, { rejectWithValue }) => {
    try {
      const res = await ingredientAPI.updateIngredientStock(name, currentStock);
      return res;
    } catch (error) {
      return rejectWithValue("Cập nhật tồn kho thất bại");
    }
  },
);

const ingredientSlice = createSlice({
  name: "ingredient",
  initialState: {
    ingredients: [],
    loading: false,
    error: null,
    message: null,
  },
  reducers: {},
  extraReducers: (buidler) => {
    buidler
      .addCase(fetchAllIngredient.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllIngredient.fulfilled, (state, action) => {
        state.ingredients = action.payload;
        state.loading = false;
      })
      .addCase(fetchAllIngredient.rejected, (state, action) => {
        state.loading = false;
        state.error = "Không tìm được nguyên liệu";
      })
      .addCase(updateIngredientStock.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateIngredientStock.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(updateIngredientStock.rejected, (state, action) => {
        state.loading = false;
        state.error = "Cập nhật tồn kho thất bại";
      });
  },
});

export default ingredientSlice.reducer;
