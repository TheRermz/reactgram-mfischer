import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "../services/authService";

const user = JSON.parse(localStorage.getItem("user"));

const initState = {
  user: user ? user : null,
  error: false,
  success: false,
  loading: false,
};

// register an user and sign in

export const register = createAsyncThunk(
  "auth/register",
  async (user, thunkAPI) => {
    const data = await authService.register(user);

    // check for error
    if (data.error) {
      return thunkAPI.rejectWithValue(data.errors[0]);
    }
    return data;
  },
);

export const authSlice = createSlice({
  name: "auth",
  initialState: initState,
  reducers: {
    reset: (state) => {
      state.error = false;
      state.success = false;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.error = false;
        state.success = true;
        state.user = action.payload; // data from register
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.user = null;
      });
  },
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;
