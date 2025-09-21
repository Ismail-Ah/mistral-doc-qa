import React, { useState } from "react";
import { askQuestion } from "../api";

export default function AskQuestion() {
  const [question, setQuestion] = useState<string>("");
  const [answer, setAnswer] = useState<string>("");

  const handleAsk = async () => {
    if (!question) return;
    try {
      const res = await askQuestion(question);
      setAnswer(res);
    } catch (err) {
      console.error(err);
      setAnswer("Error fetching answer");
    }
  };

  return (
    <div>
      <h2>Ask a Question</h2>
      <input
        type="text"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />
      <button onClick={handleAsk}>Ask</button>
      <p>{answer}</p>
    </div>
  );
}
