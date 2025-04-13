import { useDispatch, useSelector } from "react-redux";
import { useCallback, useEffect, useRef, useState } from "react";
import { AppDispatch, RootState } from "../../state/store";
import { fetchProjects } from "../../state/projects/projectsThunk";
import { setCurrentPage, setFilters } from "../../state/projects/projectsSlice";
import _ from "lodash";

export function useProjects() {
  const dispatch = useDispatch<AppDispatch>();
  const { projects, totalPages, totalProjects, loading, filters } = useSelector(
    (state: RootState) => state.projects
  );

  const [selectedDueDayBefore, setSelectedDueDayBefore] = useState<Date>();
  const [selectedDueDayAfter, setSelectedDueDayAfter] = useState<Date>();
  const [searchQuery, setSearchQuery] = useState("");

  const prevFiltersRef = useRef(filters);
  const firstRender = useRef(true);

  const setPage = useCallback(
    (page: number) => dispatch(setCurrentPage(page)),
    [dispatch]
  );

  //search query
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (searchQuery) dispatch(setFilters({ search: searchQuery }));
      else dispatch(setFilters({ search: "" }));
    }, 500);

    return () => clearTimeout(timeout);
  }, [searchQuery, dispatch, prevFiltersRef]);

  // fetch projects when filters change
  useEffect(() => {
    const filtersChanged = !_.isEqual(filters, prevFiltersRef.current);

    if (filtersChanged || (firstRender.current && projects?.length === 0)) {
      dispatch(fetchProjects({ ...filters }));
      prevFiltersRef.current = filters;
      firstRender.current = false;
    }
  }, [dispatch, filters, projects]);

  // filters for the due date before and after
  useEffect(() => {
    dispatch(
      setFilters({
        dueDateBefore: selectedDueDayBefore
          ? selectedDueDayBefore.toISOString()
          : null,
        dueDateAfter: selectedDueDayAfter
          ? selectedDueDayAfter.toISOString()
          : null,
      })
    );
  }, [dispatch, selectedDueDayBefore, selectedDueDayAfter]);

  //projects array has 11 elements - more pages to load
  useEffect(() => {
    if (projects?.length === 11)
      dispatch(
        setFilters({ currentPage: prevFiltersRef.current.currentPage + 1 })
      );
  }, [projects, dispatch]);

  return {
    filters,
    projects,
    totalPages,
    totalProjects,
    loading,
    setPage,
    selectedDueDayBefore,
    setSelectedDueDayBefore,
    selectedDueDayAfter,
    setSelectedDueDayAfter,
    searchQuery,
    setSearchQuery,
  };
}
