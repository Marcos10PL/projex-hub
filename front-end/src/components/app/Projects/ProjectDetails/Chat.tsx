import {
  faComments,
  faPaperPlane,
  faX,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";
import { RootState } from "../../../../state/store";
import clsx from "clsx";

const socket = io("http://localhost:3000");

export default function Chat() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<
    { message: string; username: string }[]
  >([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const currentUser = useSelector(
    (state: RootState) => state.currentUser.currentUser
  );

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to chat server");
    });

    socket.on("receiveMessage", data => {
      setMessages(prevMessages => [...prevMessages, data]);
    });

    return () => {
      socket.disconnect();
      console.log("Disconnected from chat server");
      socket.off("connect");
      socket.off("receiveMessage");
    };
  }, []);

  useEffect(() => {
    requestAnimationFrame(() => {
      const container = scrollContainerRef.current;
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    });
  }, [messages]);

  // useEffect(() => {
  //   if (open) {
  //     socket.connect();
  //   } else {
  //     socket.disconnect();
  //   }
  // }, [open]);

  const handleSendMessage = () => {
    if (input.trim() === "") return;
    const message = input.trim();
    socket.emit("sendMessage", { message, username: currentUser?.username });
    setInput("");
  };

  return (
    <div>
      <button
        className="flex items-center justify-centerh-16 w-16 fixed bottom-[5rem] md:bottom-8 right-4 md:right-8 z-50 shadow bg-violet-600 border-violet-900 rounded-full p-3 border-8 cursor-pointer hover:bg-violet-900 hover:border-violet-600 transition-colors duration-200"
        onClick={() => setOpen(!open)}
      >
        <FontAwesomeIcon
          icon={faComments}
          width={30}
          height={30}
          className="text-2xl"
        />
      </button>
      {open && (
        <div className="fixed bottom-[5rem] md:bottom-8 right-4 md:right-8 w-[calc(100%-2rem)] md:w-3/5 lg:w-1/3 xl:w-1/4 bg-slate-900 border-2 border-slate-700 shadow-lg rounded-lg overflow-hidden z-50 flex flex-col max-h-[70vh]">
          <div className="bg-slate-800 flex items-center justify-between px-4 py-1.5">
            <h2 className="font-semibold">Project Chat</h2>
            <button
              onClick={() => {
                setOpen(false);
                socket.connect();
              }}
              className="rounded hover:text-slate-400 transition-colors cursor-pointer"
            >
              <FontAwesomeIcon icon={faX} className="text-lg" />
            </button>
          </div>
          <div
            className="overflow-y-auto px-2 py-2 h-96 flex flex-col items-start"
            style={{ scrollbarColor: "#4b5563 #1f2937" }}
            ref={scrollContainerRef}
          >
            {messages.length === 0 ? (
              <p className="text-center text-slate-400 pt-2 px-2">
                Brak wiadomości
              </p>
            ) : (
              messages.map(({ message, username }, index) => {
                const owner = username === currentUser?.username;
                const prevMsgOwner = messages[index - 1]?.username === username;

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
                        "bg-violet-950": owner,
                        "bg-slate-600": !owner,
                        "rounded-e-none pr-1.5 pl-2": owner,
                        "rounded-s-none pl-1.5 pr-2": !owner,
                      })}
                    >
                      {message}
                    </p>
                  </div>
                );
              })
            )}
          </div>
          <div className="flex items-center py-3">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Napisz wiadomość..."
              className="w-full border-2 rounded-lg px-2 py-1 border-slate-600 bg-slate-800 focus:outline-none focus:border-violet-500 transition-colors ml-3"
              onKeyDown={e => {
                if (e.key === "Enter") {
                  handleSendMessage();
                }
              }}
            />
            <button className="cursor-pointer focus:outline-none focus:border-violet-500 ">
              <FontAwesomeIcon
                icon={faPaperPlane}
                className="text-violet-500 hover:text-violet-300 transition-colors text-2xl px-4"
                onClick={handleSendMessage}
              />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
