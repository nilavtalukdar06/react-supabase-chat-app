import { useState } from "react";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";

const Chat = ({ logOut }) => {
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sendMessage = async (e) => {
    e.preventDefault();
  };

  return (
    <section className="h-full p-4 relative sm:p-10">
      <article className="min-h-[600px] max-w-2xl mx-auto my-5 border rounded-lg border-slate-200 shadow-sm">
        <div className="w-full flex justify-between p-4 items-center border-b">
          <div className="text-sm text-gray-500 tracking-wide">
            <p>Signed in using name...</p>
            <p className="text-red-500">3 users online</p>
          </div>
          <div>
            <Button variant={"destructive"} onClick={logOut}>
              Logout 😊
            </Button>
          </div>
        </div>
        <form
          className="mt-2 p-4 w-full flex justify-center items-center gap-4"
          onSubmit={(e) => sendMessage(e)}
        >
          <Input
            placeholder="Type a message..."
            className="w-full rounded"
            onChange={(e) => setMessage(e.target.value)}
            value={message}
            required={true}
            disabled={isSubmitting}
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
