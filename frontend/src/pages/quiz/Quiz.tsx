import { useState } from "react";
import { generateQuiz } from "../../services/api";
import "./Quiz.css";

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
    <div className="page-shell quiz">
      <div className="page-head">
        <h2 className="page-title">Quiz Generator</h2>
        <p className="page-subtitle">Paste notes and receive a quick quiz draft.</p>
      </div>

      <div className="quiz__layout">
        <div className="card panel">
          <label className="field">
            <span className="field__label">Source notes</span>
            <textarea
              className="textarea"
              rows={10}
              placeholder="Paste notes"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </label>

          <button
            onClick={handleGenerate}
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? "Generating..." : "Generate Quiz"}
          </button>
        </div>

        <div className={`quiz__result ${quiz ? "quiz__result--filled" : ""}`}>
          {quiz || "Your generated quiz will show up here."}
        </div>
      </div>
    </div>
  );
}