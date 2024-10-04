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

const openAiTextMiddleware = (model, max_tokens, temperature) => async (req, res, next) => {
	try {
		const response = await openai.chat.completions.create({
			model,
			messages: [{ role: "user", content: req.body.content }],
			max_tokens,
			temperature,
		});
		// console.log(`${req.path}: `, response.choices[0].message.content);
		res.json(response.choices[0].message.content); // Send only the needed data back to the frontend
	} catch (error) {
		console.error(error);
		res.status(500).send(error.message);
	}
};

const openAiImageMiddleware = (model, size, response_format) => async (req, res, next) => {
	try {
		const response = await openai.images.generate({
			model,
			prompt: req.body.content,
			n: 1,
			size,
			response_format,
		});
		// console.log(`${req.path}: `, response.data[0].url);
		res.json(response.data[0].url);
	} catch (error) {
		console.error(error);
		res.status(500).send(error.message);
	}
};

app.post("/fetch-reply", openAiTextMiddleware("gpt-3.5-turbo", 60), async (req, res) => {});

app.post("/fetch-synopsis", openAiTextMiddleware("gpt-3.5-turbo", 700), async (req, res) => {});

app.post("/fetch-title", openAiTextMiddleware("gpt-3.5-turbo", 25, 0.7), async (req, res) => {});

app.post("/fetch-image-prompt", openAiTextMiddleware("gpt-3.5-turbo", 100, 0.8), async (req, res) => {});

app.post("/fetch-image-url", openAiImageMiddleware("dall-e-3", "1024x1024", "url"), async (req, res) => {});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});