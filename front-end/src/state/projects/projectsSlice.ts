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
  projects: ProjectType[];
  project: ProjectType | null;
  loading: boolean;
  loadingTasks: boolean;
  loadingMembers: boolean;
  loadingProject: boolean;
  loadingDelete: boolean;
  loadingTask: ProjectType["tasks"][number]["_id"] | false;
  error: string | null;
  totalPages: number;
  totalProjects: number;
  filters: Filters;
};

export const initialFilters: Filters = {
  status: null,
  sort: undefined,
  dueDate: undefined,
  dueDateBefore: null,
  dueDateAfter: null,
  currentPage: 1,
  search: "",
};

const initialState: ProjectsState = {
  projects: [],
  project: null,
  loading: false,
  loadingTasks: false,
  loadingMembers: false,
  loadingProject: false,
  loadingTask: false,
  loadingDelete: false,
  error: null,
  totalPages: 1,
  totalProjects: 0,
  filters: initialFilters,
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
    setProject(state, action: PayloadAction<ProjectType>) {
      state.project = action.payload;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.filters.currentPage = action.payload;
    },
    clearProject(state) {
      state.project = null;
    },
    clearError(state) {
      state.error = null;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    clearLoading(state) {
      state.loading = false;
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
        const { projects, totalPages, totalProjects } = action.payload;

        state.projects = projects;
        state.totalPages = totalPages;
        state.totalProjects = totalProjects;
        state.loading = false;
        state.error = null;

        state.filters = {
          ...state.filters,
          ...action.meta.arg,
        };
      })

      //  -------------------------- delete project----------------------------//
      .addCase(deleteProject.pending, state => {
        state.loadingDelete = true;
        state.error = null;
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.loadingDelete = false;
        state.error = null;
        state.projects =
          state.projects?.filter(
            project => project._id !== action.meta.arg.id
          ) || [];

        if (state.totalProjects > 0) {
          state.totalProjects--;
        }
        if (state.projects.length === 0 && state.totalPages > 1) {
          if (state.filters.currentPage === state.totalPages) {
            state.filters.currentPage--;
          }
          state.totalPages--;
        }
      })
      .addCase(deleteProject.rejected, (state, action) => {
        state.loadingDelete = false;
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
          updateProject.pending
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
          updateProject.fulfilled
        ),
        (state, action) => {
          state.error = null;
          state.loadingProject = false;

          if (fetchProject.fulfilled.match(action)) {
            state.project = action.payload;
          }

          if (createProject.fulfilled.match(action)) {
            state.projects = [...state.projects, action.payload];
            state.project = action.payload;
            state.totalProjects++;
          }

          if (updateProject.fulfilled.match(action)) {
            state.projects =
              state.projects?.map(project =>
                project._id === action.payload._id ? action.payload : project
              ) || [];
          }

          if (deleteProject.fulfilled.match(action)) {
            state.project = null;
          }
        }
      )
      .addMatcher(
        isAnyOf(
          fetchProject.rejected,
          createProject.rejected,
          updateProject.rejected
        ),
        (state, action) => {
          state.loadingProject = false;
          state.error = action.payload as string;
        }
      );
  },
});

export const {
  setFilters,
  setProject,
  clearProject,
  clearError,
  setCurrentPage,
  setLoading,
  clearLoading,
} = projectsSlice.actions;

export default projectsSlice.reducer;
