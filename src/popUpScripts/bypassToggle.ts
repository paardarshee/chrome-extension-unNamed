const bypassToggle = (
	encryptionType: "16-bit" | "32-bit" | "48-bit",
	onClick: () => Promise<void>
) => {
	// Generate random string
	const lengthMap = {
		"16-bit": 16,
		"32-bit": 32,
		"48-bit": 64,
	};

	const generateRandomString = (length: number) => {
		const chars =
			"!@#$%^&*()_+-=[]{}|;:',.<>?/~`ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:',.<>?/~`";
		return Array.from(
			{ length },
			() => chars[Math.floor(Math.random() * chars.length)]
		).join("");
	};

	const encryptionLength = lengthMap[encryptionType];
	const randomString = "pass"; // For testing purposes, you can replace this with the actual random string generation
	// const randomString = generateRandomString(encryptionLength);

	// Add CSS styles

	// Create popup container
	const overlay = document.createElement("div");
	overlay.className = "bypass-toggle-overlay";
	overlay.addEventListener("copy", (e) => e.preventDefault());
	overlay.addEventListener("paste", (e) => e.preventDefault());

	const popup = document.createElement("div");
	popup.className = "bypass-toggle-popup";

	const heading = document.createElement("h2");
	heading.textContent = `Enter the following ${encryptionType} code`;

	const codeDisplay = document.createElement("div");
	codeDisplay.className = "bypass-toggle-code";
	codeDisplay.textContent = randomString;

	const input = document.createElement("input");
	input.type = "text";
	input.maxLength = encryptionLength;
	input.style.width = `${encryptionLength * 7}px`;
	input.placeholder = `Type ${encryptionLength} characters`;
	input.className = "bypass-toggle-input";
	input.addEventListener("copy", (e) => e.preventDefault());
	input.addEventListener("paste", (e) => e.preventDefault());

	const buttonContainer = document.createElement("div");
	buttonContainer.className = "bypass-toggle-buttons";

	const submitBtn = document.createElement("button");
	submitBtn.textContent = "Submit";
	submitBtn.disabled = true;
	submitBtn.className = "bypass-toggle-submit";

	const closeBtn = document.createElement("button");
	closeBtn.textContent = "Close";
	closeBtn.className = "bypass-toggle-close";

	input.addEventListener("input", () => {
		if (input.value === randomString) {
			submitBtn.disabled = false;
			submitBtn.classList.add("active");
		} else {
			submitBtn.disabled = true;
			submitBtn.classList.remove("active");
		}
	});

	submitBtn.addEventListener("click", async () => {
		await onClick();
		overlay.remove();
	});

	closeBtn.addEventListener("click", () => {
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
};

export default bypassToggle;
