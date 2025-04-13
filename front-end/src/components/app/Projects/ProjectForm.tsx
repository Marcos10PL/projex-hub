import Select from "react-select";
import ErrorMsg from "../../ErrorMsg";
import SelectDueDate from "./SelectDueDay";
import { customStyles, optionsStatusNoNull } from "../../../utils/data";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateOrUpdateProjectForm,
  createOrUpdateProjectSchema,
  ProjectType,
} from "../../../utils/zodSchemas";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../state/store";
import {
  createProject,
  updateProject,
} from "../../../state/projects/projectThunk";
import { useNavigate } from "react-router-dom";
import Spinner from "../../Spinner";
import { clearError } from "../../../state/projects/projectsSlice";
import { OptionsStatusNoNull, OptionStatusNoNull } from "../../../utils/types";

type ProjectFormProps = {
  id?: ProjectType["_id"];
  project?: ProjectType;
  loading: boolean;
  error: string | null;
  type: "create" | "update";
};

export default function ProjectForm({
  id,
  project,
  loading,
  error,
  type,
}: ProjectFormProps) {
  const { project: newProject, projects } = useSelector(
    (state: RootState) => state.projects
  );

  const [selectedDueDate, setSelectedDueDate] = useState<Date>();
  const [status, setStatus] = useState<OptionsStatusNoNull>();
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createOrUpdateProjectSchema),
  });

  const dispatch = useDispatch<AppDispatch>();

  const onSubmit: SubmitHandler<CreateOrUpdateProjectForm> = async dataForm => {
    if (
      selectedDueDate?.toISOString() == project?.dueDate &&
      !status &&
      dataForm.name.trim() === project?.name &&
      dataForm.description.trim() === project?.description &&
      type === "update"
    ) {
      setMessage("No changes made.");
      return;
    }

    const data = {
      ...dataForm,
      status,
      dueDate: selectedDueDate ? selectedDueDate?.toISOString() : null,
    };

    if (id && type === "update") dispatch(updateProject({ id, data }));
    if (type === "create") dispatch(createProject({ data }));

    setSuccess(true);
  };

  useEffect(() => {
    dispatch(clearError());
    setMessage("");
  }, [dispatch]);

  useEffect(() => {
    if (!loading && !error && success) {
      navigate(`/projects/${id ?? newProject?._id}`);
    }
  }, [loading, error, navigate, id, success, newProject?._id, projects]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="flex md:flex-nowrap flex-wrap gap-3 w-full">
        <div className="w-full md:w-1/2">
          <Select
            options={optionsStatusNoNull}
            defaultValue={
              optionsStatusNoNull.find(
                option => option.value === project?.status
              ) || optionsStatusNoNull[0]
            }
            isSearchable={false}
            className="pb-2 md:pb-0"
            onChange={option => setStatus(option?.value)}
            styles={customStyles<OptionStatusNoNull>()}
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
          defaultValue={project?.name}
          {...register("name")}
        />
        <ErrorMsg message={errors.name?.message} />
      </div>

      <div>
        <textarea
          className="border-2 border-gray-500 rounded-lg outline-0 focus:border-2 focus:border-primary block w-full p-2.5 bg-gray-800"
          placeholder="Project description..."
          defaultValue={project?.description}
          rows={3}
          {...register("description")}
        />
        <ErrorMsg message={errors.description?.message} />
      </div>

      {type === "create" && (
        <div className="flex items-center gap-2">
          Tasks and members can be added later
        </div>
      )}

      <button type="submit" className="button w-40 h-12">
        {loading ? (
          <Spinner size={2} />
        ) : type === "create" ? (
          "Create"
        ) : (
          "Update"
        )}
      </button>

      <ErrorMsg message={error || message} />
    </form>
  );
}
