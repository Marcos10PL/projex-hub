import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  CreateOrUpdateProjectForm,
  createOrUpdateProjectSchema,
} from "../../../utils/zodSchemas";
import { useNavigate, useParams } from "react-router-dom";
import Select from "react-select";
import {
  customStyles,
  OptionsStatusNoNull,
  optionsStatusNoNull,
  OptionStatusNoNull,
} from "../../../utils/data";
import ErrorMsg from "../../../components/ErrorMsg";
import SelectDueDate from "../../../components/app/Projects/SelectDueDay";
import Spinner from "../../../components/Spinner";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../state/store";
import { updateProject } from "../../../state/project/projectThunk";

export default function UpdateProject() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [selectedDueDate, setSelectedDueDate] = useState<Date>();
  const [status, setStatus] = useState<OptionsStatusNoNull>();
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const { loading, project, error } = useSelector(
    (state: RootState) => state.project
  );
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    setSelectedDueDate(
      project?.dueDate ? new Date(project.dueDate) : undefined
    );
    setStatus(project?.status);
  }, [project]);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createOrUpdateProjectSchema),
  });

  const onSubmit: SubmitHandler<CreateOrUpdateProjectForm> = async dataForm => {
    setMessage("");

    if (
      selectedDueDate?.toISOString() == project?.dueDate &&
      status === project?.status &&
      dataForm.name.trim() === project?.name &&
      dataForm.description.trim() === project?.description
    ) {
      setMessage("No changes made.");
      return;
    }

    const data = {
      ...dataForm,
      status,
      dueDate: selectedDueDate ? selectedDueDate?.toISOString() : null,
    };

    if (id) {
      dispatch(updateProject({ id, projectData: data }));
      setSuccess(true);
    } 
  };

  useEffect(() => {
    if (!loading && !error && success) navigate(`/projects/${id}`);
  }, [loading, error, navigate, id, success]);

  if (!project) return <p className="text-center">Project not found</p>;

  return (
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
          defaultValue={project.name}
          {...register("name")}
        />
        <ErrorMsg message={errors.name?.message} />
      </div>

      <div>
        <textarea
          className="border-2 border-gray-500 rounded-lg outline-0 focus:border-2 focus:border-primary block w-full p-2.5 bg-gray-800"
          placeholder="Project description..."
          defaultValue={project.description}
          rows={3}
          {...register("description")}
        />
        <ErrorMsg message={errors.description?.message} />
      </div>

      <button type="submit" className="button w-40 h-12">
        {loading ? <Spinner size={2} /> : "Update project"}
      </button>

      <ErrorMsg message={error || message} />
    </form>
  );
}
