import { createSlice, isAnyOf, PayloadAction } from "@reduxjs/toolkit";
import { ProjectType } from "../../utils/zodSchemas";
import { fetchProjects } from "./projectsThunk";
import {
  createProject,
  deleteProject,
  fetchProject,
  updateProject,
} from "./projectThunk";
import { addMember, removeMember } from "./membersThunk";
import { addTask, deleteTask, updateTask } from "./tasksThunk";
import { Filters } from "../../utils/types";

type ProjectsState = {
  projects: ProjectType[] | null;
  project: ProjectType | null;
  loading: boolean;
  loadingProject: boolean;
  error: string | null;
  currentPage: number | null;
  totalPages: number | null;
  totalProjects: number | null;
  loadingMembers: boolean;
  loadingTasks: boolean;
  loadingTask: ProjectType["tasks"][number]["_id"] | false;
  filters: Filters;
};

const initialState: ProjectsState = {
  projects: [],
  project: null,
  loading: false,
  loadingProject: false,
  error: null,
  currentPage: null,
  totalPages: null,
  totalProjects: null,
  loadingMembers: false,
  loadingTasks: false,
  loadingTask: false,
  filters: {
    status: null,
    sort: null,
    dueDate: null,
    dueDateBefore: null,
    dueDateAfter: null,
  },
};

const projectsSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<Filters>>) => {
      state.filters = {
        ...state.filters,
        ...action.payload,
      };
    },
    setProject(state, action) {
      state.project = action.payload;
    },
    clearProject(state) {
      state.project = null;
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder

      // -------------------------- projects----------------------------//
      .addCase(fetchProjects.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        const { projects, currentPage, totalPages, totalProjects } =
          action.payload;

        state.projects = projects;
        state.currentPage = currentPage;
        state.totalPages = totalPages;
        state.totalProjects = totalProjects;
        state.loading = false;
        state.error = null;

        state.filters = {
          status: action.meta.arg.status,
          sort: action.meta.arg.sort,
          dueDate: action.meta.arg.dueDate,
          dueDateBefore: action.meta.arg.dueDateBefore,
          dueDateAfter: action.meta.arg.dueDateAfter,
        };
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      //-------------------------- tasks----------------------------//
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
          state.projects =
            state.projects?.map(project =>
              project._id === action.payload._id ? action.payload : project
            ) || [];
        }
      )
      .addMatcher(
        isAnyOf(addTask.rejected, deleteTask.rejected, updateTask.rejected),
        (state, action) => {
          state.loadingTasks = false;
          state.loadingTask = false;
          state.error = action.payload as string;
        }
      )

      // -------------------------- members----------------------------//
      .addMatcher(isAnyOf(addMember.pending, removeMember.pending), state => {
        state.loadingMembers = true;
        state.error = null;
      })
      .addMatcher(
        isAnyOf(addMember.fulfilled, removeMember.fulfilled),
        (state, action) => {
          state.project = action.payload;
          state.error = null;
          state.projects =
            state.projects?.map(project =>
              project._id === action.payload._id ? action.payload : project
            ) || [];
          state.loadingMembers = false;
        }
      )
      .addMatcher(
        isAnyOf(addMember.rejected, removeMember.rejected),
        (state, action) => {
          state.error = action.payload as string;
          state.loadingMembers = false;
        }
      )

      // --------------------------- project----------------------------//
      .addMatcher(
        isAnyOf(
          fetchProject.pending,
          createProject.pending,
          updateProject.pending,
          deleteProject.pending
        ),
        state => {
          state.loadingProject = true;
          state.error = null;
        }
      )
      .addMatcher(
        isAnyOf(
          fetchProject.fulfilled,
          createProject.fulfilled,
          updateProject.fulfilled,
          deleteProject.fulfilled
        ),
        (state, action) => {
          state.error = null;
          state.loadingProject = false;

          if (fetchProject.fulfilled.match(action)) {
            state.project = action.payload;
          }

          if (createProject.fulfilled.match(action)) {
            state.projects?.push(action.payload);
            state.project = action.payload;
          }

          if (updateProject.fulfilled.match(action)) {
            state.projects =
              state.projects?.map(project =>
                project._id === action.payload._id ? action.payload : project
              ) || [];
          }

          if (deleteProject.fulfilled.match(action)) {
            state.projects =
              state.projects?.filter(
                project => project._id !== action.meta.arg.id
              ) || [];
          }
        }
      )
      .addMatcher(
        isAnyOf(
          fetchProject.rejected,
          createProject.rejected,
          updateProject.rejected,
          deleteProject.rejected
        ),
        (state, action) => {
          state.loadingProject = false;
          state.error = action.payload as string;
        }
      );
  },
});

export const { setFilters, setProject, clearProject, clearError } =
  projectsSlice.actions;

export default projectsSlice.reducer;
