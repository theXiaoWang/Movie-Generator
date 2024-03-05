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

const openAiMiddleware = (model, max_tokens, temperature) => async (req, res, next) => {
	try {
		const response = await openai.chat.completions.create({
			model,
			messages: [{ role: "user", content: req.body.content }],
			max_tokens,
			temperature,
		});
		// console.log(response.choices[0].message.content);
		res.json(response.choices[0].message.content); // Send only the needed data back to the frontend
		next();
	} catch (error) {
		console.error(error);
		res.status(500).send(error.message);
	}
};

app.post("/fetch-reply", openAiMiddleware("gpt-3.5-turbo", 60), async (req, res) => {});

app.post("/fetch-synopsis", openAiMiddleware("gpt-3.5-turbo", 700), async (req, res) => {});

app.post("/fetch-title", openAiMiddleware("gpt-3.5-turbo", 25, 0.7), async (req, res) => {});

app.post("/fetch-title", async (req, res) => {
	try {
		const response = await openai.createImage({
			model: "dall-e-3",
			prompt: "a white siamese cat",
			n: 1,
			size: "256x256",
		  });
		  image_url = response.data.data[0].url;
		
	} catch (error) {
		
	}
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
