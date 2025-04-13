import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";

type PaginationProps = {
  totalPages: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
};

export default function Pagination({
  totalPages,
  currentPage,
  setCurrentPage,
}: PaginationProps) {
  return (
    <div className="flex justify-center items-center mt-5 text-xl">
      <button
        className={clsx(
          "link w-18 py-2 bg-slate-900 rounded-3xl cursor-pointer",
          currentPage === 1 && "opacity-50 pointer-events-none"
        )}
        onClick={() => setCurrentPage(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <FontAwesomeIcon icon={faChevronLeft} />
      </button>
      <span className="font-bold text-gray-300 px-3">
        {currentPage} / {totalPages}
      </span>
      <button
        className={clsx(
          "link w-18 py-2 bg-slate-900 rounded-3xl cursor-pointer",
          currentPage === totalPages && "opacity-50 pointer-events-none"
        )}
        onClick={() => setCurrentPage(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <FontAwesomeIcon icon={faChevronRight} />
      </button>
    </div>
  );
}
