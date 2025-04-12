import { configureStore } from "@reduxjs/toolkit";
import currentUserReducer from "./current-user/currentUserSlice";
import projectsSliceReducer from "./projects/projectsSlice";

const store = configureStore({
  reducer: {
    currentUser: currentUserReducer,
    projects: projectsSliceReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export default store;
