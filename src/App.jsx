import { useState, useEffect } from "react";
import supabase from "./supabase/supabase";
import { Button } from "./components/ui/button";
import toast from "react-hot-toast";
import { ClipLoader } from "react-spinners";
import Chat from "./Chat";

const App = () => {
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  const logIn = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
      });
      if (error) {
        throw new Error(error.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to login");
    } finally {
      setIsLoading(false);
    }
  };

  const logOut = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw new Error(error.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to logout");
    } finally {
      setIsLoading(false);
    }
  };

  if (!session) {
    return (
      <section className="h-screen w-screen grid place-items-center p-4">
        <Button
          onClick={logIn}
          className={"px-8 py-6 min-w-[200px] shadow-sm text-slate-600 text-lg"}
          variant={"outline"}
        >
          {isLoading ? (
            <ClipLoader size={10} color="#72e3ad" />
          ) : (
            <div className="flex justify-between items-center gap-x-2">
              <img src="/google-icon.png" height={30} width={30} />
              <p>Login with Google</p>
            </div>
          )}
        </Button>
      </section>
    );
  } else {
    return <Chat logOut={logOut} isLoading={isLoading} session={session} />;
  }
};

export default App;
