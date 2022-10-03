const express = require("express");
const {
	makeInstructor,
	getAccountStatus,
	currentInstructor,
	instructorCourses,
	studentCount,
	balance,
	payoutSettings,
} = require("../controllers/instructor.controller");
const { protect, isInstructor } = require("../middleware");

const router = express.Router();

router.post("/make-instructor", protect, makeInstructor);
router.post("/get-account-status", protect, getAccountStatus);
router.get("/current-instructor", protect, currentInstructor);

router.get("/instructor-courses", protect, isInstructor, instructorCourses);

router.post("/instructor/student-count", protect, isInstructor, studentCount);

router.get("/instructor/balance", protect, isInstructor, balance);
router.get(
	"/instructor/payout-settings",
	protect,
	isInstructor,
	payoutSettings,
);

module.exports = router;
