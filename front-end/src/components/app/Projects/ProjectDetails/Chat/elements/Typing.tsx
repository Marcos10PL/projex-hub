export default function Typing({ typingUsers }: { typingUsers: string[] }) {
  if (typingUsers.length === 0) return null;

  return (
    <div className="mt-2">
      <p className="text-slate-400 text-sm mb-1">
        {typingUsers.slice(0, 2).join(", ")}
        {typingUsers.length > 2 &&
          ` and ${typingUsers.length - 2} other${typingUsers.length - 2 > 1 ? "s" : ""}`}
        {typingUsers.length === 1 ? " is typing..." : " are typing..."}
      </p>

      <div className="flex items-center px-1.5 py-3 gap-2 rounded-full rounded-tl-none bg-slate-600 w-fit">
        <div
          className="w-1.5 h-1.5 animate-bounce bg-slate-300 rounded-full"
          style={{ animationDelay: "0s" }}
        />
        <div
          className="w-1.5 h-1.5 animate-bounce bg-slate-300 rounded-full"
          style={{ animationDelay: "0.2s" }}
        />
        <div
          className="w-1.5 h-1.5 animate-bounce bg-slate-300 rounded-full"
          style={{ animationDelay: "0.4s" }}
        />
      </div>
    </div>
  );
}
