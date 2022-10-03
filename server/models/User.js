const { compare, hash } = require("bcrypt");
const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema(
	{
		name: {
			type: String,
			trim: true,
			require: [true, "Please provide your name"],
		},
		email: {
			type: String,
			trim: true,
			require: [true, "Please provide your email"],
			unique: true,
		},
		password: {
			type: String,
			require: [true, "Please provide a password"],
			min: 6,
			max: 64,
		},
		picture: {
			type: String,
			default: "/avatar.png",
		},
		role: {
			type: [String],
			default: ["Subscriber"],
			enum: ["Subscriber", "Instructor", "Admin"],
		},
		courses: [
			{
				type: Schema.Types.ObjectId,
				ref: "Course",
			},
		],
		stripe_account_id: "",
		stripe_seller: {},
		stripeSession: {},
		passwordResetCode: {
			data: String,
			default: "",
		},
	},
	{ timestamps: true },
);

userSchema.pre("save", async function (next) {
	if (this.password && this.isModified("password")) {
		const hashedPassword = await hash(this.password, 10);
		this.password = hashedPassword;
	}
	next();
});

userSchema.methods.comparePassword = async function (password) {
	const hashedPassword = this.password;
	return compare(password, hashedPassword);
};

userSchema.methods.hashPassword = async function (password) {
	return hash(password, SALT_ROUND);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
