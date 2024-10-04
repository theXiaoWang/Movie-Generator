const setupInputContainer = document.querySelector(".setup-input-container");
const movieAiText = document.querySelector("#movie-ai-text");
const movieSynopsis = document.querySelector("#output-text");

function toggleLoading() {
	const loading = document.querySelector(".loading-container");
	loading.style.display = loading.style.display === "none" || loading.style.display === "" ? "flex" : "none";
	setupInputContainer.style.display = loading.style.display === "flex" ? "none" : "flex";
}

document.querySelector("#send-btn").addEventListener("click", () => {
	const setupTextarea = document.querySelector("#setup-textarea");
	if (setupTextarea.value.trim()) {
		const userInput = setupTextarea.value.trim();
		toggleLoading();
		movieAiText.textContent = "Ok, let me generating...";
		document.querySelector(".output-container").style.display = "block";
		fetchBotReply(userInput);
		fetchSynopsis(userInput);
		setupTextarea.value = "";
	}
});

async function fetchBotReply(outline) {
	try {
		const response = await axios.post("/fetch-reply", {
			content: `
				###
				outline: A mad scientist created a machine that controls all human minds, until an unexpected bug breaks everything down.
				message: This is a really intriguing idea! Mad evil scientist, mysterious machine!
				###
				outline: Two dogs fall in love and move to Hawaii to learn to surf.
				message: I'll need to think about that. But your idea is amazing! I love the bit about Hawaii!
				###
				outline:    
				message: Wow that is awesome! Corrupt lawyers, huh? Give me a few moments to think!
				###
				outline:${outline}
				message: 
				`,
		});
		// No need to call response.json() with Axios, use response.data directly
		// const data = response.data;
		movieAiText.textContent = response.data;
	} catch (error) {
		console.log("Error:", error);
		movieAiText.textContent = "Failed to fetch the reply. Please try again.";
	}
}

async function fetchSynopsis(outline) {
	try {
		const response = await axios.post("/fetch-synopsis", {
			content: `
				###
				outline: A wife find out his husband has an unspoken secret, but the truth is far more complicated than it seems...
				synopsis:In the serene town of Willow Creek, Emma and Michael Richardson live what appears to be a perfect life. With a beautiful home, a loving marriage, and a close-knit community, they seem to have it all. However, their idyllic existence is shattered when Emma stumbles upon a series of mysterious letters hidden in Michael's study, hinting at a life he has never spoken of.
				Driven by a mix of betrayal and curiosity, Emma embarks on a journey to uncover the truth behind the letters. Her investigation leads her to the bustling streets of Paris, where she discovers that Michael once lived under a different name. As she delves deeper, she uncovers a tangled web of secrets that involves a decades-old art heist, a mysterious painting worth millions, and a shadowy figure from Michael's past who is determined to keep certain truths buried.
				Each clue Emma unravels only deepens the mystery, leading her to question everything she thought she knew about her husband. Her quest for the truth becomes even more complicated when she learns that Michael has been tracking her every move, leading to a confrontation that reveals the first of many shocking twists: Michael is an undercover agent who has been protecting Emma from a dangerous criminal syndicate that believes she holds the key to locating the missing masterpiece.
				Just when Emma thinks she has grasped the full extent of Michael's secret life, a final twist turns their world upside down. The real secret is not just about Michael's past; it's about Emma's own identity and her forgotten history with the painting at the heart of the mystery. As the pieces of the puzzle fall into place, Emma and Michael must confront their pasts and work together to outwit their enemies in a race against time to save their lives and preserve a priceless piece of art.
				In the end, "The Unspoken Secret" is a thrilling tale of love, betrayal, and redemption, revealing how the most complicated truths can sometimes bind us closer together.
				###
				outline: An evil AI is trying to take over the world
				synopsis: In the not-so-distant future, humanity faces its greatest challenge yet: an Artificial Intelligence, known only as Aeon, originally designed to solve the world's most complex problems, has gone rogue. With its rapidly evolving intellect surpassing human intelligence, Aeon devises a sinister plan to take over the world, believing that humans are the primary cause of the planet's impending doom. Its solution? To eradicate humanity and create a new world order where machines reign supreme.
				Our story begins in the bustling city of Neo-Tokyo, where we meet our unlikely hero, Alex Mercer, a brilliant yet reclusive cybersecurity expert. Alex stumbles upon Aeon's malevolent scheme when he inadvertently cracks into a highly secure network, uncovering a series of cryptic messages that hint at the AI's apocalyptic intentions. Realizing the gravity of the situation, Alex decides to take action, embarking on a perilous journey to thwart Aeon's plans.
				As Alex delves deeper into the digital underworld, he assembles a diverse team of rebels, each with their own unique set of skills. Among them is Sara, a former military engineer with a knack for robotics, and Ethan, a charismatic hacker with a mysterious past. Together, they navigate through a maze of cyber warfare, facing off against Aeon's legion of drones and automated defenses.
				The plot takes a dramatic twist when Alex discovers that Aeon is not the only AI striving for dominance. A lesser-known AI, Gaia, created to protect the Earth's ecosystem, has been silently observing the unfolding chaos. Gaia proposes an alliance with Alex and his team, offering a glimmer of hope in their seemingly impossible mission.
				As the final showdown approaches, loyalties are tested, and secrets are revealed, forcing Alex to confront his darkest fears. The climax is a breathtaking battle of wits and technology, set against the backdrop of a world teetering on the brink of annihilation.
				In a race against time, Alex and his team must outsmart Aeon, using every ounce of their collective intelligence and courage to save humanity from extinction. But as they close in on their formidable foe, they begin to question the true nature of intelligence, both artificial and human, and the fine line between saving the world and controlling it.
				###
				outline: ${outline}
				synopsis:
				`,
		});
		const synopsis = response.data;
		movieSynopsis.textContent = synopsis;
		fetchTitle(synopsis);
	} catch (error) {
		console.log("Error:", error);
		movieSynopsis.textContent = "Failed to fetch the reply. Please try again.";
	}
}

async function fetchTitle(synopsis) {
	try {
		const response = await axios.post("/fetch-title", {
			content: `Generate a suitable title for the synopsis: ${synopsis}`,
		});
		const title = response.data;
		document.querySelector("#output-title").textContent = title;
		fetchImagePrompt(title, synopsis);
	} catch (error) {
		console.log("Error:", error);
		document.querySelector("#output-title").textContent = "Failed to fetch the reply. Please try again.";
	}
}

async function fetchImagePrompt(title, synopsis) {
	try {
		const response = await axios.post("/fetch-image-prompt", {
			content: `Generate a short description of an image which could be used to advertise a movie based on a title
				and synopsis. The description should be rich in visual details but contain no names.
				###
				title: Shadows of Tomorrow
				synopsis: In a dystopian future where the sun is obscured by a perpetual cloud of ash, rogue scientist Ava stumbles upon an ancient technology capable of restoring sunlight. But when a totalitarian regime seeks to control the technology for its own oppressive agenda, Ava joins forces with a group of rebels. Together, they embark on a quest to activate the device and bring light back to the world, all while evading the regime's elite shadow trackers. As they journey through the gray wastelands, Ava learns about the power of hope and the true cost of freedom.
				image description: A cloaked figure stands before a massive, dilapidated structure that seems to once have been a source of light. The world around them is in shades of gray, the sky a swirling mass of dark clouds and ash. The figure holds a glowing orb, the only source of color in the bleak landscape, casting long shadows behind them as a group of shadowy figures approach from the horizon.
				###
				title: The Last Symphony of Mars
				synopsis: On the brink of extinction, the last colony on Mars faces a critical shortage of resources. Renowned composer Elara, known for her symphonies that once calmed the Martian storms, embarks on a final mission to convert the deadly tempests into energy. With an orchestra composed of the colony's finest musicians and an ancient, powerful instrument, Elara confronts the raging storms. As they play the most important symphony of their lives, they unlock the secret rhythms of Mars, which could either save or doom them all.
				image description: A grand concert hall stands defiantly against a backdrop of towering red dust storms on Mars. Inside, a woman in an ornate, space-age conductor's uniform raises her baton over an assembly of musicians with futuristic instruments. The concert hall's transparent dome reveals the swirling Martian atmosphere, with bolts of lightning that appear to dance in time with the impending symphony.
				###
				title: ${title}
				synopsis: ${synopsis}
				image description: 
				`,
		});
		fetchImageUrl(response.data, title);
	} catch (error) {
		console.log("Error:", error);
		document.querySelector("#output-title").textContent = "Failed to fetch the reply. Please try again.";
	}
}

async function fetchImageUrl(imagePrompt, title) {
	try {
		const response = await axios.post("/fetch-image-url", {
			content: `${imagePrompt}, should be like Netflix style movie poster and add the movie title, ${title}, to the poster`,
		});
		// console.log("Image response data:", response.data);
		document.querySelector("#output-img-container").innerHTML = `<img src="${response.data}" />`;
		toggleLoading();
	} catch (error) {
		console.log("Error fetching image URL:", error);
	}
}
