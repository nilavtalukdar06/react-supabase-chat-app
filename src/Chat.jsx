import { useState } from "react";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { ClipLoader } from "react-spinners";

const Chat = ({ logOut, isLoading, session }) => {
  const [message, setMessage] = useState("");
  const [userOnline, setUserOnline] = useState(0);

  return (
    <section className="h-full p-4 relative sm:p-10">
      <article className="min-h-[600px] max-w-2xl mx-auto my-5 border flex flex-col justify-between rounded-lg border-slate-200 shadow-sm">
        <div className="w-full flex justify-between p-4 items-center border-b">
          <div className="text-sm text-gray-500 tracking-wide">
            <p>{session?.user?.email || "Guest"}</p>
            <p className="text-red-500">{userOnline} users online</p>
          </div>
          <div>
            <Button variant={"destructive"} onClick={logOut}>
              {isLoading ? <ClipLoader size={10} color="red" /> : "Logout 😊"}
            </Button>
          </div>
        </div>
        <div></div>
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
