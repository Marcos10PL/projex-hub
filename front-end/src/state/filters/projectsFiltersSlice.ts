import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Filters } from "../../utils/types";

const initialState: Filters = {
  status: null,
  sort: undefined,
  dueDate: undefined,
  dueDateBefore: null,
  dueDateAfter: null,
  currentPage: 1,
  search: "",
};

const projectsFilters = createSlice({
  name: "projectsFilters",
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<Filters>>) => {
      Object.assign(state, action.payload);
    },
    resetFilters: () => initialState,
  },
});

export const { setFilters, resetFilters } = projectsFilters.actions;
export default projectsFilters.reducer;
