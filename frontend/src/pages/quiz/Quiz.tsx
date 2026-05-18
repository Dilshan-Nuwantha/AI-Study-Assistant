import { useState } from "react";
import { generateQuiz, getApiErrorMessage } from "../../services/api";
import "./Quiz.css";

export default function Quiz() {
  const [text, setText] = useState<string>("");
  const [quiz, setQuiz] = useState<Array<{ question: string; answer: string }>>(
    []
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleGenerate = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await generateQuiz({ text });
      setQuiz(Array.isArray(res.data.questions) ? res.data.questions : []);
    } catch (err) {
      setQuiz([]);
      setError(getApiErrorMessage(err));
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

        <div
          className={`quiz__result ${quiz.length || error ? "quiz__result--filled" : ""}`}
        >
          {error ? (
            error
          ) : quiz.length ? (
            <div className="quiz__list">
              {quiz.map((item, index) => (
                <div className="quiz__item" key={`${index}-${item.question}`}>
                  <div className="quiz__question">{item.question}</div>
                  <div className="quiz__answer">{item.answer}</div>
                </div>
              ))}
            </div>
          ) : (
            "Your generated quiz will show up here."
          )}
        </div>
      </div>
    </div>
  );
}