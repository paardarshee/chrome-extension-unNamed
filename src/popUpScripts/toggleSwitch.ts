const toggleSwitch = ({
	label,
	checked = false,
	onToggle,
	checkPasswordEncryption = false,
}: {
	label?: string;
	checked?: boolean;
	onToggle: () => Promise<void>;
	checkPasswordEncryption?: boolean;
}) => {
	const container = document.createElement("label");
	container.textContent = label || "Toggle";
	container.className = "toggle-switch";
	const input = document.createElement("input");
	input.type = "checkbox";
	input.checked = checked;
	const slider = document.createElement("span");
	slider.className = "slider";
	container.appendChild(input);
	container.appendChild(slider);

	const getState = () => input.checked;
	console.log("checked", input.checked);

	input.addEventListener("click", async (event) => {
		if (checkPasswordEncryption && input.checked) {
			console.log("entered password encryption check");
			console.log("checked", input.checked);
			console.log("checkPasswordEncryption", checkPasswordEncryption);
			event.preventDefault();
			const [tab] = await chrome.tabs.query({
				active: true,
				currentWindow: true,
			});
			if (!tab || !tab.id) {
				console.error("No active tab found");
				return;
			}
			const activeTab = await chrome.tabs.get(tab.id);
			if (!activeTab) {
				console.error("Active tab not found");
				return;
			}
			try {
				const res = await chrome.tabs.sendMessage(tab.id, {
					action: "checkPasswordEncryption",
					tabId: tab.id,
					encryptionType: "16-bit",
				});
				console.log("Response from checkPasswordEncryption:", res);
				if (res.verified) {
					input.checked = !input.checked;
					await onToggle();
				}
			} catch (error) {
				console.error("Error in password encryption check:", error);
				return;
			}
		} else {
			input.checked = !input.checked;
			await onToggle();
		}
	});

	return { container, getState };
};

export default toggleSwitch;
