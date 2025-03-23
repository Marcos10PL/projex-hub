import { useEffect, useRef, useState } from "react";
import { Project, projectsResponseSchema } from "../../../utils/zodSchemas";
import useApi from "../../../utils/myHooks/useApi";
import Select, { StylesConfig } from "react-select";

const optionsStatus = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "planned", label: "Planned" },
  { value: "completed", label: "Completed" },
  { value: "delayed", label: "Delayed" },
] as const;

const optionsSort = [
  { value: "dueDateAsc", label: "Earliest due date" },
  { value: "dueDateDesc", label: "Latest due date" },
  { value: "latest", label: "Latest created" },
  { value: "oldest", label: "Oldest created" },
] as const;

type OptionSort = (typeof optionsSort)[number];
type OptionsSort = OptionSort["value"];

type OptionStatus = (typeof optionsStatus)[number];
type OptionsStatus = OptionStatus["value"];

type OptionType = { value: string; label: string };

const customStyles: StylesConfig<OptionType, false> = {
  control: (styles, { isFocused }) => ({
    ...styles,
    backgroundColor: "#2D3748",
    border: "none",
    outline: isFocused ? "2px solid #8500dd" : "2px solid #568",
    marginBottom: "0.1rem",
    ":hover": {
      border: "none",
      backgroundColor: "#2D3744",
    },
  }),
  dropdownIndicator: styles => ({
    ...styles,
    color: "white",
    ":hover": {
      color: "gray",
    },
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
};

export default function Projects() {
  const [selectedStatus, setSelectedStatus] = useState<OptionsStatus>("all");
  const [selectedSort, setSelectedSort] = useState<OptionsSort>("dueDateDesc");
  const [projects, setProjects] = useState<Project[]>([]);

  const { fetchData, loading, errorMsg } = useApi(
    "projects",
    projectsResponseSchema,
    "get",
    { 404: "Projects not found." }
  );

  const fetchDataRef = useRef(fetchData);

  useEffect(() => {
    const getProjects = async () => {
      let params = {};

      if (selectedStatus !== "all") params = { status: selectedStatus };

      const data = await fetchDataRef.current({ params });
      console.log(data);
      if (data) setProjects(data.projects);
    };
    getProjects();
  }, [selectedStatus]);

  return (
    <>
      <div className="flex items-center gap-4 pb-4">
        <Select
          options={optionsStatus}
          value={optionsStatus.find(option => option.value === selectedStatus)}
          className="w-1/4"
          isSearchable={false}
          styles={customStyles}
          onChange={option =>
            setSelectedStatus((option?.value as OptionsStatus) || "all")
          }
        />
        <Select
          options={optionsSort}
          value={optionsSort.find(option => option.value === selectedSort)}
          className="w-1/3"
          isSearchable={false}
          styles={customStyles}
          onChange={option =>
            setSelectedSort((option?.value as OptionsSort) || "dueDateDesc")
          }
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project: any) => (
          <div
            key={project._id}
            className="bg-gray-800 rounded-lg p-5 text-white"
          >
            <h1 className="text-2xl font-bold">{project.name}</h1>
            <p className="text-sm">{project.description}</p>
            <p className="text-sm">Status: {project.status}</p>
          </div>
        ))}
      </div>
    </>
  );
}
