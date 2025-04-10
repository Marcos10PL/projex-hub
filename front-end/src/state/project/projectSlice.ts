import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import { ProjectType } from "../../utils/zodSchemas";
import { createProject, fetchProject, updateProject } from "./projectThunk";
import { addMember, removeMember } from "./membersThunk";
import { addTask, deleteTask, updateTask } from "./tasksThunk";

type ProjectState = {
  project: ProjectType | null;
  loading: boolean;
  loadingMembers: boolean;
  loadingTasks: boolean;
  loadingTask: ProjectType["tasks"][number]["_id"] | false;
  error: string | null;
};

const initialState: ProjectState = {
  project: null,
  loading: false,
  loadingMembers: false,
  loadingTasks: false,
  loadingTask: false,
  error: null,
};

export const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
    
      // tasks
      .addMatcher(
        isAnyOf(addTask.pending, deleteTask.pending, updateTask.pending),
        (state, action) => {
          if (updateTask.pending.match(action))
            state.loadingTask = action.meta.arg.taskId;
          state.loadingTasks = true;
          state.error = null;
        }
      )
      .addMatcher(
        isAnyOf(addTask.fulfilled, deleteTask.fulfilled, updateTask.fulfilled),
        (state, action) => {
          state.loadingTasks = false;
          state.error = null;
          state.project = action.payload;
          state.loadingTask = false;
        }
      )
      .addMatcher(
        isAnyOf(addTask.rejected, deleteTask.rejected, updateTask.rejected),
        (state, action) => {
          state.loadingTasks = false;
          state.error = action.payload as string;
          state.loadingTask = false;
        }
      )

      // members
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

      // projects
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

export const { clearError } = projectSlice.actions;

export default projectSlice.reducer;
