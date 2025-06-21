import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../state/store";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

export type Message = {
  message: string;
  username: string;
};

export function useChat(projectId: string) {
  const [input, setInput] = useState("");
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null!);
  const currentUser = useSelector(
    (state: RootState) => state.currentUser.currentUser
  );

  const stopTypingTimeout = useRef<number | null>(null);
  const isTyping = useRef<boolean>(false);

  useEffect(() => {
    if (!currentUser || !projectId) return;

    socket.emit("joinRoom", {
      projectId,
    });
  }, [currentUser, projectId]);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to chat server");
    });

    socket.on("receiveMessage", data => {
      if (data.projectId === projectId) {
        setMessages(prevMessages => [...prevMessages, data]);
      }
    });

    socket.on("typing", data => {
      if (data.projectId === projectId) {
        if (data.username !== currentUser?.username) {
          setTypingUsers(prev => {
            if (!prev.includes(data.username)) {
              return [...prev, data.username];
            }
            return prev;
          });
        }
      }
    });

    socket.on("stopTyping", data => {
      if (data.username !== currentUser?.username) {
        setTypingUsers(prev =>
          prev.filter(username => username !== data.username)
        );
      }
    });

    return () => {
      socket.off("connect");
      socket.off("receiveMessage");
      socket.off("typing");
      socket.off("stopTyping");
    };
  }, [currentUser?.username, projectId]);

  useEffect(() => {
    requestAnimationFrame(() => {
      const container = scrollContainerRef.current;
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    });
  }, [messages, typingUsers]);

  const handleSendMessage = () => {
    if (input.trim() === "") return;
    const message = input.trim();
    socket.emit("sendMessage", {
      projectId,
      message,
      username: currentUser?.username,
    });
    setInput("");
    isTyping.current = false;
  };

  const handleTypeing = (value: string) => {
    setInput(value);

    if (value.trim() === "") {
      socket.emit("stopTyping", { projectId, username: currentUser?.username });
      isTyping.current = false;
      return;
    }

    if (!isTyping.current) {
      socket.emit("typing", { projectId, username: currentUser?.username });
      isTyping.current = true;
    }

    if (stopTypingTimeout.current) clearTimeout(stopTypingTimeout.current);
    stopTypingTimeout.current = setTimeout(() => {
      socket.emit("stopTyping", { projectId, username: currentUser?.username });
      isTyping.current = false;
    }, 2000);
  };

  return {
    input,
    typingUsers,
    messages,
    scrollContainerRef,
    currentUser,
    handleSendMessage,
    handleTypeing,
  };
}
