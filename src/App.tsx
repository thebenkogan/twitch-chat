import { Routes, Route } from "@solidjs/router";
import { Component } from "solid-js";
import Chat from "./Chat";
import Home from "./Home";

const App: Component = () => {
  return (
    <>
      <Routes>
        <Route path="/" component={Home} />
        <Route path="/:channel" component={Chat} />
      </Routes>
    </>
  );
};

export default App;
