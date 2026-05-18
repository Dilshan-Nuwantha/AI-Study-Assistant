import { useState } from "react";
import { askAI, getApiErrorMessage } from "../../services/api";
import "./Chat.css";

export default function Chat() {
  const [message, setMessage] = useState<string>("");
  const [response, setResponse] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleAsk = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await askAI({ message });
      setResponse(res.data.result);
    } catch (err) {
      setResponse("");
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-shell chat">
      <div className="page-head">
        <h2 className="page-title">AI Chat</h2>
        <p className="page-subtitle">Ask a question and get instant guidance.</p>
      </div>

      <div className="chat__layout">
        <div className="card panel">
          <label className="field">
            <span className="field__label">Your question</span>
            <input
              className="input"
              placeholder="Ask something..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </label>

          <button
            onClick={handleAsk}
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? "Thinking..." : "Ask AI"}
          </button>
        </div>

        <div
          className={`chat__response ${response || error ? "chat__response--filled" : ""}`}
        >
          {error || response || "Your response will appear here."}
        </div>
      </div>
    </div>
  );
}