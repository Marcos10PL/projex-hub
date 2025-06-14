import { useGetProjectsQuery } from "../../state/projects/projectsApi";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../state/store";
import { setFilters } from "../../state/filters/projectsFiltersSlice";
import { debounce } from "lodash";
import { useEffect } from "react";

type ProjectFilters = {
  limit?: number;
};

export function useProjects({ limit }: ProjectFilters) {
  const filters = useSelector((state: RootState) => state.proejctsFilters);
  const dispatch = useDispatch<AppDispatch>();

  const { data, isLoading } = useGetProjectsQuery({
    ...filters,
    limit: limit ?? 6,
  });

  const handleSearch = debounce((value: string) => {
    dispatch(setFilters({ search: value, currentPage: 1 }));
  }, 500);

  const projects = data?.projects ?? [];
  const totalPages = data?.totalPages ?? 1;
  const totalProjects = data?.totalProjects ?? 0;

  const setPage = (page: number) => dispatch(setFilters({ currentPage: page }));

  useEffect(() => {
    if (projects.length === 0 && filters.currentPage > 1) {
      dispatch(setFilters({ currentPage: filters.currentPage - 1 }));
    }
  }, [projects.length, filters.currentPage, dispatch]);

  return {
    filters,
    projects,
    totalPages,
    totalProjects,
    loading: isLoading,
    setPage,
    setFilters,
    handleSearch,
  };
}
