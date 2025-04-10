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

export type AddTaskArgs = {
  id: ProjectType["_id"];
  name: string;
};

export const addTask = createAsyncThunk(
  "project/addTask",
  async ({ id, name }: AddTaskArgs, { rejectWithValue }) => {
    try {
      const response = await API.post(`/projects/${id}/tasks`, { name });

      const parsedDate = projectResponseSchema.safeParse(response.data);

      if (!parsedDate.success) {
        console.error(parsedDate.error);
        return rejectWithValue("Something went wrong. Please try again later.");
      }

      return parsedDate.data.project;
    } catch (error) {
      const err = error as AxiosError;

      if (err.response?.status === 404)
        return rejectWithValue("Project not found");

      return rejectWithValue("Server error. Please try again later.");
    }
  }
);

type updateTaskArgs = {
  id: ProjectType["_id"];
  taskId: ProjectType["tasks"][number]["_id"];
  status: ProjectType["tasks"][number]["status"];
};

export const updateTask = createAsyncThunk(
  "project/updateTask",
  async ({ id, taskId, status }: updateTaskArgs, { rejectWithValue }) => {
    try {
      const response = await API.patch(`/projects/${id}/tasks/${taskId}`, {
        status,
      });

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
