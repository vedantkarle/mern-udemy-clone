const mongoose = require("mongoose");
const { Schema } = mongoose;

const courseSchema = new Schema(
	{
		name: {
			type: String,
			trim: true,
			minlength: 3,
			maxlenght: 320,
			required: true,
		},
		slug: {
			type: String,
			lowercase: true,
		},
		description: {
			type: String,
			minlength: 200,
			required: true,
		},
		price: {
			type: Number,
			default: 299,
		},
		image: {},
		published: {
			type: Boolean,
			default: false,
		},
		paid: {
			type: Boolean,
			default: true,
		},
		instructor: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		sections: [
			{
				title: {
					type: String,
					trim: true,
					minlength: 3,
					maxlenght: 100,
					required: true,
				},
				lessons: [],
			},
		],
	},
	{ timestamps: true },
);

const Course = mongoose.model("Course", courseSchema);

module.exports = Course;
