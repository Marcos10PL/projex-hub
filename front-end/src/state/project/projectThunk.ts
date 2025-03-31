import { createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../utils/axiosConfig";
import { projectResponseSchema, ProjectType } from "../../utils/zodSchemas";

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
  id: string;
  projectData: Pick<ProjectType, "name" | "description" | "status" | "dueDate">;
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
      const response = await API.put(`/projects/${id}`, projectData);

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
