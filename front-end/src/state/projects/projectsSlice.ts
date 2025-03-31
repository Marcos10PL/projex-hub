import { createSlice } from "@reduxjs/toolkit";
import { ProjectType } from "../../utils/zodSchemas";
import { fetchProjects } from "./projectsThunk";

type ProjectsState = {
  projects: ProjectType[] | null;
  loading: boolean;
  error: string | null;
  currentPage: number | null;
  totalPages: number | null;
  totalProjects: number | null;
};

const initialState: ProjectsState = {
  projects: [],
  loading: false,
  error: null,
  currentPage: null,
  totalPages: null,
  totalProjects: null,
};

const projectsSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchProjects.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (_, action) => ({
        ...action.payload,
        loading: false,
        error: null,
      }))
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default projectsSlice.reducer;
