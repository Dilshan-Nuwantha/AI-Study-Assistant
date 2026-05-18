import { useState } from "react";
import { askAI } from "../services/api";

export default function Chat() {
  const [message, setMessage] = useState<string>("");
  const [response, setResponse] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleAsk = async () => {
    setLoading(true);
    try {
      const res = await askAI({ message });
      setResponse(res.data.reply);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">AI Chat</h2>

      <input
        className="border p-2 w-full"
        placeholder="Ask something..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      <button
        onClick={handleAsk}
        className="bg-green-600 text-white px-4 py-2 mt-4"
        disabled={loading}
      >
        {loading ? "Thinking..." : "Ask AI"}
      </button>

      <div className="mt-6 whitespace-pre-wrap">
        {response}
      </div>
    </div>
  );
}