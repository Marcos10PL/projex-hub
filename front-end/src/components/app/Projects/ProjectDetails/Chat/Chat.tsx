import { useState } from "react";
import { useChat } from "../../../../../utils/myHooks/useChat";
import ChatButton from "./elements/ChatButton";
import Header from "./elements/Header";
import Input from "./elements/Input";
import Messages from "./elements/Messages";

export default function Chat({ projectId }: { projectId: string }) {
  const [open, setOpen] = useState(false);

  const {
    input,
    typingUsers,
    messages,
    scrollContainerRef,
    currentUser,
    handleSendMessage,
    handleTypeing,
  } = useChat(projectId);

  return (
    <>
      <ChatButton open={open} setOpen={setOpen} />
      {open && (
        <div className="fixed bottom-[5rem] md:bottom-8 right-4 md:right-8 w-[calc(100%-2rem)] md:w-3/5 lg:w-1/3 xl:w-1/4 bg-slate-900 border-2 border-slate-700 shadow-lg rounded-lg overflow-hidden z-10 flex flex-col max-h-[70vh]">
          <Header setOpen={setOpen} />
          <Messages
            messages={messages}
            scrollContainerRef={scrollContainerRef}
            typingUsers={typingUsers}
            currentUser={currentUser}
          />
          <Input
            input={input}
            handleTypeing={handleTypeing}
            handleSendMessage={handleSendMessage}
          />
        </div>
      )}
    </>
  );
}
