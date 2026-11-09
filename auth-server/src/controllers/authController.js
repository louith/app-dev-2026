const bcrypt = require("bcrypt");
const db = require("../db");
const { sha256, signAccess, issueRefresh } = require("../utils/tokens");

exports.register = async (req, res) => {
  const { email, username, password } = req.body;
  if (!email || !username || !password || password.length < 8) {
    return res.status(400).json({ error: "Invalid input" });
  }
  try {
    const [roles] = await db.execute(
      `SELECT id FROM roles WHERE role = 'reader'`,
    );
    const hash = await bcrypt.hash(password, 12);
    await db.execute(
      `INSERT INTO users (email, username, password_hash, role_id) VALUES (?, ?, ?, ?)`,
      [email, username, hash, roles[0].id],
    );
    res.status(201).json({ message: "Registered" });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ error: "Email or username already taken" });
    }
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const [rows] = await db.execute(
      `SELECT u.id, u.password_hash, u.is_active, r.role AS role
       FROM users u JOIN roles r ON r.id = u.role_id
       WHERE u.email = ?`,
      [email],
    );
    const user = rows[0];
    const ok = user && (await bcrypt.compare(password, user.password_hash));
    if (!ok || !user.is_active) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    await issueRefresh(user.id, res);
    res.json({ accessToken: signAccess(user) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.refresh = async (req, res) => {
  const raw = req.cookies.refresh_token;
  if (!raw) return res.status(401).json({ error: "No token" });

  try {
    const [rows] = await db.execute(
      `SELECT rt.id, rt.user_id, rt.expires_at, rt.revoked_at, u.is_active, r.role AS role
       FROM refresh_tokens rt
       JOIN users u ON u.id = rt.user_id
       JOIN roles r ON r.id = u.role_id
       WHERE rt.token_hash = ?`,
      [sha256(raw)],
    );
    const t = rows[0];
    if (!t) return res.status(401).json({ error: "Invalid token" });

    // Reused a revoked token: assume theft, kill all sessions for this user
    if (t.revoked_at) {
      await db.execute(
        `UPDATE refresh_tokens SET revoked_at = NOW()
         WHERE user_id = ? AND revoked_at IS NULL`,
        [t.user_id],
      );
      return res.status(401).json({ error: "Invalid token" });
    }

    if (new Date(t.expires_at) < new Date() || !t.is_active) {
      return res.status(401).json({ error: "Invalid token" });
    }

    await db.execute(
      `UPDATE refresh_tokens SET revoked_at = NOW() WHERE id = ?`,
      [t.id],
    );
    await issueRefresh(t.user_id, res);
    res.json({ accessToken: signAccess({ id: t.user_id, role: t.role }) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.logout = async (req, res) => {
  try {
    const raw = req.cookies.refresh_token;
    if (raw) {
      await db.execute(
        `UPDATE refresh_tokens SET revoked_at = NOW()
         WHERE token_hash = ? AND revoked_at IS NULL`,
        [sha256(raw)],
      );
    }
    res.clearCookie("refresh_token", { path: "/auth" });
    res.json({ message: "Logged out" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.setRole = async (req, res) => {
  const { id } = req.params;
  const { role } = req.body; // 'reader' | 'author' | 'admin'
  try {
    const [roles] = await db.execute(`SELECT id FROM roles WHERE role = ?`, [
      role,
    ]);
    if (!roles[0]) return res.status(400).json({ error: "Invalid role" });

    const [result] = await db.execute(
      `UPDATE users SET role_id = ? WHERE id = ?`,
      [roles[0].id, id],
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ message: "Role updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
