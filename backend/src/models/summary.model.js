import mongoose from "mongoose";

const summarySchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        username: { type: String, required: true },
        request: { type: String, required: true },
        response: { type: mongoose.Schema.Types.Mixed, required: true },
    },
    { timestamps: { createdAt: true, updatedAt: false } }
);

export default mongoose.model("Summary", summarySchema);
