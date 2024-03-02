// Node.js backend code using Express
const express = require("express");
const OpenAI = require("openai");
const cors = require("cors");
require("dotenv").config();
const path = require("path");

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "views")));

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

app.post("/fetch-reply", async (req, res) => {
	try {
		const response = await openai.chat.completions.create({
			model: "gpt-3.5-turbo",
			messages: [{ role: "user", content: req.body.content }],
			max_tokens: 60,
		});
		// console.log(response.choices[0].message.content);
		res.json(response.choices[0].message.content); // Send only the needed data back to the frontend
	} catch (error) {
		console.error(error);
		res.status(500).send(error.message);
	}
});

app.post("/fetch-Synopsis", async (req, res) => {
	try {
		const response = await openai.chat.completions.create({
			model: "gpt-3.5-turbo",
			messages: [{ role: "user", content: req.body.content }],
			max_tokens: 700,
		});
		console.log(response.choices[0].message.content);
		res.json(response.choices[0].message.content); // Send only the needed data back to the frontend
	} catch (error) {
		console.error(error);
		res.status(500).send(error.message);
	}
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
