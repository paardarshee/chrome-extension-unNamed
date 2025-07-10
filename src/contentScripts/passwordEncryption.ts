/**
 * Displays a secure, full-screen password verification popup based on the provided encryption type.
 * Generates a random string (16, 32, or 64 characters) and prompts the user to re-enter it.
 * Disables copy/paste, activates the submit button only on correct input, and returns the result via sendResponse.
 */

const passwordEncryption = (
	message: any,
	sendResponse: (response?: any) => void
) => {
	const tabId = message.tabId;

	if (tabId !== undefined) {
		const msg = message as {
			action: string;
			encryptionType: "16-bit" | "32-bit" | "64-bit";
			tabId: number;
		};

		// Clear previous content
		document.body.innerHTML = ``;

		// Generate random string
		const lengthMap = {
			"16-bit": 16,
			"32-bit": 32,
			"64-bit": 64,
		};

		const generateRandomString = (length: number) => {
			const chars =
				"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
			return Array.from(
				{ length },
				() => chars[Math.floor(Math.random() * chars.length)]
			).join("");
		};

		const encryptionLength = lengthMap[msg.encryptionType];
		const randomString = generateRandomString(encryptionLength);

		// Create popup
		const popUp = document.createElement("div");
		popUp.style.cssText = `
			position: fixed;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			background: rgba(132, 128, 128, 0.4);
			backdrop-filter: blur(14px);
			-webkit-backdrop-filter: blur(14px);
			border: 1px solid rgba(255, 255, 255, 0.1);
			border-radius: 12px;
			color: #ffffff;
			font-size: 18px;
			font-weight: 600;
			text-shadow: 0 2px 8px rgba(0, 0, 0, 0.6);
			padding: 40px;
			text-align: center;
			z-index: 9999;
			user-select: none;
		`;
		popUp.id = `password-popup-${tabId}`;

		// Disable copy/paste globally within the popup
		popUp.addEventListener("copy", (e) => e.preventDefault());
		popUp.addEventListener("paste", (e) => e.preventDefault());

		// Subheading
		const subHeading = document.createElement("h2");
		subHeading.textContent = `Enter the following ${msg.encryptionType} code`;

		// Display random string
		const randomText = document.createElement("p");
		randomText.textContent = randomString;
		randomText.style.cssText =
			"margin: 16px 0; font-family: monospace; font-size: 20px;";

		// Input box
		const input = document.createElement("input");
		input.type = "text";
		input.maxLength = encryptionLength;
		input.placeholder = `Type ${encryptionLength} characters`;
		input.style.cssText = `
			font-size: 18px;
			padding: 10px;
			width: 80%;
			max-width: 400px;
			text-align: center;
			border-radius: 8px;
			border: none;
			margin-bottom: 20px;
		`;

		// Disable copy/paste on input
		input.addEventListener("copy", (e) => e.preventDefault());
		input.addEventListener("paste", (e) => e.preventDefault());

		// Submit button
		const submitBtn = document.createElement("button");
		submitBtn.textContent = "Submit";
		submitBtn.disabled = true;
		submitBtn.style.cssText = `
			padding: 10px 20px;
			font-size: 16px;
			border-radius: 6px;
			border: none;
			cursor: not-allowed;
			background-color: #aaa;
			color: #fff;
			margin: 10px;
		`;

		// Enable submit when input matches
		input.addEventListener("input", () => {
			if (input.value === randomString) {
				submitBtn.disabled = false;
				submitBtn.style.backgroundColor = "#28a745";
				submitBtn.style.cursor = "pointer";
			} else {
				submitBtn.disabled = true;
				submitBtn.style.backgroundColor = "#aaa";
				submitBtn.style.cursor = "not-allowed";
			}
		});

		submitBtn.addEventListener("click", () => {
			popUp.remove();
			sendResponse({ status: "success", verified: true });
		});

		// Close button
		const closeBtn = document.createElement("button");
		closeBtn.textContent = "Close";
		closeBtn.style.cssText = `
			padding: 10px 20px;
			font-size: 16px;
			border-radius: 6px;
			border: none;
			cursor: pointer;
			background-color: #dc3545;
			color: #fff;
		`;
		closeBtn.addEventListener("click", () => {
			popUp.remove();
			sendResponse({ status: "closed", verified: false });
		});

		// Append everything to popup
		popUp.appendChild(subHeading);
		popUp.appendChild(randomText);
		popUp.appendChild(input);
		popUp.appendChild(submitBtn);
		popUp.appendChild(closeBtn);

		document.body.appendChild(popUp);
	}
};

export default passwordEncryption;
