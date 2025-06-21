import { faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type HeaderProps = {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Header({ setOpen }: HeaderProps) {
  return (
    <div className="bg-slate-800 flex items-center justify-between px-4 py-1.5">
      <h2 className="font-semibold">Project Chat</h2>
      <button
        onClick={() => setOpen(false)}
        className="rounded hover:text-slate-400 transition-colors cursor-pointer"
      >
        <FontAwesomeIcon icon={faX} className="text-lg" />
      </button>
    </div>
  );
}
