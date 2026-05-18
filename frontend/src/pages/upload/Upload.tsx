import { useEffect, useState } from "react";
import {
  summarizeNotes,
  getApiErrorMessage,
  getStoredUser,
  getSummaryHistory,
  deleteSummaryHistory,
} from "../../services/api";
import "./Upload.css";

export default function Upload() {
  const [text, setText] = useState<string>("");
  const [result, setResult] = useState<string>("");
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
        const res = await getSummaryHistory(50, historyQuery);
        setHistory(res.data.items);
      } catch (err) {
        setError(getApiErrorMessage(err));
      }
    };

    loadHistory();
  }, [user, historyQuery]);

  const handleDelete = async (id: string) => {
    try {
      await deleteSummaryHistory(id);
      setHistory((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      setError(getApiErrorMessage(err));
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      setError("Please login to continue.");
      setResult("");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await summarizeNotes({ text });
      setResult(res.data.result?.summary ?? "");
    } catch (err) {
      setResult("");
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-shell upload">
      <div className="page-head">
        <h2 className="page-title">Upload Notes</h2>
        <p className="page-subtitle">Drop text and get clean summaries fast.</p>
      </div>

      <div className="upload__layout">
        <div className="upload__history">
          <h3>Recent summaries</h3>
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
                  <div className="history-request">Input: {item.request}</div>
                  <div className="history-response">Summary: {item.response}</div>
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
              <div className="history-empty">No summaries yet.</div>
            )}
          </div>
        </div>

        <div className="upload__work">
          <div className="card panel">
            <label className="field">
              <span className="field__label">Lecture notes</span>
              <textarea
                className="textarea"
                rows={10}
                placeholder="Paste notes here"
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
            </label>

            <button
              onClick={handleSubmit}
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Processing..." : "Generate Summary"}
            </button>
          </div>

          <div
            className={`upload__result ${result || error ? "upload__result--filled" : ""}`}
          >
            {!user
              ? "Please login to generate summaries."
              : error || result || "Your summary will appear here once generated."}
          </div>
        </div>
      </div>
    </div>
  );
}