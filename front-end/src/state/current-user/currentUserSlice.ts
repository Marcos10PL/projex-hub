import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import API from "../../utils/axiosConfig";
import { User } from "../../utils/zodSchemas";

type CurrentUserState = {
  currentUser: User | null;
  isAuthenticated: boolean;
  loading: boolean;
};

const initialState: CurrentUserState = {
  currentUser: null,
  isAuthenticated: false,
  loading: true,
};

const currentUserSlice = createSlice({
  name: "currentUser",
  initialState,
  reducers: {
    setCurrentUser(state, action: PayloadAction<null | User>) {
      state.currentUser = action.payload;
      state.isAuthenticated = true;
    },
    clearCurrentUser(state) {
      state.currentUser = null;
      state.isAuthenticated = false;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.currentUser = action.payload;
        state.isAuthenticated = action.payload !== null;
        state.loading = false;
      })
      .addCase(checkAuth.rejected, state => {
        state.currentUser = null;
        state.isAuthenticated = false;
        state.loading = false;
      });
  },
});

export const checkAuth = createAsyncThunk("currentUser/checkAuth", async () => {
  try {
    const res = await API.get("auth/check");
    return res.data.user;
    // eslint-disable-next-line
  } catch (error) {
    return null;
  }
});

export const { setCurrentUser, clearCurrentUser } = currentUserSlice.actions;
export default currentUserSlice.reducer;
