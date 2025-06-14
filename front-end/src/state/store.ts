import { configureStore } from "@reduxjs/toolkit";
import currentUserReducer from "./current-user/currentUserSlice";
import projectsSliceReducer from "./projects/projectsSlice";
import projectsFiltersReducer from "./filters/projectsFiltersSlice";
import { projectsApi } from "./projects/projectsApi";

const store = configureStore({
  reducer: {
    currentUser: currentUserReducer,
    projects: projectsSliceReducer,
    proejctsFilters: projectsFiltersReducer,
    [projectsApi.reducerPath]: projectsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(projectsApi.middleware),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export default store;
