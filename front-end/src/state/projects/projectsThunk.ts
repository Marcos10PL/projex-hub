import { createAsyncThunk } from "@reduxjs/toolkit";
import { ProjectParams } from "../../utils/data";
import API from "../../utils/axiosConfig";
import { projectsResponseSchema } from "../../utils/zodSchemas";

export const fetchProjects = createAsyncThunk(
  "projects/fetchProjects",
  async (filetrs: ProjectParams, { rejectWithValue }) => {
    try {
      const response = await API.get("/projects", { params: filetrs });

      const parsedDate = projectsResponseSchema.safeParse(response.data);

      if (!parsedDate.success) {
        console.error(parsedDate.error);
        return rejectWithValue("Something went wrong. Please try again later.");
      }

      return parsedDate.data;
    } catch (error) {
      console.error(error);
      return rejectWithValue("Server error. Please try again later.");
    }
  }
);