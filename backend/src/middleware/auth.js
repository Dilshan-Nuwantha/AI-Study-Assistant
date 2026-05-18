import jwt from "jsonwebtoken";

const getToken = (req) => {
    const header = req.headers.authorization || "";
    if (header.startsWith("Bearer ")) {
        return header.slice(7).trim();
    }
    return null;
};

const authMiddleware = (req, res, next) => {
    const token = getToken(req);
    if (!token) {
        return res.status(401).json({ error: "Missing auth token" });
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.user = {
            id: payload.sub,
            username: payload.username,
            email: payload.email,
        };
        return next();
    } catch (err) {
        return res.status(401).json({ error: "Invalid or expired token" });
    }
};

export default authMiddleware;
