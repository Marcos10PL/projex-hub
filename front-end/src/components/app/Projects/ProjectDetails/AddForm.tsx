import { FieldValues, Path, SubmitHandler, useForm } from "react-hook-form";
import { ProjectType } from "../../../../utils/zodSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCallback, useEffect, useState } from "react";
import Spinner from "../../../Spinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose, faPlus } from "@fortawesome/free-solid-svg-icons";
import clsx from "clsx";
import {
  useAddMemberMutation,
  useAddTaskMutation,
} from "../../../../state/projects/projectsApi";
import { RTKQueryError } from "../../../../utils/types";

type Props<T extends FieldValues> = {
  id: ProjectType["_id"];
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  schema: z.ZodType<T>;
  placeholder: string;
  fieldName: Path<T>;
  type: "member" | "task";
};

export default function AddForm<T extends FieldValues>({
  id,
  isOpen,
  setIsOpen,
  schema,
  placeholder,
  fieldName,
  type,
}: Props<T>) {
  const [errorMsg, setErrorMessage] = useState("");

  const [addMember, { isLoading: isLoadingMember }] = useAddMemberMutation();
  const [addTask, { isLoading: isLoadingTask }] = useAddTaskMutation();

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
    if (type === "member") {
      try {
        await addMember({ id, username: data.username }).unwrap();
        handleClose();
      } catch (error) {
        const err = error as RTKQueryError;
        if (err.status === 400) {
          setErrorMessage("Member already exists");
        } else if (err.status === 404) {
          setErrorMessage("Member not found");
        } else {
          setErrorMessage("Failed to add member");
        }
      }
    }

    if (type === "task") {
      try {
        await addTask({ id, name: data["name"] }).unwrap();
        handleClose();
      } catch (error) {
        console.log(error);
        setErrorMessage("Failed to add task");
      }
    }
  };

  const handleClose = useCallback(() => {
    setErrorMessage("");
    setIsOpen(false);
    reset();
  }, [setIsOpen, reset]);

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
            className={clsx(
              "border-2 border-gray-700 rounded-lg outline-0 focus:border-2 px-2 block w-full h-13 bg-gray-800",
              {
                "focus:border-emerald-400": type === "member",
                "focus:border-violet-400": type === "task",
              }
            )}
          />
          <button
            type="submit"
            className="rounded-lg h-13 w-15 flex items-center justify-center px-4 text-green-400 cursor-pointer hover:bg-gray-800 transition-colors bg-gray-700 active:bg-gray-800"
          >
            {isLoadingMember || isLoadingTask ? (
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
        type === "member" ? "border-emerald-400" : "border-violet-400"
      )}
      onClick={() => setIsOpen(!isOpen)}
    >
      <FontAwesomeIcon icon={faPlus} />
    </button>
  );
}
