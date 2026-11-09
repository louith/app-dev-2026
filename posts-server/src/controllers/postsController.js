const db = require("../db");

const SELECT_POSTS = `
  SELECT p.id, p.title, p.content, p.author_id, u.username AS author,
         p.created_at, p.updated_at
  FROM posts p
  JOIN users u ON u.id = p.author_id
`;

// GET /api/posts
exports.list = async (req, res) => {
  try {
    const [rows] = await db.execute(
      `${SELECT_POSTS} ORDER BY p.created_at DESC`,
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// GET /api/posts/:id
exports.getOne = async (req, res) => {
  try {
    const [rows] = await db.execute(`${SELECT_POSTS} WHERE p.id = ?`, [
      req.params.id,
    ]);
    if (!rows[0]) return res.status(404).json({ error: "Post not found" });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// GET /api/me/posts
exports.mine = async (req, res) => {
  try {
    const [rows] = await db.execute(
      `${SELECT_POSTS} WHERE p.author_id = ? ORDER BY p.created_at DESC`,
      [req.user.sub],
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// POST /api/posts
exports.create = async (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: "Title and content are required" });
  }
  try {
    const [result] = await db.execute(
      `INSERT INTO posts (author_id, title, content) VALUES (?, ?, ?)`,
      [req.user.sub, title, content], // authorId comes from the token, never the body
    );
    res.status(201).json({ id: result.insertId, message: "Post created" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// PUT /api/posts/:id  (owner or admin)
exports.update = async (req, res) => {
  const { title, content } = req.body;
  if (!title && !content) {
    return res.status(400).json({ error: "Provide a title or content" });
  }
  try {
    const [rows] = await db.execute(
      `SELECT author_id FROM posts WHERE id = ?`,
      [req.params.id],
    );
    const post = rows[0];
    if (!post) return res.status(404).json({ error: "Post not found" });

    const isOwner = post.author_id === req.user.sub;
    const isAdmin = req.user.role === "admin";
    if (!isOwner && !isAdmin)
      return res.status(403).json({ error: "Forbidden" });

    await db.execute(
      `UPDATE posts SET title = COALESCE(?, title), content = COALESCE(?, content) WHERE id = ?`,
      [title ?? null, content ?? null, req.params.id],
    );
    res.json({ message: "Post updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// DELETE /api/posts/:id  (admin only, enforced in the route)
exports.remove = async (req, res) => {
  try {
    const [result] = await db.execute(`DELETE FROM posts WHERE id = ?`, [
      req.params.id,
    ]);
    if (result.affectedRows === 0)
      return res.status(404).json({ error: "Post not found" });
    res.json({ message: "Post deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
