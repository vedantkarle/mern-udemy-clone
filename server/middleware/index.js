const { expressjwt: jwt } = require("express-jwt");
const User = require("../models/user");
const Course = require("../models/Course");
const mongoose = require("mongoose");

exports.protect = jwt({
	getToken: (req, res) => req.cookies.token,
	secret: process.env.JWT_SECRET,
	algorithms: ["HS256"],
});

exports.isInstructor = async (req, res, next) => {
	try {
		const user = await User.findById(req.auth._id).exec();

		if (!user.role.includes("Instructor"))
			return res.status(401).send("Unauthorized");
		next();
	} catch (error) {
		console.log(error);
		res.status(401).send("Unauthorized!");
	}
};

exports.isEnrolled = async (req, res, next) => {
	try {
		const user = await User.findById(req.auth._id).exec();
		const course = await Course.findOne({ slug: req.params.slug }).exec();

		if (!user.courses.includes(course._id)) {
			res.sendStatus(401);
		} else {
			next();
		}
	} catch (error) {
		console.log(error);
		res.status(401).send("Unauthorized!");
	}
};
