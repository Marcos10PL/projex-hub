import { NavLink, useParams } from "react-router-dom";
import {
  CreateOrUpdateProjectForm,
  createOrUpdateProjectSchema,
  projectResponseSchema,
  ProjectType,
} from "../../../utils/zodSchemas";
import useApi from "../../../utils/myHooks/useApi";
import { useEffect, useRef, useState } from "react";
import Spinner from "../../Spinner";
import {
  OptionsStatusNoNull,
  optionsStatusNoNull,
  OptionStatusNoNull,
  statusColor,
} from "../../../utils/data";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ErrorMsg from "../../auth/ErrorMsg";
import Select, { StylesConfig } from "react-select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faCheck,
  faEdit,
  faRotateRight,
  faTrash,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import clsx from "clsx";
import { differenceInCalendarDays } from "date-fns";
import SelectDueDate from "../../app/Projects/SelectDueDay";

const customStyles: StylesConfig<OptionStatusNoNull, false> = {
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
};

export default function ProjectDetails() {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<ProjectType>();
  const [status, setStatus] = useState<OptionsStatusNoNull>();
  const [wantToUpdate, setWantToUpdate] = useState(false);
  const [wantToDelete, setWantToDelete] = useState(false);

  const [selectedDueDate, setSelectedDueDate] = useState<Date>();

  const { loading: loadingProject, fetchData: fetchProject } = useApi(
    "projects/" + id,
    projectResponseSchema,
    "get"
  );
  const { loading: loadingUpdatedProject, fetchUpdatedProject } = useApi(
    "projects/" + id,
    projectResponseSchema,
    "patch"
  );

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(createOrUpdateProjectSchema),
  });

  const onSubmit: SubmitHandler<CreateOrUpdateProjectForm> = async data => {
    console.log("XD");
    const res = await fetchUpdatedProject({ data });
    if (res) setProject(res.project);
    reset({
      name: res.project.name,
      description: res.project.description,
    });
  };

  const fetchProjectRef = useRef(fetchProject);

  useEffect(() => {
    const getProject = async () => {
      const res = await fetchProjectRef.current();
      if (res) {
        setProject(res.project);
        reset({
          name: res.project.name,
          description: res.project.description,
        });
      }
    };
    getProject();
  }, [id, reset]);

  if (loadingProject || loadingUpdatedProject) return <Spinner size={2} />;

  if (!project) return <p>Project not found</p>;

  if (wantToUpdate)
    return (
      <section className="space-y-5 text-lg md:text-xl">
        <button
          className="link cursor-pointer uppercase flex items-center gap-2"
          onClick={() => setWantToUpdate(false)}
        >
          <FontAwesomeIcon icon={faArrowLeft} />
          <span>Cancel</span>
        </button>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="flex md:flex-nowrap flex-wrap gap-3 w-full">
            <div className="w-full md:w-1/2">
              <Select
                options={optionsStatusNoNull}
                defaultValue={optionsStatusNoNull.find(
                  option => option.value === project.status
                )}
                isSearchable={false}
                className="pb-2 md:pb-0"
                onChange={option => setStatus(option?.value)}
                styles={customStyles}
              />
            </div>
            <div className="w-full md:w-1/2">
              <SelectDueDate
                selectedDueDay={selectedDueDate}
                setSelectedDueDay={setSelectedDueDate}
                title="Due date"
              />
            </div>
          </div>
          <div>
            <input
              className="border-2 border-gray-500 rounded-lg outline-0 focus:border-2 focus:border-primary block w-full p-2.5 bg-gray-800"
              placeholder="Project name..."
              {...register("name")}
            />
            <ErrorMsg message={errors.name?.message} />
          </div>

          <div>
            <textarea
              className="border-2 border-gray-500 rounded-lg outline-0 focus:border-2 focus:border-primary block w-full p-2.5 bg-gray-800"
              placeholder="Project description..."
              {...register("description")}
            />
            <ErrorMsg message={errors.description?.message} />
          </div>

          <button type="submit" className="button">
            Update project
          </button>
        </form>
      </section>
    );

  if (wantToDelete)
    return (
      <section className="space-y-5  text-lg md:text-xl">
        <button
          className="link cursor-pointer uppercase flex items-center gap-2"
          onClick={() => setWantToDelete(false)}
        >
          <FontAwesomeIcon icon={faArrowLeft} />
          <span>Cancel</span>
        </button>
        <div className="text-red-400 text-lg">
          Are you sure you want to delete this project?
        </div>
        <button type="button" className="button bg-red-500">
          Delete project
        </button>
      </section>
    );

  return (
    <section className="space-y-5 text-lg md:text-xl">
      <NavLink
        to={"/projects"}
        className="link cursor-pointer uppercase flex items-center gap-2"
      >
        <FontAwesomeIcon icon={faArrowLeft} />
        <span>Back</span>
      </NavLink>

      <div className="flex items-center justify-between text-lg bg-slate-900 px-4 py-2 rounded-lg">
        <div className="flex items-center gap-2">
          <div
            className={`${statusColor[project.status]} w-4 h-4 rounded-full`}
          />
          <span className="uppercase">{project.status}</span>
        </div>
        <div className="flex gap-5">
          <button
            className="flex items-center gap-2 text-primary cursor-pointer hover:text-violet-300 transition-colors"
            onClick={() => setWantToUpdate(true)}
          >
            <span>Edit</span>
            <FontAwesomeIcon icon={faEdit} />
          </button>
          <button
            className="flex items-center gap-2 text-red-400 cursor-pointer hover:text-red-300 transition-colors"
            onClick={() => setWantToDelete(true)}
          >
            <span>Delete</span>
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </div>
      </div>

      <div className="space-y-4 bg-slate-900 p-4 rounded-lg border-2 border-slate-700">
        <div className="flex items-center gap-2 text-gray-500">
          Created at {new Date(project.createdAt).toLocaleDateString()}
          {project.createdAt !== project.updatedAt &&
            ` (updated  ${Math.abs(
              differenceInCalendarDays(new Date(project.updatedAt), new Date())
            )} days ago)`}
        </div>
        <div className="text-3xl">{project.name}</div>
        <div className="font-bold">
          {project.dueDate ? (
            <p>
              <span>
                Due date: {new Date(project.dueDate).toLocaleDateString()}
              </span>
              <br className="block md:hidden" />
              {new Date(project.dueDate) < new Date() && (
                <span className="font-normal text-red-500">
                  {` (${Math.abs(
                    differenceInCalendarDays(
                      new Date(project.dueDate),
                      new Date()
                    )
                  )} days overdue)`}
                </span>
              )}
            </p>
          ) : (
            <p>No due date</p>
          )}
        </div>

        <div className="cursor-default resize-none w-full">
          {project.description}
        </div>
      </div>

      <div className="text-emerald-200 bg-slate-900 p-4 rounded-lg border-2 border-slate-700">
        <h1 className="pb-1">
          Memebers:{" "}
          <span className="text-gray-400">({project.members.length + 1})</span>
        </h1>
        <div className="flex items-center gap-2 my-2">
          <FontAwesomeIcon icon={faUser} />
          {project.owner.username} (owner)
        </div>
        {project.members.map(member => (
          <div key={member._id} className="flex items-center gap-2 my-2">
            <FontAwesomeIcon icon={faUser} />
            <span>{member.username}</span>
          </div>
        ))}
      </div>

      <div className="text-violet-300 bg-slate-900 p-4 rounded-lg border-2 border-slate-700">
        {project.tasks.length === 0 ? (
          <p>No tasks</p>
        ) : (
          <>
            <h1 className="pb-1">
              Tasks:
              <span className="text-gray-400">
                {" "}
                ({project.tasks.filter(task => task.status === "done").length}/
                {project.tasks.length})
              </span>
            </h1>
            <div className="flex items-center flex-wrap gap-2">
              {project.tasks.map(task => (
                <div
                  key={task._id}
                  className={clsx(
                    "flex items-center gap-4 px-3 py-2 rounded-lg bg-gray-800 w-full md:w-fit justify-between my-2 shadow-[0_0_5px_3px_#111222]",
                    task.status === "done" && "opacity-70",
                    task.status === "in-progress" && "bg-gray-600"
                  )}
                >
                  <span
                    className={clsx(task.status === "done" && "line-through")}
                  >
                    {task.name}
                  </span>
                  {task.dueDate && (
                    <span>({new Date(task.dueDate).toLocaleDateString()})</span>
                  )}
                  <div className="flex gap-2 *:px-2 *:py-1 ml-5 *:bg-gray-900 *:rounded-lg *:hover:bg-gray-700 *:transition-colors *:cursor-pointer">
                    <button className="text-green-300">
                      {task.status === "done" ? (
                        <FontAwesomeIcon
                          icon={faRotateRight}
                          className="text-xl"
                        />
                      ) : (
                        <FontAwesomeIcon icon={faCheck} className="text-xl" />
                      )}
                    </button>
                    <button className="text-red-300">
                      <FontAwesomeIcon icon={faTrash} className="text-xl" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
