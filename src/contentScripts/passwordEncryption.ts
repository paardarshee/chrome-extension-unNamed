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

		// Generate random string
		const lengthMap = {
			"16-bit": 16,
			"32-bit": 32,
			"64-bit": 64,
		};

		const generateRandomString = (length: number) => {
			const chars =
				"!@#$%^&*()_+-=[]{}|;:',.<>?/~`ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:',.<>?/~`";
			return Array.from(
				{ length },
				() => chars[Math.floor(Math.random() * chars.length)]
			).join("");
		};

		const encryptionLength = lengthMap[msg.encryptionType];
		const randomString = "password"; // For testing purposes, you can replace this with the actual random string generation
		// const randomString = generateRandomString(encryptionLength);

		// Add CSS styles

		// Create popup container
		const overlay = document.createElement("div");
		overlay.className = "password-overlay";
		overlay.id = `password-popup-${tabId}`;
		overlay.addEventListener("copy", (e) => e.preventDefault());
		overlay.addEventListener("paste", (e) => e.preventDefault());

		const popup = document.createElement("div");
		popup.className = "password-popup";

		const heading = document.createElement("h2");
		heading.textContent = `Enter the following ${msg.encryptionType} code`;

		const codeDisplay = document.createElement("div");
		codeDisplay.className = "password-code";
		codeDisplay.textContent = randomString;

		const input = document.createElement("input");
		input.type = "text";
		input.maxLength = encryptionLength;
		input.placeholder = `Type ${encryptionLength} characters`;
		input.className = "password-input";
		input.addEventListener("copy", (e) => e.preventDefault());
		input.addEventListener("paste", (e) => e.preventDefault());

		const buttonContainer = document.createElement("div");
		buttonContainer.className = "password-buttons";

		const submitBtn = document.createElement("button");
		submitBtn.textContent = "Submit";
		submitBtn.disabled = true;
		submitBtn.className = "password-submit";

		const closeBtn = document.createElement("button");
		closeBtn.textContent = "Close";
		closeBtn.className = "password-close";

		input.addEventListener("input", () => {
			if (input.value === randomString) {
				submitBtn.disabled = false;
				submitBtn.classList.add("active");
			} else {
				submitBtn.disabled = true;
				submitBtn.classList.remove("active");
			}
		});

		submitBtn.addEventListener("click", () => {
			sendResponse({ status: "success", verified: true });
			overlay.remove();
		});

		closeBtn.addEventListener("click", () => {
			sendResponse({ status: "closed", verified: false });
			overlay.remove();
		});

		buttonContainer.appendChild(submitBtn);
		buttonContainer.appendChild(closeBtn);

		popup.appendChild(heading);
		popup.appendChild(codeDisplay);
		popup.appendChild(input);
		popup.appendChild(buttonContainer);
		overlay.appendChild(popup);
		document.body.appendChild(overlay);
	}
};

export default passwordEncryption;
