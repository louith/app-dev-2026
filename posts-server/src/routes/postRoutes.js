const express = require("express");
const posts = require("../controllers/postsController");
const { requireAuth, requireRole } = require("../middleware/auth");

const router = express.Router();

// public
router.get("/", posts.list);
router.get("/:id", posts.getOne);

// logged-in
router.get("/me", requireAuth, posts.mine);
router.post("/", requireAuth, requireRole("author", "admin"), posts.create);
router.put("/:id", requireAuth, posts.update); // owner/admin checked in controller
router.delete("/:id", requireAuth, requireRole("admin"), posts.remove);

module.exports = router;
