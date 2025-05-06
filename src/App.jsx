import React from "react";
import { Button } from "./components/ui/button";

const App = () => {
  return (
    <div>
      <h1 class="text-3xl font-bold underline">Hello world!</h1>
      <div className="p-4">
        <Button variant={"destructive"}>Click Me ☠️</Button>
      </div>
    </div>
  );
};

export default App;
