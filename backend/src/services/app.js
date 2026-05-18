import express from "express";
import cors from "cors";
import aiRoutes from "../routes/ai.routes.js";
import authRoutes from "../routes/auth.routes.js";
import historyRoutes from "../routes/history.routes.js";
import publicRoutes from "../routes/public.routes.js";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "../config/swagger.js";

const app = express();

app.use(cors());
app.use(express.json());

// routes
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/auth", authRoutes);
app.use("/history", historyRoutes);
app.use("/public", publicRoutes);
app.use("/", aiRoutes);

export default app;