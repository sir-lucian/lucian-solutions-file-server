import express from "express";
import path from "path";
import fs from "fs";

// Allowed origins
const allowedOrigins = [
    "http://localhost",
    "http://127.0.0.1",
    "https://lucian.solutions",
];

const app = express();
const FILES_DIR = path.join(__dirname, "../files");

// Restrict requests by Origin header
app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (!origin || allowedOrigins.some((o) => origin.startsWith(o))) {
        return next();
    }
    return res.status(403).json({ error: "Origin not allowed" });
});

// List files in root
app.get("/", (_req, res) => {
    fs.readdir(FILES_DIR, (err, files) => {
        if (err) return res.status(500).json({ error: "Unable to list files" });
        res.json({ files });
    });
});


// Serve files under /files/* using static middleware
app.use("/files", express.static(FILES_DIR));

// No POST, PUT, DELETE allowed
app.all("*", (req, res, next) => {
    if (["POST", "PUT", "DELETE"].includes(req.method)) {
        return res.status(405).json({ error: "Method not allowed" });
    }
    next();
});

const PORT = process.env.PORT || 80;
app.listen(PORT, () => {
    console.log(`Read-only file server running on port ${PORT}`);
});
