import { createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../utils/axiosConfig";
import { projectResponseSchema, ProjectType } from "../../utils/zodSchemas";
import { AxiosError } from "axios";

export const fetchProject = createAsyncThunk(
  "project/fetchProject",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await API.get(`/projects/${id}`);

      const parsedDate = projectResponseSchema.safeParse(response.data);

      if (!parsedDate.success) {
        console.error(parsedDate.error);
        return rejectWithValue("Something went wrong. Please try again later.");
      }

      return parsedDate.data.project;
    } catch (error) {
      console.error(error);
      return rejectWithValue("Server error. Please try again later.");
    }
  }
);

type ProjectArgs = {
  id: ProjectType["_id"];
  projectData: Partial<
    Pick<ProjectType, "name" | "description" | "status" | "dueDate">
  >;
};

export const createProject = createAsyncThunk(
  "project/createProject",
  async ({ id, projectData }: ProjectArgs, { rejectWithValue }) => {
    try {
      const response = await API.post(`/projects${id}`, projectData);

      const parsedDate = projectResponseSchema.safeParse(response.data);

      if (!parsedDate.success) {
        console.error(parsedDate.error);
        return rejectWithValue("Something went wrong. Please try again later.");
      }

      return parsedDate.data.project;
    } catch (error) {
      console.error(error);
      return rejectWithValue("Server error. Please try again later.");
    }
  }
);

export const updateProject = createAsyncThunk(
  "project/updateProject",
  async ({ id, projectData }: ProjectArgs, { rejectWithValue }) => {
    try {
      const response = await API.patch(`/projects/${id}`, projectData);

      const parsedDate = projectResponseSchema.safeParse(response.data);

      if (!parsedDate.success) {
        console.error(parsedDate.error);
        return rejectWithValue("Something went wrong. Please try again later.");
      }

      return parsedDate.data.project;
    } catch (error) {
      const err = error as AxiosError;

      if (err.response?.status === 400) {
        return rejectWithValue("Project already exists with this name");
      }
      return rejectWithValue("Server error. Please try again later.");
    }
  }
);

export const deleteProject = createAsyncThunk(
  "project/deleteProject",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await API.delete(`/projects/${id}`);

      if (response.status !== 200) {
        return rejectWithValue("Something went wrong. Please try again later.");
      }

      return id;
    } catch (error) {
      console.error(error);
      return rejectWithValue("Server error. Please try again later.");
    }
  }
);
