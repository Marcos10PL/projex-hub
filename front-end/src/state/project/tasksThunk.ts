import { AxiosError } from "axios";
import { projectResponseSchema, ProjectType } from "../../utils/zodSchemas";
import API from "../../utils/axiosConfig";
import { createAsyncThunk } from "@reduxjs/toolkit";

type TaskArgs = {
  id: ProjectType["_id"];
  taskId: ProjectType["tasks"][number]["_id"];
};

export const deleteTask = createAsyncThunk(
  "project/deleteTask",
  async ({ id, taskId }: TaskArgs, { rejectWithValue }) => {
    try {
      const response = await API.delete(`/projects/${id}/tasks/${taskId}`);

      const parsedDate = projectResponseSchema.safeParse(response.data);

      if (!parsedDate.success) {
        console.error(parsedDate.error);
        return rejectWithValue("Something went wrong. Please try again later.");
      }

      return parsedDate.data.project;
    } catch (error) {
      const err = error as AxiosError;

      if (err.response?.status === 404)
        return rejectWithValue("Task not found");

      return rejectWithValue("Server error. Please try again later.");
    }
  }
);
