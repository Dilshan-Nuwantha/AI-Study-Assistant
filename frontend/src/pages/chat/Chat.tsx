import { useEffect, useState } from "react";
import {
  askAI,
  getApiErrorMessage,
  getChatHistory,
  getStoredUser,
  deleteChatHistory,
} from "../../services/api";
import "./Chat.css";

export default function Chat() {
  const [message, setMessage] = useState<string>("");
  const [response, setResponse] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [history, setHistory] = useState<
    Array<{ _id: string; request: string; response: string; createdAt: string }>
  >([]);
  const [historyQuery, setHistoryQuery] = useState("");
  const user = getStoredUser();

  useEffect(() => {
    if (!user) {
      setHistory([]);
      return;
    }

    const loadHistory = async () => {
      try {
        const res = await getChatHistory(50, historyQuery);
        setHistory(res.data.items);
      } catch (err) {
        setError(getApiErrorMessage(err));
      }
    };

    loadHistory();
  }, [user, historyQuery]);

  const handleDelete = async (id: string) => {
    try {
      await deleteChatHistory(id);
      setHistory((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      setError(getApiErrorMessage(err));
    }
  };

  const handleAsk = async () => {
    if (!user) {
      setError("Please login to continue.");
      setResponse("");
      return;
    }
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
        <div className="chat__history">
          <h3>Recent chat history</h3>
          <input
            className="input history-search"
            placeholder="Search history..."
            value={historyQuery}
            onChange={(e) => setHistoryQuery(e.target.value)}
          />
          <div className="history-list">
            {history.length ? (
              history.map((item) => (
                <div className="history-item" key={item._id}>
                  <div className="history-meta">
                    {new Date(item.createdAt).toLocaleString()}
                  </div>
                  <div className="history-request">Q: {item.request}</div>
                  <div className="history-response">A: {item.response}</div>
                  <button
                    className="history-delete"
                    type="button"
                    onClick={() => handleDelete(item._id)}
                  >
                    Delete
                  </button>
                </div>
              ))
            ) : (
              <div className="history-empty">No chat history yet.</div>
            )}
          </div>
        </div>

        <div className="chat__work">
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
            {!user
              ? "Please login to use AI chat."
              : error || response || "Your response will appear here."}
          </div>
        </div>
      </div>
    </div>
  );
}