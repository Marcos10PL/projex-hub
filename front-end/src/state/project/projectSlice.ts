import { createSlice } from "@reduxjs/toolkit";
import { ProjectType } from "../../utils/zodSchemas";
import { createProject, fetchProject, updateProject } from "./projectThunk";

type ProjectState = {
  project: ProjectType | null;
  loading: boolean;
  error: string | null;
};

const initialState: ProjectState = {
  project: null,
  loading: false,
  error: null,
};

export const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchProject.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProject.fulfilled, (state, action) => {
        state.project = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createProject.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.project = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(createProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateProject.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        state.project = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(updateProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default projectSlice.reducer;
