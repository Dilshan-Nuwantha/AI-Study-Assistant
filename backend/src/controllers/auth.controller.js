import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import Chat from "../models/chat.model.js";
import Summary from "../models/summary.model.js";
import Quiz from "../models/quiz.model.js";

const signToken = (user) => {
    const expiresIn = process.env.JWT_EXPIRES || "30m";
    return jwt.sign(
        { username: user.username, email: user.email },
        process.env.JWT_SECRET,
        { subject: user._id.toString(), expiresIn }
    );
};

export const registerController = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ error: "username, email, password are required" });
        }

        const existing = await User.findOne({
            $or: [{ username }, { email: email.toLowerCase() }],
        });
        if (existing) {
            return res.status(409).json({ error: "User already exists" });
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const user = await User.create({ username, email, passwordHash });
        const token = signToken(user);

        res.json({
            token,
            user: { id: user._id, username: user.username, email: user.email },
        });
    } catch (err) {
        res.status(500).json({ error: err?.message || "Unexpected error" });
    }
};

export const loginController = async (req, res) => {
    try {
        const { identifier, password } = req.body;
        if (!identifier || !password) {
            return res.status(400).json({ error: "identifier and password are required" });
        }

        const user = await User.findOne({
            $or: [{ username: identifier }, { email: identifier.toLowerCase() }],
        });
        if (!user) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const token = signToken(user);
        res.json({
            token,
            user: { id: user._id, username: user.username, email: user.email },
        });
    } catch (err) {
        res.status(500).json({ error: err?.message || "Unexpected error" });
    }
};

export const logoutController = async (_req, res) => {
    res.json({ ok: true });
};

export const meController = async (req, res) => {
    try {
        const userId = req.user?.id;
        const user = await User.findById(userId).lean();
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const [chats, summaries, quizzes] = await Promise.all([
            Chat.countDocuments({ userId }),
            Summary.countDocuments({ userId }),
            Quiz.countDocuments({ userId }),
        ]);

        res.json({
            user: { id: user._id, username: user.username, email: user.email },
            stats: { chats, summaries, quizzes },
        });
    } catch (err) {
        res.status(500).json({ error: err?.message || "Unexpected error" });
    }
};
