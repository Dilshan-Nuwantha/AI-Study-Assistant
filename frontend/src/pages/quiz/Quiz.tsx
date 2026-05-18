import { useEffect, useState } from "react";
import {
  generateQuiz,
  getApiErrorMessage,
  getStoredUser,
  getQuizHistory,
  deleteQuizHistory,
} from "../../services/api";
import "./Quiz.css";

export default function Quiz() {
  const [text, setText] = useState<string>("");
  const [quiz, setQuiz] = useState<Array<{ question: string; answer: string }>>(
    []
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [history, setHistory] = useState<
    Array<{
      _id: string;
      request: string;
      response: { questions?: Array<{ question: string; answer: string }> };
      createdAt: string;
    }>
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
        const res = await getQuizHistory(50, historyQuery);
        setHistory(res.data.items);
      } catch (err) {
        setError(getApiErrorMessage(err));
      }
    };

    loadHistory();
  }, [user, historyQuery]);

  const handleDelete = async (id: string) => {
    try {
      await deleteQuizHistory(id);
      setHistory((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      setError(getApiErrorMessage(err));
    }
  };

  const handleGenerate = async () => {
    if (!user) {
      setError("Please login to continue.");
      setQuiz([]);
      return;
    }
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
        <div className="quiz__history">
          <h3>Recent quizzes</h3>
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
                  <div className="history-response">
                    {item.response?.questions?.length ? (
                      <ul>
                        {item.response.questions.map((q, index) => (
                          <li key={`${item._id}-${index}`}>
                            {q.question} — {q.answer}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      "No quiz items saved."
                    )}
                  </div>
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
              <div className="history-empty">No quizzes yet.</div>
            )}
          </div>
        </div>

        <div className="quiz__work">
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
            {!user ? (
              "Please login to generate quizzes."
            ) : error ? (
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
    </div>
  );
}