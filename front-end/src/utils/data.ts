//------------ Select options for projects ------------//

import { StylesConfig } from "react-select";
import { OptionType } from "./types";

const optionsStatusCommon = [
  { value: "active", label: "Active" },
  { value: "planned", label: "Planned" },
  { value: "completed", label: "Completed" },
  { value: "delayed", label: "Delayed" },
] as const;

export const optionsStatus = [
  { value: null, label: "All" },
  ...optionsStatusCommon,
] as const;

export const optionsSort = [
  { value: null, label: "All" },
  { value: "dueDateAsc", label: "Earliest due date" },
  { value: "dueDateDesc", label: "Latest due date" },
  { value: "latest", label: "Latest created" },
  { value: "oldest", label: "Oldest created" },
] as const;

export const optionsDueDate = [
  { value: null, label: "All" },
  { value: "today", label: "Today" },
  { value: "thisWeek", label: "This week" },
  { value: "nextWeek", label: "Next week" },
  { value: "thisMonth", label: "This month" },
  { value: "nextMonth", label: "Next month" },
  { value: "overdue", label: "Overdue" },
  { value: "noDueDate", label: "No due date" },
] as const;

export const optionsStatusNoNull = optionsStatusCommon;

// ------------ Status color ------------//

export const statusColor = {
  active: "bg-green-500",
  planned: "bg-yellow-500",
  completed: "bg-blue-500",
  delayed: "bg-red-500",
} as const;

// ------------ Select styles ------------//
export const customStyles = <T extends OptionType>(): StylesConfig<
  T,
  false
> => ({
  control: (styles, { isFocused }) => ({
    ...styles,
    backgroundColor: "#1e2939",
    borderRadius: "0.5rem",
    border: isFocused ? "2px solid var(--primary)" : "2px solid #6a7282",
    outline: isFocused ? "2px solid #020618" : "2px solid #020618",
    padding: "0.1rem",
    ":hover": {
      border: "2px solid var(--primary)",
      outline: isFocused ? "2px solid #020618" : "2px solid #020618",
      backgroundColor: "#364153",
    },
  }),
  dropdownIndicator: styles => ({
    ...styles,
    color: "var(--text)",
    ":hover": {
      color: "var(--text)",
    },
  }),
  option: (styles, { isFocused }) => ({
    ...styles,
    backgroundColor: isFocused ? "#4B5563" : "#2D3748",
    ":active": {
      backgroundColor: "#4B5563",
    },
    ":hover": {
      backgroundColor: "#4B5563",
    },
  }),
  menu: styles => ({
    ...styles,
    backgroundColor: "#2D3748",
    outline: "2px solid #568",
  }),
  singleValue: styles => ({
    ...styles,
    color: "var(--text)",
  }),
});

export const MAX_TASKS = 50;

