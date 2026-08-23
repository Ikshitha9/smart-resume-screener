const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const resumeRoutes = require("./routes/resumeRoutes");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/resumes", resumeRoutes);

app.get("/", (req, res) => {
    res.json({
        message: "Smart Resume Screener API is running"
    });
});

const PORT = process.env.PORT || 5001;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
    console.error("MONGO_URI is missing in .env");
    process.exit(1);
}

mongoose
    .connect(MONGO_URI)
    .then(() => {
        console.log("MongoDB connected successfully");

        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error("MongoDB connection failed:");
        console.error(error.message);
        process.exit(1);
    });