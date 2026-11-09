require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const postRoutes = require("./routes/postRoutes.js");

const app = express();

app.use(helmet());
app.use(express.json());

app.get("/health", (req, res) => res.json({ status: "ok" }));
app.use("/api/posts", postRoutes);
module.exports = app;
