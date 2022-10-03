const express = require("express");
const {
	currentUser,
	forgotPassword,
	login,
	logout,
	register,
} = require("../controllers/auth.controllers");
const { protect } = require("../middleware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/current-user", protect, currentUser);
router.post("/forgot-password", forgotPassword);

module.exports = router;
