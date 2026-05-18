import Chat from "../models/chat.model.js";
import Summary from "../models/summary.model.js";
import Quiz from "../models/quiz.model.js";
import User from "../models/user.model.js";

const parseLimit = (value, fallback = 8) => {
    const limit = Number(value);
    if (!Number.isFinite(limit) || limit <= 0) {
        return fallback;
    }
    return Math.min(limit, 50);
};

const toPreview = (value) => {
    if (typeof value === "string") {
        return value;
    }
    try {
        return JSON.stringify(value);
    } catch (err) {
        return String(value);
    }
};

const attachType = (items, type) => {
    return items.map((item) => ({
        id: item._id,
        type,
        username: item.username || "Unknown",
        request: item.request,
        responsePreview: toPreview(item.response),
        createdAt: item.createdAt,
    }));
};

export const globalStatsController = async (_req, res) => {
    try {
        const [users, chats, summaries, quizzes] = await Promise.all([
            User.countDocuments({}),
            Chat.countDocuments({}),
            Summary.countDocuments({}),
            Quiz.countDocuments({}),
        ]);

        res.json({ stats: { users, chats, summaries, quizzes } });
    } catch (err) {
        res.status(500).json({ error: err?.message || "Unexpected error" });
    }
};

export const recentActivityController = async (req, res) => {
    try {
        const limit = parseLimit(req.query.limit);
        const [chats, summaries, quizzes] = await Promise.all([
            Chat.find({}).sort({ createdAt: -1 }).limit(limit).lean(),
            Summary.find({}).sort({ createdAt: -1 }).limit(limit).lean(),
            Quiz.find({}).sort({ createdAt: -1 }).limit(limit).lean(),
        ]);

        const combined = [
            ...attachType(chats, "chat"),
            ...attachType(summaries, "summary"),
            ...attachType(quizzes, "quiz"),
        ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        res.json({ items: combined.slice(0, limit) });
    } catch (err) {
        res.status(500).json({ error: err?.message || "Unexpected error" });
    }
};
