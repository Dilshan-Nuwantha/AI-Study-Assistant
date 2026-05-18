import app from "./app.js";
import dotenv from "dotenv";

dotenv.config({ path: new URL("../.env", import.meta.url) });

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});