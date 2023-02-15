import { useNavigate } from "@solidjs/router";
import { Component, createSignal } from "solid-js";

const Home: Component = () => {
  const navigate = useNavigate();
  const [search, setSearch] = createSignal("");

  return (
    <div class="h-screen flex flex-col justify-center items-center text-center">
      <h1 class="text-3xl sm:text-5xl lg:text-7xl font-bold my-10">
        Welcome to SolidJS Chat!
      </h1>
      <form
        class="w-full"
        onSubmit={(e) => {
          e.preventDefault();
          navigate(`/${search()}`);
        }}
      >
        <input
          type="search"
          class="rounded-xl text-xl p-2 h-10 w-2/3 sm:w-1/2"
          onChange={(e) => setSearch(e.currentTarget.value)}
        />
      </form>
    </div>
  );
};

export default Home;
