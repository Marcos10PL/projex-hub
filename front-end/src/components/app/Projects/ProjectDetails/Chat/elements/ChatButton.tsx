import { faComments } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type ChatButtonProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function ChatButton({ open, setOpen }: ChatButtonProps) {
  return (
    <button
      className="flex items-center justify-centerh-16 w-16 fixed bottom-[5rem] md:bottom-8 right-4 md:right-8 z-10 shadow bg-violet-600 border-violet-900 rounded-full p-3 border-8 cursor-pointer hover:bg-violet-900 hover:border-violet-600 transition-colors duration-200"
      onClick={() => setOpen(!open)}
    >
      <FontAwesomeIcon
        icon={faComments}
        width={30}
        height={30}
        className="text-2xl"
      />
    </button>
  );
}
