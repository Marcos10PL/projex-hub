import {
  optionsDueDate,
  optionsSort,
  optionsStatus,
  optionsStatusNoNull,
} from "./data";
import { ProjectType } from "./zodSchemas";

export type OptionDueDate = (typeof optionsDueDate)[number];
export type OptionsDueDate = OptionDueDate["value"];

export type OptionSort = (typeof optionsSort)[number];
export type OptionsSort = OptionSort["value"];

export type OptionStatus = (typeof optionsStatus)[number];
export type OptionsStatus = OptionStatus["value"];

export type OptionStatusNoNull = (typeof optionsStatusNoNull)[number];
export type OptionsStatusNoNull = OptionStatusNoNull["value"];

export type OptionType =
  | OptionSort
  | OptionStatus
  | OptionDueDate
  | OptionStatusNoNull;

export type Filters = {
  status: ProjectType["status"] | null | undefined;
  sort: OptionsSort | undefined;
  dueDate: OptionsDueDate | undefined;
  dueDateBefore: string | null | undefined;
  dueDateAfter: string | null | undefined;
};

export type ProjectParams = {
  status?: OptionsStatus;
  sort?: OptionsSort;
  dueDate?: OptionsDueDate;
  dueDateBefore?: Date | null;
  dueDateAfter?: Date | null;
  page?: number | null;
  limit?: number | null;
  search?: string | null;
};
