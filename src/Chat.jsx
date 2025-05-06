import { useEffect, useState, useRef } from "react";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { ClipLoader } from "react-spinners";
import supabase from "./supabase/supabase";

const Chat = ({ logOut, isLoading, session }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const channelRef = useRef(null);

  useEffect(() => {
    const room = supabase.channel("room-1", {
      config: {
        broadcast: {
          self: true,
        },
      },
    });
    channelRef.current = room;
    room
      .on("broadcast", { event: "text" }, ({ payload }) => {
        setMessages((prev) => [
          ...prev,
          {
            message: payload?.message,
            user: payload?.user,
          },
        ]);
      })
      .subscribe();
    return () => {
      room.unsubscribe();
    };
  }, []);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!channelRef.current) return;
    await channelRef.current.send({
      type: "broadcast",
      event: "text",
      payload: {
        message: message,
        user: session?.user,
      },
    });
    setMessage("");
  };

  return (
    <section className="h-full p-4 relative sm:p-10">
      <article className="max-w-2xl mx-auto my-5 border flex flex-col rounded-lg border-slate-200 shadow-sm">
        <div className="w-full flex justify-between p-4 items-center border-b">
          <div className="text-sm text-gray-500 tracking-wide">
            <p>{session?.user?.email || "Guest"}</p>
            <p className="text-red-500">2 users online</p>
          </div>
          <div>
            <Button variant={"destructive"} onClick={logOut}>
              {isLoading ? <ClipLoader size={10} color="red" /> : "Logout 😊"}
            </Button>
          </div>
        </div>
        <div className="p-4 flex flex-col gap-6 overflow-auto h-[450px]">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${
                session?.user?.id === msg.user?.id
                  ? "items-end justify-end"
                  : "items-start justify-start"
              } flex-col gap-y-1`}
            >
              <span className="text-xs text-gray-400">
                {msg.user?.email || "Guest"}
              </span>
              <span className="bg-slate-100 rounded px-2 py-1">
                {msg.message}
              </span>
            </div>
          ))}
        </div>
        <form
          className="border-t border-slate-200 p-4 w-full flex justify-center items-center gap-4"
          onSubmit={(e) => sendMessage(e)}
        >
          <Input
            placeholder="Type a message..."
            className="w-full"
            onChange={(e) => setMessage(e.target.value)}
            value={message}
            required={true}
          />
          <Button variant={"outline"} type={"submit"}>
            Send 👋
          </Button>
        </form>
      </article>
    </section>
  );
};

export default Chat;
