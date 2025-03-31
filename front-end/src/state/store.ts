import { configureStore } from "@reduxjs/toolkit";
import currentUserReducer from "./current-user/currentUserSlice";
import projectsSliceReducer from "./projects/projectsSlice";
import projectSliceReducer from "./project/projectSlice";

const store = configureStore({
  reducer: {
    currentUser: currentUserReducer,
    projects: projectsSliceReducer,
    project: projectSliceReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export default store;
