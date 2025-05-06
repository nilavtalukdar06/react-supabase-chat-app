import { useEffect, useState } from "react";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { ClipLoader } from "react-spinners";
import toast from "react-hot-toast";
import supabase from "./supabase/supabase";
import { Trash } from "lucide-react";

const Chat = ({ logOut, isLoading, session }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  console.log(session?.user);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data, error } = await supabase
          .from("messages")
          .select("*")
          .order("created_at", { ascending: true });
        if (error) {
          throw new Error(error.message);
        }
        setMessages(data);
      } catch (error) {
        console.log(error);
        toast.error("Error getting messages");
      }
    };
    fetchMessages();
  }, []);

  useEffect(() => {
    const channel = supabase.channel("realtime:messages");
    channel
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
        },
        (payload) => setMessages((prev) => [...prev, payload.new])
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "messages",
        },
        (payload) =>
          setMessages((prev) =>
            prev.filter((item) => item.id !== payload.old.id)
          )
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, []);

  const sendMessage = async (e) => {
    e.preventDefault();
    try {
      if (!message) {
        toast.error("Enter a message first");
        return;
      }
      const { error } = await supabase.from("messages").insert([
        {
          message: message,
          full_name: session?.user?.user_metadata?.full_name || "guest",
          avatar_url: session?.user?.user_metadata?.avatar_url || "",
        },
      ]);
      if (error) {
        throw new Error(error.message);
      }
      setMessage("");
    } catch (error) {
      console.error(error);
      toast.error("Failed to send the message");
    }
  };

  const deleteMessage = async (id) => {
    try {
      const { error } = await supabase.from("messages").delete().eq("id", id);
      if (error) throw new Error(error.message);
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete message");
    }
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
        <div className="p-6 h-[450px] overflow-y-auto space-y-4">
          {messages.map((item) => (
            <div
              className={`flex flex-col gap-6 overflow-auto ${
                item?.user_id === session?.user?.id
                  ? "items-end"
                  : "items-start"
              }`}
              key={item?.id || `${item?.user_id}-${item?.created_at}`}
            >
              <div className="flex justify-center items-center gap-x-2">
                {item?.user_id !== session?.user?.id && (
                  <div className="flex justify-center items-center">
                    <img
                      src={item?.avatar_url}
                      height={30}
                      width={30}
                      className="object-contain rounded-full"
                    />
                  </div>
                )}
                <div className="flex flex-col gap-x-1">
                  <p className="text-[10px] text-slate-400 text-end">
                    {item?.full_name}
                  </p>
                  <div className="flex gap-x-2 items-center justify-center">
                    {item?.user_id === session?.user?.id && (
                      <button
                        className="p-1 hover:bg-gray-100 transition-colors ease-in-out duration-200 rounded cursor-pointer"
                        onClick={() => deleteMessage(item.id)}
                      >
                        <Trash color="red" size={15} />
                      </button>
                    )}

                    <p className="text-sm font-medium bg-gray-200 p-2 mt-0.5 rounded">
                      {item.message}
                    </p>
                  </div>
                </div>

                {item?.user_id === session?.user?.id && (
                  <div className="flex justify-center items-center">
                    <img
                      src={item?.avatar_url}
                      height={30}
                      width={30}
                      className="object-contain rounded-full"
                    />
                  </div>
                )}
              </div>
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
