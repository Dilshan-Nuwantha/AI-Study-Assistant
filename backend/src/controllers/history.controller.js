import Chat from "../models/chat.model.js";
import Summary from "../models/summary.model.js";
import Quiz from "../models/quiz.model.js";

const parseLimit = (value, fallback = 20) => {
    const limit = Number(value);
    if (!Number.isFinite(limit) || limit <= 0) {
        return fallback;
    }
    return Math.min(limit, 100);
};

const buildSearchFilter = (userId, query) => {
    if (!query || typeof query !== "string") {
        return { userId };
    }

    const trimmed = query.trim();
    if (!trimmed) {
        return { userId };
    }

    return {
        userId,
        $or: [
            { request: { $regex: trimmed, $options: "i" } },
            { response: { $regex: trimmed, $options: "i" } },
        ],
    };
};

export const chatHistoryController = async (req, res) => {
    try {
        const limit = parseLimit(req.query.limit);
        const filter = buildSearchFilter(req.user.id, req.query.q);
        const items = await Chat.find(filter)
            .sort({ createdAt: -1 })
            .limit(limit)
            .lean();

        res.json({ items });
    } catch (err) {
        res.status(500).json({ error: err?.message || "Unexpected error" });
    }
};

export const summaryHistoryController = async (req, res) => {
    try {
        const limit = parseLimit(req.query.limit);
        const filter = buildSearchFilter(req.user.id, req.query.q);
        const items = await Summary.find(filter)
            .sort({ createdAt: -1 })
            .limit(limit)
            .lean();

        res.json({ items });
    } catch (err) {
        res.status(500).json({ error: err?.message || "Unexpected error" });
    }
};

export const quizHistoryController = async (req, res) => {
    try {
        const limit = parseLimit(req.query.limit);
        const filter = buildSearchFilter(req.user.id, req.query.q);
        const items = await Quiz.find(filter)
            .sort({ createdAt: -1 })
            .limit(limit)
            .lean();

        res.json({ items });
    } catch (err) {
        res.status(500).json({ error: err?.message || "Unexpected error" });
    }
};

export const deleteChatHistoryController = async (req, res) => {
    try {
        const deleted = await Chat.findOneAndDelete({
            _id: req.params.id,
            userId: req.user.id,
        });

        if (!deleted) {
            return res.status(404).json({ error: "History item not found" });
        }

        res.json({ ok: true });
    } catch (err) {
        res.status(500).json({ error: err?.message || "Unexpected error" });
    }
};

export const deleteSummaryHistoryController = async (req, res) => {
    try {
        const deleted = await Summary.findOneAndDelete({
            _id: req.params.id,
            userId: req.user.id,
        });

        if (!deleted) {
            return res.status(404).json({ error: "History item not found" });
        }

        res.json({ ok: true });
    } catch (err) {
        res.status(500).json({ error: err?.message || "Unexpected error" });
    }
};

export const deleteQuizHistoryController = async (req, res) => {
    try {
        const deleted = await Quiz.findOneAndDelete({
            _id: req.params.id,
            userId: req.user.id,
        });

        if (!deleted) {
            return res.status(404).json({ error: "History item not found" });
        }

        res.json({ ok: true });
    } catch (err) {
        res.status(500).json({ error: err?.message || "Unexpected error" });
    }
};
