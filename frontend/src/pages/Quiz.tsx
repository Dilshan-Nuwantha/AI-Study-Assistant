import { useState } from "react";
import { generateQuiz } from "../services/api";

export default function Quiz() {
  const [text, setText] = useState<string>("");
  const [quiz, setQuiz] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await generateQuiz({ text });
      setQuiz(res.data.quiz);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Quiz Generator</h2>

      <textarea
        className="w-full border p-3"
        rows={10}
        placeholder="Paste notes"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <button
        onClick={handleGenerate}
        className="bg-purple-600 text-white px-4 py-2 mt-4"
        disabled={loading}
      >
        {loading ? "Generating..." : "Generate Quiz"}
      </button>

      <div className="mt-6 whitespace-pre-wrap">
        {quiz}
      </div>
    </div>
  );
}