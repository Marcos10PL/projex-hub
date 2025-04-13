import { createAsyncThunk } from "@reduxjs/toolkit";
import { Filters } from "../../utils/types";
import API from "../../utils/axiosConfig";
import { projectsResponseSchema } from "../../utils/zodSchemas";

export const fetchProjects = createAsyncThunk(
  "projects/fetchProjects",
  async (filters: Filters, { rejectWithValue }) => {
    try {
      const response = await API.get("/projects", {
        params: { ...filters, page: filters.currentPage },
      });

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
