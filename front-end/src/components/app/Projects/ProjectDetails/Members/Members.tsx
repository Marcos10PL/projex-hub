import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  AddMemberForm,
  addMemberSchema,
  apiResponseSchema,
  ProjectType,
} from "../../../../../utils/zodSchemas";
import Member from "./Member";
import {
  faClose,
  faPeopleGroup,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { RootState } from "../../../../../state/store";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useApi from "../../../../../utils/myHooks/useApi";
import { useParams } from "react-router-dom";
import Spinner from "../../../../Spinner";

type MemebersProps = {
  owner: ProjectType["owner"];
  members: ProjectType["members"];
};

export default function Members({ owner, members }: MemebersProps) {
  const user = useSelector((state: RootState) => state.currentUser.currentUser);
  const projectOwner = user?._id === owner._id;
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="text-emerald-200 p-4 rounded-4xl border-2 border-transparent border-l-emerald-500">
      <h1 className="pb-1 flex items-center gap-2">
        <FontAwesomeIcon icon={faPeopleGroup} />
        Memebers <span className="text-gray-400">({members.length + 1})</span>
      </h1>

      <div className="flex flex-wrap gap-x-2.5">
        {projectOwner && (
          <>
            {!isOpen && (
              <button
                type="button"
                className="flex items-center justify-center h-13 my-2 px-10 rounded-lg bg-gray-700 w-full md:w-fit border-2 border-emerald-400 hover:bg-gray-600 transition-colors cursor-pointer shadow-[0_0_2px_2px_#113233] active:bg-gray-600 py-3"
                onClick={() => setIsOpen(!isOpen)}
              >
                <FontAwesomeIcon icon={faPlus} />
              </button>
            )}
            <AddMember isOpen={isOpen} setIsOpen={setIsOpen} />
          </>
        )}
        <Member member={owner} owner={owner} isOwner />
        {members
          .map(member => (
            <Member key={member._id} member={member} owner={owner} />
          ))
          .sort((a, b) =>
            a.props.member.username.localeCompare(b.props.member.username)
          )}
      </div>
    </div>
  );
}

type AddMemberProps = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

function AddMember({ isOpen, setIsOpen }: AddMemberProps) {
  const { id } = useParams<{ id: string }>();

  const { loading, fetchData, errorMsg, setErrorMessage } = useApi(
    `projects/${id}/members`,
    apiResponseSchema,
    "post",
    {
      404: "Member not found",
      400: "Member already in project",
    }
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setFocus,
  } = useForm({
    resolver: zodResolver(addMemberSchema),
  });

  const onSubmit: SubmitHandler<AddMemberForm> = async data => {
    const res = await fetchData({ data });
    if (res?.success) location.reload();
  };

  const handleClose = () => {
    setIsOpen(false);
    setErrorMessage("");
    reset();
  };

  useEffect(() => {
    if (isOpen) setFocus("username");
  }, [isOpen, setFocus]);

  if (isOpen)
    return (
      <section className="relative w-full md:w-fit">
        <form
          className="flex items-center gap-2 my-2"
          onSubmit={handleSubmit(onSubmit)}
        >
          <input
            type="text"
            placeholder={"Username..."}
            {...register("username", {
              required: "Username is required",
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

        {(errorMsg || errors.username?.message) && (
          <>
            {/* ALERT BOX */}
            <div className="absolute -top-9 left-1/2 transform -translate-1/2 border-2 w-full text-center bg-gray-900 rounded-lg p-2 text-red-400 font-bold z-10 h-16 flex items-center justify-center gap-2">
              {errors.username?.message || errorMsg}
            </div>
            {/* ALERT ARROW */}
            <div className="absolute -top-3 left-1/2 w-3 h-3 transform -translate-x-1/2 bg-red-400 rotate-45" />
          </>
        )}
      </section>
    );
}
