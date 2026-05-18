import { useState } from "react";
import { summarizeNotes } from "../services/api";

export default function Upload() {
  const [text, setText] = useState<string>("");
  const [result, setResult] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await summarizeNotes({ text });
      setResult(res.data.summary);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Upload Notes</h2>

      <textarea
        className="w-full border p-3"
        rows={10}
        placeholder="Paste notes here"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-4 py-2 mt-4"
        disabled={loading}
      >
        {loading ? "Processing..." : "Generate Summary"}
      </button>

      <div className="mt-6 whitespace-pre-wrap">
        {result}
      </div>
    </div>
  );
}