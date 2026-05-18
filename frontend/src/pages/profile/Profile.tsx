import { useEffect, useState } from "react";
import {
    getProfile,
    getChatHistory,
    getSummaryHistory,
    getQuizHistory,
    getStoredUser,
    getApiErrorMessage,
} from "../../services/api";
import "./Profile.css";

type ProfileStats = {
    chats: number;
    summaries: number;
    quizzes: number;
};

type ProfileData = {
    user: { id: string; username: string; email: string };
    stats: ProfileStats;
};

type ChatHistoryItem = {
    _id: string;
    request: string;
    response: string;
    createdAt: string;
};

type SummaryHistoryItem = {
    _id: string;
    request: string;
    response: string;
    createdAt: string;
};

type QuizHistoryItem = {
    _id: string;
    request: string;
    response: { questions?: Array<{ question: string; answer: string }> };
    createdAt: string;
};

export default function Profile() {
    const user = getStoredUser();
    const [profile, setProfile] = useState<ProfileData | null>(null);
    const [chatHistory, setChatHistory] = useState<ChatHistoryItem[]>([]);
    const [summaryHistory, setSummaryHistory] = useState<SummaryHistoryItem[]>([]);
    const [quizHistory, setQuizHistory] = useState<QuizHistoryItem[]>([]);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!user) {
            return;
        }

        const loadProfile = async () => {
            try {
                const [profileRes, chatRes, summaryRes, quizRes] = await Promise.all([
                    getProfile(),
                    getChatHistory(5),
                    getSummaryHistory(5),
                    getQuizHistory(5),
                ]);
                setProfile(profileRes.data);
                setChatHistory(chatRes.data.items);
                setSummaryHistory(summaryRes.data.items);
                setQuizHistory(quizRes.data.items);
            } catch (err) {
                setError(getApiErrorMessage(err));
            }
        };

        loadProfile();
    }, [user]);

    if (!user) {
        return (
            <div className="page-shell profile">
                <div className="page-head">
                    <h2 className="page-title">Profile</h2>
                    <p className="page-subtitle">Login to see your study history.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="page-shell profile">
            <div className="page-head">
                <h2 className="page-title">Profile</h2>
                <p className="page-subtitle">Track your recent activity and saved AI sessions.</p>
            </div>

            {error ? <div className="profile__error">{error}</div> : null}

            <div className="profile__card card panel">
                <div>
                    <div className="profile__label">Username</div>
                    <div className="profile__value">{profile?.user.username || user.username}</div>
                </div>
                <div>
                    <div className="profile__label">Email</div>
                    <div className="profile__value">{profile?.user.email || user.email}</div>
                </div>
            </div>

            <div className="profile__stats">
                <div className="profile__stat">
                    <span className="profile__stat-value">{profile?.stats.chats ?? 0}</span>
                    <span className="profile__stat-label">Chats asked</span>
                </div>
                <div className="profile__stat">
                    <span className="profile__stat-value">{profile?.stats.summaries ?? 0}</span>
                    <span className="profile__stat-label">Summaries generated</span>
                </div>
                <div className="profile__stat">
                    <span className="profile__stat-value">{profile?.stats.quizzes ?? 0}</span>
                    <span className="profile__stat-label">Quizzes created</span>
                </div>
            </div>

            <div className="profile__section">
                <h3>Recent chats</h3>
                <div className="history-list">
                    {chatHistory.length ? (
                        chatHistory.map((item) => (
                            <div className="history-item" key={item._id}>
                                <div className="history-meta">{new Date(item.createdAt).toLocaleString()}</div>
                                <div className="history-request">Q: {item.request}</div>
                                <div className="history-response">A: {item.response}</div>
                            </div>
                        ))
                    ) : (
                        <div className="history-empty">No chat history yet.</div>
                    )}
                </div>
            </div>

            <div className="profile__section">
                <h3>Recent summaries</h3>
                <div className="history-list">
                    {summaryHistory.length ? (
                        summaryHistory.map((item) => (
                            <div className="history-item" key={item._id}>
                                <div className="history-meta">{new Date(item.createdAt).toLocaleString()}</div>
                                <div className="history-request">Input: {item.request}</div>
                                <div className="history-response">Summary: {item.response}</div>
                            </div>
                        ))
                    ) : (
                        <div className="history-empty">No summaries yet.</div>
                    )}
                </div>
            </div>

            <div className="profile__section">
                <h3>Recent quizzes</h3>
                <div className="history-list">
                    {quizHistory.length ? (
                        quizHistory.map((item) => (
                            <div className="history-item" key={item._id}>
                                <div className="history-meta">{new Date(item.createdAt).toLocaleString()}</div>
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
                            </div>
                        ))
                    ) : (
                        <div className="history-empty">No quizzes yet.</div>
                    )}
                </div>
            </div>
        </div>
    );
}
