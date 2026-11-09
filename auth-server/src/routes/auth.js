const express = require("express");
const auth = require("../controllers/authController");
const { requireAuth, requireRole } = require("../middleware/auth");

const router = express.Router();

router.post("/register", auth.register);
router.post("/login", auth.login);
router.post("/refresh", auth.refresh);
router.post("/logout", auth.logout);
// protected
router.patch(
  "/users/:id/set-role",
  requireAuth,
  requireRole("admin"),
  auth.setRole,
);

// sample diff db connection query
router.get("/get-student/:id", requireAuth, auth.getStudentInfo);

module.exports = router;
