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

const ingredientSlice = createSlice({
  name: "ingredient",
  initialState: {
    ingredients: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (buidler) => {
    buidler
      .addCase(fetchAllIngredient.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllIngredient.fulfilled, (state, action) => {
        ((state.ingredients = action.payload), (state.loading = false));
      })
      .addCase(fetchAllIngredient.rejected, (state, action) => {
        state.loading = false;
        state.error = "Không tìm được nguyên liệu";
      });
  },
});

export default ingredientSlice.reducer;
