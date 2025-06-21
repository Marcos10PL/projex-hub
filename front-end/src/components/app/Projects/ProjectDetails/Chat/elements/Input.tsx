import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type InputProps = {
  input: string;
  handleTypeing: (value: string) => void;
  handleSendMessage: () => void;
};

export default function Input({
  input,
  handleTypeing,
  handleSendMessage,
}: InputProps) {
  return (
    <div className="flex items-center py-3">
      <input
        value={input}
        onChange={e => handleTypeing(e.target.value)}
        placeholder="Type your message..."
        className="w-full border-2 rounded-lg px-2 py-1 border-slate-600 bg-slate-800 focus:outline-none focus:border-violet-500 transition-colors ml-3"
        onKeyDown={e => {
          if (e.key === "Enter") {
            handleSendMessage();
          }
        }}
      />
      <button className="cursor-pointer">
        <FontAwesomeIcon
          icon={faPaperPlane}
          className="text-violet-500 hover:text-violet-300 transition-colors text-2xl px-4"
          onClick={handleSendMessage}
        />
      </button>
    </div>
  );
}
