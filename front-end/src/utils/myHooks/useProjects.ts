import { useState, useEffect, useRef, useMemo } from "react";
import useApi from "./useApi";
import { projectsResponseSchema, ProjectType } from "../zodSchemas";
import {
  OptionsDueDate,
  OptionsSort,
  OptionsStatus,
  ProjectParams,
} from "../data";

type Filters = {
  selectedStatus: OptionsStatus | undefined;
  selectedSort: OptionsSort | undefined;
  selectedDueDate: OptionsDueDate | undefined;
  selectedDueDayBefore: Date | undefined;
  selectedDueDayAfter: Date | undefined;
};

export default function useProjects(filters: Filters) {
  const [projects, setProjects] = useState<ProjectType[]>([]);

  const { fetchData, loading, errorMsg } = useApi(
    "projects",
    projectsResponseSchema,
    "get",
    { 404: "Projects not found." }
  );

  const filtersMemo = useMemo(() => {
    return {
      selectedStatus: filters.selectedStatus,
      selectedSort: filters.selectedSort,
      selectedDueDate: filters.selectedDueDate,
      selectedDueDayBefore: filters.selectedDueDayBefore,
      selectedDueDayAfter: filters.selectedDueDayAfter,
    };
  }, [
    filters.selectedStatus,
    filters.selectedSort,
    filters.selectedDueDate,
    filters.selectedDueDayBefore,
    filters.selectedDueDayAfter,
  ]);

  const fetchDataRef = useRef(fetchData);

  useEffect(() => {
    const getProjects = async () => {
      const params: ProjectParams = {};
      const {
        selectedStatus,
        selectedSort,
        selectedDueDate,
        selectedDueDayBefore,
        selectedDueDayAfter,
      } = filtersMemo;

      if (selectedStatus) params.status = selectedStatus;
      if (selectedSort) params.sort = selectedSort;
      if (selectedDueDate) params.dueDate = selectedDueDate;

      if (selectedDueDayBefore)
        params.dueDateBefore = selectedDueDayBefore.toISOString();

      if (selectedDueDayAfter)
        params.dueDateAfter = selectedDueDayAfter.toISOString();

      const data = await fetchDataRef.current({ params });
      if (data) setProjects(data.projects);
    };

    getProjects();
  }, [filtersMemo]);

  return { projects, loading, errorMsg } as const;
}
