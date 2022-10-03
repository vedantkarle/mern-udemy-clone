const mongoose = require("mongoose");
const { Schema } = mongoose;

const noteSchema = new Schema(
	{
		time: String,
		content: String,
		sectionName: String,
		lessonName: String,
		course: {
			type: Schema.Types.ObjectId,
			ref: "Course",
		},
		user: {
			type: Schema.Types.ObjectId,
			ref: "User",
		},
	},
	{ timestamps: true },
);

const Note = mongoose.model("Note", noteSchema);

module.exports = Note;
