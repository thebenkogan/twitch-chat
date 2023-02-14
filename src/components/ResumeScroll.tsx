import { Component } from "solid-js";

interface ResumeScrollProps {
  onClick: () => void;
}

const ResumeScroll: Component<ResumeScrollProps> = (props) => {
  return (
    <button
      onClick={props.onClick}
      class="p-3 fixed bottom-0 left-1/2 -translate-x-1/2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mb-5 rounded"
    >
      Resume Scrolling
    </button>
  );
};

export default ResumeScroll;
