import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { projectResponseSchema, ProjectType } from "../../utils/zodSchemas";
import API from "../../utils/axiosConfig";

export type AddMemberArgs = {
  id: string;
  username: string;
};

export const addMember = createAsyncThunk(
  "project/addMember",
  async ({ id, username }: AddMemberArgs, { rejectWithValue }) => {
    try {
      const response = await API.post(`/projects/${id}/members`, { username });

      const parsedDate = projectResponseSchema.safeParse(response.data);

      if (!parsedDate.success) {
        console.error(parsedDate.error);
        return rejectWithValue("Something went wrong. Please try again later.");
      }

      return parsedDate.data.project;
    } catch (error) {
      const err = error as AxiosError;

      if (err.response?.status === 404)
        return rejectWithValue("Member not found");

      if (err.response?.status === 400)
        return rejectWithValue("Member already in project");

      return rejectWithValue("Server error. Please try again later.");
    }
  }
);

type RemoveMemberArgs = {
  id: ProjectType["_id"];
  memberId: ProjectType["members"][number]["_id"];
};

export const removeMember = createAsyncThunk(
  "project/removeMember",
  async ({ id, memberId }: RemoveMemberArgs, { rejectWithValue }) => {
    try {
      const response = await API.delete(`/projects/${id}/members/${memberId}`);

      const parsedDate = projectResponseSchema.safeParse(response.data);

      if (!parsedDate.success) {
        console.error(parsedDate.error);
        return rejectWithValue("Something went wrong. Please try again later.");
      }

      return parsedDate.data.project;
    } catch (error) {
      const err = error as AxiosError;

      if (err.response?.status === 404)
        return rejectWithValue("Member not found");

      if (err.response?.status === 400)
        return rejectWithValue(
          "Server error. Probably member left the project. Please refresh the page."
        );

      return rejectWithValue("Server error. Please try again later.");
    }
  }
);
