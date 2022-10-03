const express = require("express");
const {
	uploadImage,
	removeImage,
	createCourse,
	getCourse,
	addSection,
	uploadVideo,
	removeVideo,
	addLesson,
	editCourse,
	publishCourse,
	unPublishCourse,
	getCourses,
	checkEnrollment,
	freeEnrollment,
	paidEnrollment,
	stripeSuccess,
	userCourses,
	markCompleted,
	addNote,
	getUserNotes,
	deleteNote,
} = require("../controllers/course.controllers");
const { protect, isInstructor, isEnrolled } = require("../middleware");
const formidable = require("express-formidable");

const router = express.Router();

router.get("/courses", getCourses);
router.post("/course/add-note", protect, addNote);
router.delete("/course/delete-note/:noteId", protect, deleteNote);
router.get("/course/get-user-notes/:courseId", protect, getUserNotes);
router.get("/course/user-courses", protect, userCourses);
router.get("/user/course/:slug", protect, isEnrolled, getCourse);

router.post("/course/upload-image", protect, uploadImage);
router.post("/course/remove-image", protect, removeImage);
router.post("/course/create", protect, isInstructor, createCourse);
router.get("/course/:slug", getCourse);
router.post("/course/addSection", protect, isInstructor, addSection);
router.post(
	"/course/upload-video",
	protect,
	isInstructor,
	formidable(),
	uploadVideo,
);
router.post("/course/remove-video", protect, isInstructor, removeVideo);
router.post(
	"/course/lesson/:slug/:instructorId",
	protect,
	isInstructor,
	addLesson,
);
router.put("/course/:slug", protect, isInstructor, editCourse);

router.put("/course/publish/:courseId", protect, isInstructor, publishCourse);
router.put(
	"/course/unpublish/:courseId",
	protect,
	isInstructor,
	unPublishCourse,
);

router.get("/course/check-enrollment/:courseId", protect, checkEnrollment);
router.post("/course/free-enrollment/:courseId", protect, freeEnrollment);
router.post("/course/paid-enrollment/:courseId", protect, paidEnrollment);
router.get("/course/stripe-success/:courseId", protect, stripeSuccess);

module.exports = router;
