const User = require("../models/user");
const stripe = require("stripe")(process.env.STRIPE_SECRET);
const queryString = require("query-string");
const Course = require("../models/Course");

exports.makeInstructor = async (req, res) => {
	try {
		const user = await User.findById(req.auth._id).exec();

		if (!user.stripe_account_id) {
			const account = await stripe.accounts.create({ type: "standard" });
			user.stripe_account_id = account.id;
			await user.save();
		}

		let accountLink = await stripe.accountLinks.create({
			account: user.stripe_account_id,
			refresh_url: process.env.STRIPE_REDIRECT_URL,
			return_url: process.env.STRIPE_REDIRECT_URL,
			type: "account_onboarding",
		});

		accountLink = Object.assign(accountLink, {
			"stripe_user[email]": user.email,
		});

		res
			.status(200)
			.send(`${accountLink.url}?${queryString.stringify(accountLink)}`);
	} catch (error) {
		console.log(error);
		res.status(400).send(error.message);
	}
};

exports.getAccountStatus = async (req, res) => {
	try {
		const user = await User.findById(req.auth._id);
		const account = await stripe.account.retrieve(user.stripe_account_id);

		if (!account.charges_enabled) {
			return res.status(401).send("Unauthorized");
		} else {
			const statusUpdated = await User.findByIdAndUpdate(
				user._id,
				{
					stripe_seller: account,
					$addToSet: { role: "Instructor" },
				},
				{ new: true },
			)
				.select("-password")
				.exec();

			res.status(200).json(statusUpdated);
		}
	} catch (error) {
		console.log(error);
		res.status(400).send(error.message);
	}
};

exports.currentInstructor = async (req, res) => {
	try {
		let user = await User.findById(req.auth._id).select("-password");

		if (!user.role.includes("Instructor")) return res.sendStatus(403);

		res.json({ ok: true });
	} catch (error) {
		console.log(error);
		res.status(400).send(error.message);
	}
};

exports.instructorCourses = async (req, res) => {
	try {
		const courses = await Course.find({ instructor: req.auth._id })
			.sort({ createdAt: -1 })
			.exec();

		res.json(courses);
	} catch (error) {
		console.log(error);
		res.status(400).send(error.message);
	}
};

exports.studentCount = async (req, res) => {
	try {
		const users = await User.find({ courses: req.body.courseId }).select("_id");

		res.status(200).json(users.length);
	} catch (err) {
		console.log(err);
		res.status(400).send(err);
	}
};

exports.balance = async (req, res) => {
	try {
		const user = await User.findById(req.auth._id).exec();

		const balance = await stripe.balance.retrieve({
			stripeAccount: user.stripe_account_id,
		});

		res.json(balance);
	} catch (err) {
		console.log(err);
		res.status(400).send(err);
	}
};

exports.payoutSettings = async (req, res) => {
	try {
		const user = await User.findById(req.auth._id).exec();

		const link = await stripe.accounts.createLoginLink(user.stripe_seller.id, {
			redirect_url: process.env.STRIPE_SETTINGS_REDIRECT,
		});

		res.status(200).json(link.url);
	} catch (err) {
		console.log(err);
		res.status(400).send(err);
	}
};
