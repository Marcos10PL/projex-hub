import clsx from "clsx";
import { Message } from "../../../../../../utils/myHooks/useChat";
import Typing from "./Typing";

type MessagesProps = {
  messages: Message[];
  scrollContainerRef: React.RefObject<HTMLDivElement>;
  typingUsers: string[];
  currentUser: { username: string } | null;
};

export default function Messages({
  messages,
  scrollContainerRef,
  typingUsers,
  currentUser,
}: MessagesProps) {
  return (
    <div
      className="overflow-y-auto px-4 py-2 h-96 flex flex-col items-start"
      style={{ scrollbarColor: "#4b5563 #1f2937" }}
      ref={scrollContainerRef}
    >
      {messages.length === 0 && typingUsers.length === 0 ? (
        <p className="text-center text-slate-400 pt-2">No messages</p>
      ) : (
        messages.map(({ message, username }, index) => {
          const owner = username === currentUser?.username;
          const prevMsgOwner = messages[index - 1]?.username === username;
          const lastMessage = messages[index + 1]?.username !== username;
          const lastMessageOwner = messages[index + 1]?.username === username;

          return (
            <div
              key={index}
              className={clsx("flex flex-col max-w-4/5 break-all", {
                "self-end": owner,
                "mt-2": !prevMsgOwner,
              })}
            >
              <p
                className={clsx("text-slate-400 text-sm", {
                  "text-right": owner,
                  hidden: prevMsgOwner,
                })}
              >
                {owner ? "You" : username}
              </p>
              <p
                className={clsx("text-slate-300 rounded-xl w-fit py-1 ", {
                  "rounded-e-none pr-1.5 pl-2 bg-violet-950": owner,
                  "rounded-s-none pl-1.5 pr-2 bg-slate-600": !owner,
                  "rounded-bl-xl": lastMessage,
                  "rounded-br-xl": !lastMessageOwner,
                })}
              >
                {message}
              </p>
            </div>
          );
        })
      )}
      <Typing typingUsers={typingUsers} />
    </div>
  );
}
