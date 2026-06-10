import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    isLoggedIn: false,
  },
  reducers: {},
  extraReducers: (builder) => {},
});
export const authReducer = authSlice.reducer;
