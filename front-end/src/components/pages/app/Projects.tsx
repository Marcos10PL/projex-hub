import { useEffect, useRef, useState } from "react";
import { ProjectType, projectsResponseSchema } from "../../../utils/zodSchemas";
import useApi from "../../../utils/myHooks/useApi";
import Select, { StylesConfig } from "react-select";
import Spinner from "../../Spinner";
import SelectDueDate from "../../app/Projects/SelectDueDay";
import {
  OptionDueDate,
  optionsDueDate,
  OptionsDueDate,
  OptionSort,
  optionsSort,
  OptionsSort,
  optionsStatus,
  OptionsStatus,
  OptionStatus,
  OptionType,
} from "../../../utils/data";
import Project from "../../app/Projects/Project";

const customStyles = <T extends OptionType>(): StylesConfig<T, false> => ({
  control: (styles, { isFocused }) => ({
    ...styles,
    backgroundColor: "#2D3748",
    border: "none",
    outline: isFocused ? "2px solid #8500dd" : "2px solid #568",
    marginBottom: "0.1rem",
    ":hover": {
      border: "none",
      backgroundColor: "#6799",
    },
  }),
  dropdownIndicator: styles => ({
    ...styles,
    color: "white",
  }),
  option: (styles, { isFocused }) => ({
    ...styles,
    backgroundColor: isFocused ? "#4B5563" : "#2D3748",
    color: "white",
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
    color: "white",
  }),
});

export default function Projects() {
  const [selectedStatus, setSelectedStatus] = useState<OptionsStatus>();
  const [selectedSort, setSelectedSort] = useState<OptionsSort>();
  const [selectedDueDate, setSelectedDueDate] = useState<OptionsDueDate>();
  const [selectedDueDayBefore, setSelectedDueDayBefore] = useState<Date>();
  const [selectedDueDayAfter, setSelectedDueDayAfter] = useState<Date>();
  const [projects, setProjects] = useState<ProjectType[]>([]);

  const { fetchData, loading } = useApi(
    "projects",
    projectsResponseSchema,
    "get",
    { 404: "Projects not found." }
  );

  const fetchDataRef = useRef(fetchData);

  useEffect(() => {
    const getProjects = async () => {
      let params = {};

      if (selectedStatus) params = { ...params, status: selectedStatus };
      if (selectedSort) params = { ...params, sort: selectedSort };
      if (selectedDueDate) params = { ...params, dueDate: selectedDueDate };

      if (selectedDueDayBefore) {
        const fixedDate = new Date(selectedDueDayBefore);
        const localISOTime = new Date(
          fixedDate.getTime() - fixedDate.getTimezoneOffset() * 60000
        ).toISOString();

        params = {
          ...params,
          dueDateBefore: localISOTime,
        };
      }

      if (selectedDueDayAfter) {
        const fixedDate = new Date(selectedDueDayAfter);
        const localISOTime = new Date(
          fixedDate.getTime() - fixedDate.getTimezoneOffset() * 60000
        ).toISOString();

        params = {
          ...params,
          dueDateAfter: localISOTime,
        };
      }

      const data = await fetchDataRef.current({ params });
      console.log(data);
      if (data) setProjects(data.projects);
    };
    getProjects();
  }, [
    selectedStatus,
    selectedSort,
    selectedDueDate,
    selectedDueDayBefore,
    selectedDueDayAfter,
  ]);

  useEffect(() => {
    if (selectedDueDate) {
      setSelectedDueDayBefore(undefined);
      setSelectedDueDayAfter(undefined);
    }
  }, [selectedDueDate]);

  useEffect(() => {
    if (selectedDueDayBefore) setSelectedDueDate(null);
    if (selectedDueDayAfter) setSelectedDueDate(null);
  }, [selectedDueDayBefore, selectedDueDayAfter]);

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
      {!loading ? (
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
