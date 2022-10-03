const cookieParser = require("cookie-parser");
const cors = require("cors");
const express = require("express");
const fs = require("fs");
const mongoose = require("mongoose");

require("dotenv").config();

const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(cookieParser());

fs.readdirSync("./routes").map(r => {
	app.use("/api", require(`./routes/${r}`));
});

mongoose
	.connect(process.env.DATABASE, {})
	.then(() => {
		console.log("DB connected");
		app.listen(5000, () => console.log("Express server listening on 5000"));
	})
	.catch(err => console.log("DB Error => ", err));
