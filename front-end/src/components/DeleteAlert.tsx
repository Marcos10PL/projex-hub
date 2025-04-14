import { useEffect } from "react";
import ErrorMsg from "./ErrorMsg";
import Spinner from "./Spinner";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../state/store";
import { clearError } from "../state/projects/projectsSlice";

type DeleteAlertProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  handleDelete: () => void;
  message: string;
  loading: boolean;
  error: string | null;
};

export default function DeleteAlert({
  isOpen,
  setIsOpen,
  handleDelete,
  message,
  loading,
  error,
}: DeleteAlertProps) {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  if (isOpen)
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center w-full h-full bg-black/20 backdrop-blur-sm">
        <div className="bg-gray-800 border-2 border-gray-700 p-5 rounded-lg shadow-lg flex flex-col items-center gap-3 text-text w-9/10 md:w-fit">
          <p>
            {message} <br />
            This action cannot be undone.
          </p>
          <div className="flex gap-3 *:uppercase *:font-bold *:px-3 *:py-1.5 *:transition-colors *:cursor-pointer *:active:bg-gray-700 *:rounded-lg *:hover:bg-gray-700">
            <button
              className="cursor-pointer text-red-400"
              onClick={handleDelete}
            >
              {loading ? <Spinner size={1} /> : "delete"}
            </button>
            <button className="text-text" onClick={() => setIsOpen(false)}>
              cancel
            </button>
          </div>
          <ErrorMsg message={error} />
        </div>
      </div>
    );
}
