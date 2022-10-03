const AWS = require("aws-sdk");
const uniqid = require("uniqid");
const Course = require("../models/Course");
const Note = require("../models/Note");
const slugify = require("slugify");
const fs = require("fs");
const mongoose = require("mongoose");
const User = require("../models/user");
const stripe = require("stripe")(process.env.STRIPE_SECRET);

const awsConfig = {
	accessKeyId: process.env.AWS_ACCESS,
	secretAccessKey: process.env.AWS_SECRET,
	region: process.env.AWS_REGION,
};

const S3 = new AWS.S3(awsConfig);

exports.getCourses = async (req, res) => {
	try {
		const courses = await Course.find({ published: true })
			.populate("instructor", "_id name")
			.exec();

		res.status(200).json(courses);
	} catch (error) {
		console.log(error);
		res.status(500).send("Unable to fetch courses");
	}
};

exports.uploadImage = async (req, res) => {
	try {
		const { image } = req.body;

		if (!image) {
			return res.status(400).send("No image provided!!");
		}

		const base64Data = new Buffer.from(
			image.replace(/^data:image\/\w+;base64,/, ""),
			"base64",
		);

		const type = image.split(";")[0].split("/")[1];

		const params = {
			Bucket: "vdemy",
			Key: `${uniqid()}.${type}`,
			Body: base64Data,
			ACL: "public-read",
			ContentEncoding: "base64",
			ContentType: `image/${type}`,
		};

		S3.upload(params, (err, data) => {
			if (err) {
				console.log(err);
				return res.status(400).send(err.message);
			}
			res.status(200).send(data);
		});
	} catch (error) {
		console.log(err);
		res.status(400).send(err.message);
	}
};

exports.removeImage = async (req, res) => {
	try {
		const image = req.body;

		const params = {
			Bucket: image.Bucket,
			Key: image.Key,
		};

		S3.deleteObject(params, (err, data) => {
			if (err) {
				console.log(err);
				return res.status(400).send(err.message);
			}
			res.sendStatus(200);
		});
	} catch (error) {
		console.log(err);
		res.status(400).send(err.message);
	}
};

exports.createCourse = async (req, res) => {
	try {
		const alreadyExists = await Course.findOne({
			slug: slugify(req.body.name.toLowerCase()),
		});

		if (alreadyExists) {
			res.status(400).send("Course with this name already exists!");
		}

		const course = await Course.create({
			slug: slugify(req.body.name),
			instructor: req.auth._id,
			...req.body,
		});

		res.sendStatus(201);
	} catch (error) {
		console.log(error);
		res.status(400).send(error.message);
	}
};

exports.getCourse = async (req, res) => {
	try {
		const { slug } = req.params;

		const course = await Course.findOne({ slug })
			.populate("instructor", "_id name")
			.exec();

		res.status(200).json(course);
	} catch (error) {
		console.log(error);
		res.status(400).send(error.message);
	}
};

exports.addSection = async (req, res) => {
	try {
		const { slug, title } = req.body;

		const course = await Course.findOne({ slug })
			.populate("instructor", "_id name")
			.exec();

		if (!course) {
			return res.status(401).send("No course found");
		}

		course.sections.push({ title });
		await course.save();

		res.status(200).json(course);
	} catch (error) {
		console.log(error);
		res.status(400).send(error.message);
	}
};

exports.uploadVideo = async (req, res) => {
	try {
		const { video } = req.files;

		if (!video) {
			return res.status(400).send("No video provided!!");
		}

		const params = {
			Bucket: "vdemy",
			Key: `${uniqid()}.${video.type.split("/")[1]}`,
			Body: fs.readFileSync(video.path),
			ACL: "public-read",
			ContentEncoding: "base64",
			ContentType: video.type,
		};

		S3.upload(params, (err, data) => {
			if (err) {
				console.log(err);
				return res.status(400).send(err.message);
			}
			res.status(200).send(data);
		});
	} catch (error) {
		console.log(error);
		res.status(400).send(error.message);
	}
};

exports.removeVideo = async (req, res) => {
	try {
		const video = req.body;

		const params = {
			Bucket: video.Bucket,
			Key: video.Key,
		};

		S3.deleteObject(params, (err, data) => {
			if (err) {
				console.log(err);
				return res.status(400).send(err.message);
			}
			res.sendStatus(200);
		});
	} catch (error) {
		console.log(err);
		res.status(400).send(err.message);
	}
};

exports.addLesson = async (req, res) => {
	try {
		const { slug, instructorId } = req.params;
		const { title, content, video, section, free_preview } = req.body;

		if (req.auth._id !== instructorId) {
			return res.status(401).send("Unauthorized");
		}

		const course = await Course.findOne({ slug });
		const sec = course.sections.find(s => s.title === section);

		sec.lessons.push({
			title,
			slug: slugify(title),
			content,
			video,
			free_preview,
		});
		course.sections = course.sections.map(s => {
			if (s._id === sec._id) {
				return sec;
			} else {
				return s;
			}
		});
		await course.save();
		res.status(200).json(course);
	} catch (error) {
		console.log(err);
		res.status(400).send(err.message);
	}
};

exports.editCourse = async (req, res) => {
	try {
		const { name, description, paid, price, sections } = req.body;

		const course = await Course.findOne({ slug: req.params.slug });

		course.name = name || course.name;
		course.description = description || course.description;
		course.paid = paid;
		course.price = price || course.price;
		course.slug = slugify(name) || course.slug;
		course.sections = sections || course.sections;

		await course.save();

		res.sendStatus(204);
	} catch (error) {
		console.log(err);
		res.status(400).send(err.message);
	}
};

exports.publishCourse = async (req, res) => {
	try {
		const { courseId } = req.params;

		const course = await Course.findById(courseId)
			.populate("instructor")
			.exec();

		if (course.instructor._id.toString() !== req.auth._id) {
			return res.status(401).send("Unauthorized");
		}

		course.published = true;

		await course.save();

		res.status(200).json(course);
	} catch (err) {
		console.log(err);
		res.status(400).send(err.message);
	}
};

exports.unPublishCourse = async (req, res) => {
	try {
		const { courseId } = req.params;

		const course = await Course.findById(courseId).exec();

		if (course.instructor._id.toString() !== req.auth._id) {
			return res.status(401).send("Unauthorized");
		}

		course.published = false;

		await course.save();

		res.status(200).json(course);
	} catch (err) {
		console.log(err);
		res.status(400).send(err.message);
	}
};

exports.checkEnrollment = async (req, res) => {
	try {
		const { courseId } = req.params;

		const user = await User.findById(req.auth._id).exec();

		res.status(200).json({
			status: user.courses.includes(mongoose.Types.ObjectId(courseId)),
		});
	} catch (err) {
		console.log(err);
		res.status(400).send(err.message);
	}
};

exports.freeEnrollment = async (req, res) => {
	try {
		const { courseId } = req.params;

		const course = await Course.findById(courseId).exec();

		if (course.paid) return;

		const user = await User.findByIdAndUpdate(
			req.auth._id,
			{
				$addToSet: { courses: course._id },
			},
			{ new: true },
		).select("-password");

		res.status(200).json(user);
	} catch (err) {
		console.log(err);
		res.status(400).send("Enrollment failed");
	}
};

exports.paidEnrollment = async (req, res) => {
	try {
		const { courseId } = req.params;

		const course = await Course.findById(courseId)
			.populate("instructor")
			.exec();

		if (!course.paid) return;

		const fee = (course.price * 30) / 100;

		const session = await stripe.checkout.sessions.create({
			payment_method_types: ["card"],
			line_items: [
				{
					name: course.name,
					amount: Math.round(course.price.toFixed(2) * 100),
					currency: "inr",
					quantity: 1,
				},
			],
			payment_intent_data: {
				application_fee_amount: Math.round(fee.toFixed(2) * 100),
				transfer_data: {
					destination: course.instructor.stripe_account_id,
				},
			},
			success_url: `${process.env.STRIPE_SUCCESS_URL}/${course._id}`,
			cancel_url: process.env.STRIPE_CANCEL_URL,
		});

		const user = await User.findByIdAndUpdate(
			req.auth._id,
			{
				stripeSession: session,
			},
			{ new: true },
		).select("-password");

		res.status(200).json({ sessionId: session.id, user });
	} catch (err) {
		console.log(err);
		res.status(400).send("Enrollment failed");
	}
};

exports.stripeSuccess = async (req, res) => {
	try {
		const course = await Course.findById(req.params.courseId).exec();

		const user = await User.findById(req.auth._id).exec();

		if (!user.stripeSession.id) return res.sendStatus(400);

		const session = await stripe.checkout.sessions.retrieve(
			user.stripeSession.id,
		);

		if (session.payment_status === "paid") {
			user.courses.push(course._id);
			user.stripeSession = {};
			await user.save();
		}

		res.status(200).json({ success: true, course });
	} catch (err) {
		console.log(err);
		res.status(400).json({ success: false });
	}
};

exports.userCourses = async (req, res) => {
	try {
		const user = await User.findById(req.auth._id).exec();
		const courses = await Course.find({ _id: { $in: user.courses } })
			.populate("instructor", "_id name")
			.exec();
		res.status(200).json(courses);
	} catch (err) {
		console.log(err);
		res.status(400).send(err.message);
	}
};

exports.addNote = async (req, res) => {
	try {
		const { time, content, sectionName, lessonName, courseId } = req.body;

		const note = await Note.create({
			time,
			content,
			sectionName,
			lessonName,
			course: courseId,
			user: req.auth._id,
		});

		res.status(201).json(note);
	} catch (err) {
		console.log(err);
		res.status(400).send(err.message);
	}
};

exports.deleteNote = async (req, res) => {
	try {
		const { noteId } = req.params;

		await Note.findByIdAndDelete(noteId);

		res.sendStatus(204);
	} catch (err) {
		console.log(err);
		res.status(400).send(err.message);
	}
};

exports.getUserNotes = async (req, res) => {
	try {
		const { courseId } = req.params;

		const notes = await Note.find({
			course: mongoose.Types.ObjectId(courseId),
			user: mongoose.Types.ObjectId(req.auth._id),
		});

		res.status(201).json(notes);
	} catch (err) {
		console.log(err);
		res.status(400).send(err.message);
	}
};
