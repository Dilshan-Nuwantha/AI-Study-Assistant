import { useState } from "react";
import { summarizeNotes, getApiErrorMessage } from "../../services/api";
import "./Upload.css";

export default function Upload() {
  const [text, setText] = useState<string>("");
  const [result, setResult] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleSubmit = async () => {
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
          {error || result || "Your summary will appear here once generated."}
        </div>
      </div>
    </div>
  );
}