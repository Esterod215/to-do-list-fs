import React from "react";

function Todo(props) {
  return (
    <>
      <h2>{props.text}</h2>
      <p>
        this to do is{" "}
        {props.completed ? "Complete!!" : "Still neeeds to be done"}
      </p>
    </>
  );
}

export default Todo;
