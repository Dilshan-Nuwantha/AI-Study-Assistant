import express from "express";
import cors from "cors";
import aiRoutes from "../routes/ai.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

// routes
app.use("/", aiRoutes);

export default app;