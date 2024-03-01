// Frontend code using Axios
const setupTextarea = document.querySelector("#setup-textarea");
const setupInputContainer = document.querySelector(".setup-input-container");
const dungeonMasterText = document.querySelector("#dungeon-master-text");

document.querySelector("#send-btn").addEventListener("click", () => {
	setupInputContainer.innerHTML = "<p> loading... </p>";
	dungeonMasterText.textContent = "Ok, let me generating...";
	fetchBotReply();
});

async function fetchBotReply() {
	try {
		const response = await axios.post(
			"http://localhost:3000/fetch-reply",
			{
				content: "tell me a joke",
			},
			{
				headers: {
					"Content-Type": "application/json",
				},
			}
		);

		// No need to call response.json() with Axios, use response.data directly
		// const data = response.data;
		dungeonMasterText.textContent = response.data;
	} catch (error) {
		console.log("Error:", error);
		dungeonMasterText.textContent = "Failed to fetch the reply. Please try again.";
	}
}
