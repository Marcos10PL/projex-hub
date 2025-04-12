import { useEffect, useRef, useState } from "react";
import Select from "react-select";
import Spinner from "../../components/Spinner";
import SelectDueDate from "../../components/app/Projects/SelectDueDay";
import { OptionDueDate, OptionSort, OptionStatus } from "../../utils/types";
import Project from "../../components/app/Projects/Project";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../state/store";
import { fetchProjects } from "../../state/projects/projectsThunk";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { setFilters } from "../../state/projects/projectsSlice";
import { Filters } from "../../utils/types";
import {
  customStyles,
  optionsDueDate,
  optionsSort,
  optionsStatus,
} from "../../utils/data";

export default function Projects() {
  const filters = useSelector((state: RootState) => state.projects.filters);
  const { projects, loading } = useSelector(
    (state: RootState) => state.projects
  );

  const [selectedDueDayBefore, setSelectedDueDayBefore] = useState<Date>();
  const [selectedDueDayAfter, setSelectedDueDayAfter] = useState<Date>();

  const dispatch = useDispatch<AppDispatch>();

  const prevFiltersRef = useRef<Partial<Filters>>(filters);

  useEffect(() => {
    if (JSON.stringify(filters) !== JSON.stringify(prevFiltersRef.current)) {
      dispatch(fetchProjects(filters));
      prevFiltersRef.current = filters;
    } else {
      const areAllFiltersNull = Object.values(filters).every(
        value => value === null || value === undefined
      );
      if (areAllFiltersNull && projects?.length === 0)
        dispatch(fetchProjects(filters));
    }
  }, [dispatch, filters, projects]);

  useEffect(() => {
    if (selectedDueDayAfter) {
      dispatch(setFilters({ dueDateAfter: selectedDueDayAfter.toISOString() }));
    } else dispatch(setFilters({ dueDateAfter: null }));
    if (selectedDueDayBefore)
      dispatch(
        setFilters({ dueDateBefore: selectedDueDayBefore.toISOString() })
      );
    else dispatch(setFilters({ dueDateBefore: null }));
  }, [dispatch, selectedDueDayAfter, selectedDueDayBefore]);

  return (
    <>
      {/* SELECTS */}
      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2 my-4">
        <SelectDueDate
          selectedDueDay={selectedDueDayBefore}
          setSelectedDueDay={setSelectedDueDayBefore}
          title="Due before"
        />
        <SelectDueDate
          selectedDueDay={selectedDueDayAfter}
          setSelectedDueDay={setSelectedDueDayAfter}
          title="Due after"
        />
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-3">
        <label>
          <p className="opacity-70 pb-1">Status</p>
          <Select
            options={optionsStatus}
            value={optionsStatus.find(
              option => option.value === filters.status
            )}
            defaultValue={optionsStatus[0]}
            isSearchable={false}
            styles={customStyles<OptionStatus>()}
            onChange={option => dispatch(setFilters({ status: option?.value }))}
          />
        </label>
        <label>
          <p className="opacity-70 pb-1">Sort</p>
          <Select
            options={optionsSort}
            value={optionsSort.find(option => option.value === filters.sort)}
            isSearchable={false}
            defaultValue={optionsSort[0]}
            styles={customStyles<OptionSort>()}
            onChange={option => dispatch(setFilters({ sort: option?.value }))}
          />
        </label>
        <label>
          <p className="opacity-70 pb-1">Due date</p>
          <Select
            options={optionsDueDate}
            value={optionsDueDate.find(
              option => option.value === filters.dueDate
            )}
            defaultValue={optionsDueDate[0]}
            isSearchable={false}
            styles={customStyles<OptionDueDate>()}
            onChange={option =>
              dispatch(setFilters({ dueDate: option?.value }))
            }
          />
        </label>
      </section>

      {/* BUTTON - ADD PROJECT */}
      <NavLink
        to="/projects/create"
        className="button flex items-center gap-2 justify-center mt-6 md:mt-8 uppercase"
      >
        <FontAwesomeIcon icon={faPlus} />
        <span>new</span>
      </NavLink>

      {/* BORDER */}
      <div className="border-t-2 border-dashed my-6 md:my-8" />

      {/* PROJECTS */}
      {(!loading && projects?.length === 0) || !projects ? (
        <div className="text-center text-2xl font-bold text-gray-500 py-10">
          Projects not found
        </div>
      ) : !loading ? (
        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3">
          {projects.map(project => (
            <Project key={project._id} project={project} />
          ))}
        </section>
      ) : (
        <div className="flex justify-center items-center">
          <Spinner size={4} />
        </div>
      )}
    </>
  );
}
