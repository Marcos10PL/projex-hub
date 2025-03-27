//------------ Select options for projects ------------//

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

export type OptionDueDate = (typeof optionsDueDate)[number];
export type OptionsDueDate = OptionDueDate["value"];

export type OptionSort = (typeof optionsSort)[number];
export type OptionsSort = OptionSort["value"];

export type OptionStatus = (typeof optionsStatus)[number];
export type OptionsStatus = OptionStatus["value"];

export type OptionType = OptionSort | OptionStatus | OptionDueDate;

export const optionsStatusNoNull = optionsStatusCommon;

export type OptionStatusNoNull = (typeof optionsStatusNoNull)[number];
export type OptionsStatusNoNull = OptionStatusNoNull["value"];

// ------------ Status color ------------//

export const statusColor = {
  active: "bg-green-500",
  planned: "bg-yellow-500",
  completed: "bg-blue-500",
  delayed: "bg-red-500",
} as const;
