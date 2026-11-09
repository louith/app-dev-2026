const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const db = require("../db");

const REFRESH_DAYS = Number(process.env.REFRESH_DAYS) || 7;

const sha256 = (t) => crypto.createHash("sha256").update(t).digest("hex");

const signAccess = (user) =>
  jwt.sign({ sub: user.id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.ACCESS_TTL,
  });

async function issueRefresh(userId, res) {
  const raw = crypto.randomBytes(64).toString("hex");
  await db.execute(
    `INSERT INTO refresh_tokens (user_id, token_hash, expires_at)
     VALUES (?, ?, DATE_ADD(NOW(), INTERVAL ? DAY))`,
    [userId, sha256(raw), REFRESH_DAYS],
  );
  res.cookie("refresh_token", raw, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/auth",
    maxAge: REFRESH_DAYS * 24 * 60 * 60 * 1000,
  });
}

module.exports = { sha256, signAccess, issueRefresh };
