import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import { ProjectType } from "../../utils/zodSchemas";
import { createProject, fetchProject, updateProject } from "./projectThunk";
import { addMember, removeMember } from "./membersThunk";

type ProjectState = {
  project: ProjectType | null;
  loading: boolean;
  loadingMembers: boolean;
  loadingTasks: boolean;
  error: string | null;
};

const initialState: ProjectState = {
  project: null,
  loading: false,
  loadingMembers: false,
  loadingTasks: false,
  error: null,
};

export const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addMatcher(isAnyOf(addMember.pending, removeMember.pending), state => {
        state.loadingMembers = true;
        state.error = null;
      })
      .addMatcher(
        isAnyOf(addMember.fulfilled, removeMember.fulfilled),
        (state, action) => {
          state.project = action.payload;
          state.loadingMembers = false;
          state.error = null;
        }
      )
      .addMatcher(
        isAnyOf(addMember.rejected, removeMember.rejected),
        (state, action) => {
          state.error = action.payload as string;
          state.loadingMembers = false;
        }
      )
      .addMatcher(
        isAnyOf(
          fetchProject.pending,
          createProject.pending,
          updateProject.pending
        ),
        state => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        isAnyOf(
          fetchProject.fulfilled,
          createProject.fulfilled,
          updateProject.fulfilled
        ),
        (state, action) => {
          state.loading = false;
          state.error = null;
          state.project = action.payload;
        }
      )
      .addMatcher(
        isAnyOf(
          fetchProject.rejected,
          createProject.rejected,
          updateProject.rejected
        ),
        (state, action) => {
          state.loading = false;
          state.error = action.payload as string;
        }
      );
  },
});

export default projectSlice.reducer;
