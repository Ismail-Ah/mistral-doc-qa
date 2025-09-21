import React from "react";
import UploadFile from "./components/UploadFile";
import AskQuestion from "./components/AskQuestion";

function App() {
  return (
    <div style={{ padding: "20px" }}>
      <h1>MISTERAL</h1>
      <UploadFile />
      <hr />
      <AskQuestion />
    </div>
  );
}

export default App;
