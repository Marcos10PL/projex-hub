import { configureStore } from "@reduxjs/toolkit";
import currentUserReducer from "./current-user/currentUserSlice";

const store = configureStore({
  reducer: {
    currentUser: currentUserReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export default store;
