import { useEffect, useState } from "react";
import Select from "react-select";
import Spinner from "../../components/Spinner";
import SelectDueDate from "../../components/app/Projects/SelectDueDay";
import {
  customStyles,
  OptionDueDate,
  optionsDueDate,
  OptionsDueDate,
  OptionSort,
  optionsSort,
  OptionsSort,
  optionsStatus,
  OptionsStatus,
  OptionStatus,
  ProjectParams,
} from "../../utils/data";
import Project from "../../components/app/Projects/Project";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../state/store";
import { fetchProjects } from "../../state/projects/projectsThunk";

export default function Projects() {
  const [selectedStatus, setSelectedStatus] = useState<OptionsStatus>();
  const [selectedSort, setSelectedSort] = useState<OptionsSort>();
  const [selectedDueDate, setSelectedDueDate] = useState<OptionsDueDate>();
  const [selectedDueDayBefore, setSelectedDueDayBefore] = useState<Date>();
  const [selectedDueDayAfter, setSelectedDueDayAfter] = useState<Date>();

  const { projects, loading } = useSelector(
    (state: RootState) => state.projects
  );
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const filters: ProjectParams = {
      status: selectedStatus,
      sort: selectedSort,
      dueDate: selectedDueDate,
      dueDateBefore: selectedDueDayBefore,
      dueDateAfter: selectedDueDayAfter,
    };
    if (filters) dispatch(fetchProjects(filters));
  }, [
    dispatch,
    selectedStatus,
    selectedSort,
    selectedDueDate,
    selectedDueDayBefore,
    selectedDueDayAfter,
  ]);

  useEffect(() => {
    if (selectedDueDayBefore) setSelectedDueDate(null);
    if (selectedDueDayAfter) setSelectedDueDate(null);
  }, [selectedDueDayBefore, selectedDueDayAfter]);

  useEffect(() => {
    if (selectedDueDate) {
      setSelectedDueDayBefore(undefined);
      setSelectedDueDayAfter(undefined);
    }
  }, [selectedDueDate]);

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
              option => option.value === selectedStatus
            )}
            isSearchable={false}
            styles={customStyles<OptionStatus>()}
            onChange={option => setSelectedStatus(option?.value)}
          />
        </label>
        <label>
          <p className="opacity-70 pb-1">Sort</p>
          <Select
            options={optionsSort}
            value={optionsSort.find(option => option.value === selectedSort)}
            isSearchable={false}
            styles={customStyles<OptionSort>()}
            onChange={option => setSelectedSort(option?.value)}
          />
        </label>
        <label>
          <p className="opacity-70 pb-1">Due date</p>
          <Select
            options={optionsDueDate}
            value={optionsDueDate.find(
              option => option.value === selectedDueDate
            )}
            isSearchable={false}
            styles={customStyles<OptionDueDate>()}
            onChange={option => setSelectedDueDate(option?.value)}
          />
        </label>
      </section>

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
