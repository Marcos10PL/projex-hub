import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import API from "../../utils/axiosConfig";
import { User } from "../../utils/zodSchemas";
import { AxiosError } from "axios";

type CurrentUserState = {
  currentUser: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
};

const initialState: CurrentUserState = {
  currentUser: null,
  isAuthenticated: false,
  loading: true,
  error: null,
};

const currentUserSlice = createSlice({
  name: "currentUser",
  initialState,
  reducers: {
    setEmail(state, action: PayloadAction<User["email"]>) {
      if (state.currentUser) {
        state.currentUser.email = action.payload;
      }
    },
    setUsername(state, action: PayloadAction<User["username"]>) {
      if (state.currentUser) {
        state.currentUser.username = action.payload;
      }
    },
    setCurrentUser(state, action: PayloadAction<User>) {
      state.currentUser = action.payload;
      state.isAuthenticated = true;
    },
    clearCurrentUser(state, action) {
      state.currentUser = null;
      state.isAuthenticated = false;
      state.error = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(checkAuth.fulfilled, (state, action: PayloadAction<User>) => {
        state.currentUser = action.payload;
        state.isAuthenticated = action.payload !== null;
        state.loading = false;
        state.error = null;
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.currentUser = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.error = action.error.message as string;
      });
  },
});

export const checkAuth = createAsyncThunk("currentUser/checkAuth", async () => {
  try {
    const res = await API.get("auth/check");
    return res.data.user;
  } catch (error) {
    const axiosError = error as AxiosError;

    if (axiosError.message === "Network Error") {
      throw new Error(
        "Network Error. Probably too many requests. Try again later."
      );
    }
    throw new Error();
  }
});

export const { setCurrentUser, clearCurrentUser, setEmail, setUsername } = currentUserSlice.actions;
export default currentUserSlice.reducer;
