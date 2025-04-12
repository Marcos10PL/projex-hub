import { FieldValues, Path, SubmitHandler, useForm } from "react-hook-form";
import { ProjectType } from "../../../../utils/zodSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCallback, useEffect, useState } from "react";
import Spinner from "../../../Spinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose, faPlus } from "@fortawesome/free-solid-svg-icons";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../../state/store";
import {
  addMember,
  AddMemberArgs,
} from "../../../../state/projects/membersThunk";
import { addTask, AddTaskArgs } from "../../../../state/projects/tasksThunk";
import clsx from "clsx";
import { clearError } from "../../../../state/projects/projectsSlice";

type AsyncThunk = typeof addMember | typeof addTask;

type Props<T extends FieldValues, A extends AsyncThunk> = {
  id: ProjectType["_id"];
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  schema: z.ZodType<T>;
  placeholder: string;
  fieldName: Path<T>;
  loading: boolean;
  error: string | null;
  asyncThunk: A;
};

export default function AddForm<T extends FieldValues, A extends AsyncThunk>({
  id,
  isOpen,
  setIsOpen,
  schema,
  placeholder,
  fieldName,
  loading,
  error,
  asyncThunk,
}: Props<T, A>) {
  const [errorMsg, setErrorMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setFocus,
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<T> = async data => {
    const args = { id, [fieldName]: data[fieldName] };

    if (asyncThunk === addMember) {
      const memberArgs = args as AddMemberArgs;
      dispatch(asyncThunk(memberArgs));
    }

    if (asyncThunk === addTask) {
      const taskArgs = args as AddTaskArgs;
      dispatch(asyncThunk(taskArgs));
    }
    setSuccess(true);
  };

  const handleClose = useCallback(() => {
    dispatch(clearError());
    setErrorMessage("");
    setIsOpen(false);
    setSuccess(false);
    reset();
  }, [setIsOpen, reset, dispatch]);

  useEffect(() => {
    if (!loading && !error && success) handleClose();
    if (error && success) setErrorMessage(error);
  }, [loading, error, success, handleClose]);

  useEffect(() => {
    if (isOpen) setFocus(fieldName);
  }, [isOpen, setFocus, fieldName]);

  // FORM
  if (isOpen)
    return (
      <section className="relative w-full md:w-fit">
        <form
          className="flex items-center gap-2 my-2"
          onSubmit={handleSubmit(onSubmit)}
        >
          <input
            type="text"
            placeholder={placeholder}
            {...register(fieldName, {
              onChange: () => setErrorMessage(""),
            })}
            className="border-2 border-gray-700 rounded-lg outline-0 focus:border-2 focus:border-primary px-2 block w-full h-13 bg-gray-800"
          />
          <button
            type="submit"
            className="rounded-lg h-13 w-15 flex items-center justify-center px-4 text-green-400 cursor-pointer hover:bg-gray-800 transition-colors bg-gray-700 active:bg-gray-800"
          >
            {loading ? (
              <Spinner size={1} />
            ) : (
              <FontAwesomeIcon icon={faPlus} className="text-xl" />
            )}
          </button>
          <button
            type="button"
            className="rounded-lg h-13 w-15 flex items-center justify-center px-4 text-red-400 cursor-pointer hover:bg-gray-800 transition-colors bg-gray-700 active:bg-gray-800"
            onClick={handleClose}
          >
            <FontAwesomeIcon icon={faClose} className="text-xl" />
          </button>
        </form>

        {(errorMsg || errors[fieldName]?.message) && (
          <>
            {/* ALERT BOX */}
            <div className="absolute -top-9 left-1/2 transform -translate-1/2 border-2 w-full text-center bg-gray-900 rounded-lg p-2 text-red-400 font-bold z-10 h-16 flex items-center justify-center gap-2">
              {(errors[fieldName]?.message as string) || errorMsg}
            </div>

            {/* ALERT ARROW */}
            <div className="absolute -top-3 left-1/2 w-3 h-3 transform -translate-x-1/2 bg-red-400 rotate-45" />
          </>
        )}
      </section>
    );

  // BUTTON
  return (
    <button
      type="button"
      className={clsx(
        "flex items-center justify-center h-13 my-2 px-10 rounded-lg bg-gray-700 w-full md:w-fit border-2 hover:bg-gray-600 transition-colors cursor-pointer shadow-[0_0_2px_2px_#113233] active:bg-gray-600 py-3",
        asyncThunk === addMember ? "border-emerald-400" : "border-violet-400"
      )}
      onClick={() => setIsOpen(!isOpen)}
    >
      <FontAwesomeIcon icon={faPlus} />
    </button>
  );
}
