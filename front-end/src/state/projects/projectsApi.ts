import { createApi } from "@reduxjs/toolkit/query/react";
import {
  ApiResponse,
  ProjectResponse,
  ProjectsResponse,
  ProjectType,
} from "../../utils/zodSchemas";
import { Filters } from "../../utils/types";
import baseQueryWithErrorHandling from "../../utils/baseQuery";

export const projectsApi = createApi({
  reducerPath: "projectsApi",
  baseQuery: baseQueryWithErrorHandling,
  tagTypes: ["Projects", "Project"],
  endpoints: builder => ({
    getProjects: builder.query<ProjectsResponse, Partial<Filters>>({
      query: filters => {
        const params = new URLSearchParams();
        if (filters.search) params.set("search", filters.search);
        if (filters.status) params.set("status", filters.status);
        if (filters.sort) params.set("sort", filters.sort);
        if (filters.dueDate) params.set("dueDate", filters.dueDate);
        if (filters.dueDateBefore)
          params.set("dueDateBefore", filters.dueDateBefore);
        if (filters.dueDateAfter)
          params.set("dueDateAfter", filters.dueDateAfter);
        if (filters.currentPage)
          params.set("page", filters.currentPage.toString());
        if (filters.limit) params.set("limit", filters.limit.toString());
        return `projects?${params.toString()}`;
      },
      providesTags: result =>
        result
          ? [
              ...result.projects.map(project => ({
                type: "Project" as const,
                id: project._id,
              })),
              { type: "Projects", id: "LIST" },
            ]
          : [{ type: "Projects", id: "LIST" }],
    }),

    getProject: builder.query<ProjectResponse, ProjectType["_id"]>({
      query: id => `projects/${id}`,
      providesTags: (_, __, id) => [{ type: "Project", id }],
    }),

    createProject: builder.mutation<ProjectResponse, Partial<ProjectType>>({
      query: body => ({
        url: "projects",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Projects", id: "LIST" }],
    }),

    updateProject: builder.mutation<
      ProjectResponse,
      { id: ProjectType["_id"]; data: Partial<ProjectType> }
    >({
      query: ({ id, data }) => ({
        url: `projects/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_, __, { id }) => [{ type: "Project", id }],
    }),

    deleteProject: builder.mutation<ApiResponse, { id: ProjectType["_id"] }>({
      query: ({ id }) => ({
        url: `projects/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: "Project", id },
        { type: "Projects", id: "LIST" },
      ],
    }),

    addTask: builder.mutation<
      ProjectResponse,
      { id: ProjectType["_id"]; name: ProjectType["tasks"][number]["name"] }
    >({
      query: ({ id, name }) => ({
        url: `projects/${id}/tasks`,
        method: "POST",
        body: { name },
      }),
      invalidatesTags: result => [
        { type: "Project", id: result?.project?._id },
      ],
    }),

    updateTask: builder.mutation<
      ProjectResponse,
      {
        id: ProjectType["_id"];
        taskId: ProjectType["tasks"][number]["_id"];
        task: Partial<ProjectType["tasks"][number]>;
      }
    >({
      query: ({ id, taskId, task }) => ({
        url: `projects/${id}/tasks/${taskId}`,
        method: "PATCH",
        body: task,
      }),
      invalidatesTags: result => [
        { type: "Project", id: result?.project?._id },
      ],
    }),

    deleteTask: builder.mutation<
      ProjectResponse,
      { id: ProjectType["_id"]; taskId: ProjectType["tasks"][number]["_id"] }
    >({
      query: ({ id, taskId }) => ({
        url: `projects/${id}/tasks/${taskId}`,
        method: "DELETE",
      }),
      invalidatesTags: result => [
        { type: "Project", id: result?.project?._id },
      ],
    }),

    addMember: builder.mutation<
      ProjectType,
      {
        id: ProjectType["_id"];
        username: ProjectType["members"][number]["username"];
      }
    >({
      query: ({ id, username }) => ({
        url: `projects/${id}/members`,
        method: "POST",
        body: { username },
      }),
      invalidatesTags: result => [{ type: "Project", id: result?._id }],
    }),

    removeMember: builder.mutation<
      ProjectType,
      {
        id: ProjectType["_id"];
        memberId: ProjectType["members"][number]["_id"];
        currentUser?: boolean;
      }
    >({
      query: ({ id, memberId }) => ({
        url: `projects/${id}/members/${memberId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_, __, { id, currentUser }) =>
        currentUser
          ? [{ type: "Project", id }]
          : [
              { type: "Project", id },
              { type: "Projects", id: "LIST" },
            ],
    }),
  }),
});

export const {
  useGetProjectsQuery,
  useGetProjectQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
  useAddTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
  useAddMemberMutation,
  useRemoveMemberMutation,
} = projectsApi;
