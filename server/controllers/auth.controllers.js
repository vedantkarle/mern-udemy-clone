const jwt = require("jsonwebtoken");
const User = require("../models/user");
const uniqid = require("uniqid");
const AWS = require("aws-sdk");

const awsConfig = {
	accessKeyId: process.env.AWS_ACCESS,
	secretAccessKey: process.env.AWS_SECRET,
	region: process.env.AWS_REGION,
};

const SES = new AWS.SES(awsConfig);

exports.register = async (req, res) => {
	try {
		const { name, email, password } = req.body;

		if (!name) return res.status(400).send("Name is required!");
		if (!email) return res.status(400).send("Email is required!");
		if (!password || password.length < 6)
			return res
				.status(400)
				.send("Password is required and should be atleast 6 characters long");

		const userExists = await User.findOne({ email }).exec();
		if (userExists) return res.status(400).send("User already exists!");

		const user = await User.create({ name, email, password });

		res.status(200).json({ user });
	} catch (err) {
		console.log(err);
		return res.status(400).send(err.message);
	}
};

exports.login = async (req, res) => {
	try {
		const { email, password } = req.body;

		if (!email) return res.status(400).send("Email is required!");
		if (!password) return res.status(400).send("Password is required!");

		const user = await User.findOne({ email });

		if (!user) return res.status(404).send("No user found.Please Register");

		const match = await user.comparePassword(password);

		if (!match) return res.status(400).send("Invalid Credentials");

		const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
			expiresIn: "7d",
		});

		user.password = undefined;

		res.cookie("token", token, {
			httpOnly: true,
		});

		res.status(200).json(user);
	} catch (err) {
		console.log(err);
		return res.status(400).send(err.message);
	}
};

exports.logout = async (req, res) => {
	try {
		res.clearCookie("token");

		res.sendStatus(204);
	} catch (err) {
		console.log(err);
		return res.status(400).send(err.message);
	}
};

exports.currentUser = async (req, res) => {
	try {
		const user = await User.exists({ _id: req.auth._id });
		res.status(200).json({ ok: user ? true : false });
	} catch (error) {
		console.log(error);
		return res.status(400).send(err.message);
	}
};

exports.forgotPassword = async (req, res) => {
	try {
		const { email } = req.body;

		const shortCode = uniqid().toUpperCase();

		const user = await User.findOneAndUpdate(
			{ email },
			{ passwordResetCode: { data: shortCode } },
		);

		if (!user)
			return res.status(404).send("Please enter a valid email address");

		const params = {
			Source: process.env.EMAIL_FROM,
			Destination: {
				ToAddresses: [email],
			},
			Message: {
				Body: {
					Html: {
						Charset: "UTF-8",
						Data: `
							<html>
								<h1>
									Reset Password
								</h1>
								<p>User this code to reset your password</p>
								<h2 style="color:green;">${shortCode}</h2>
								<i>VDEMY</i>
							</html>
						`,
					},
				},
				Subject: {
					Charset: "UTF-8",
					Data: "Reset Password Vdemy",
				},
			},
		};

		const emailSent = SES.sendEmail(params).promise();

		emailSent
			.then(data => {
				res.json({ ok: true });
			})
			.catch(err => {
				console.log(err);
				return res.status(400).send(err.message);
			});
	} catch (err) {
		console.log(err);
		return res.status(400).send(err.message);
	}
};
