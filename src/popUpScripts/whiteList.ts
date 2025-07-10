import getDB from "../db";
import { toggleSwitch } from ".";

const WhitelistContent = async () => {
	const db = await getDB();

	const whitelistUrls: {
		key: string;
		value: string[];
	} = await db.get("settings", "whitelistUrls");

	const whitelistEnabled: {
		key: string;
		value: boolean;
	} = await db.get("settings", "whitelistEnabled");

	// Root container
	const whiteListContainer = document.createElement("div");

	// Input and Add button (initially hidden/shown dynamically)
	const input = document.createElement("input");
	input.type = "text";
	input.placeholder = "Add new URL";

	const addButton = document.createElement("button");
	addButton.textContent = "Add URL";

	// UL for URL list
	const urlList = document.createElement("ul");

	// Utility function to render the list
	const renderList = () => {
		urlList.innerHTML = ""; // Clear existing list

		whitelistUrls.value.forEach((url, index) => {
			const listItem = document.createElement("li");

			const urlText = document.createElement("span");
			urlText.textContent = url;

			const deleteBtn = document.createElement("button");
			deleteBtn.textContent = "🗑️";
			deleteBtn.style.marginLeft = "10px";
			deleteBtn.onclick = async () => {
				whitelistUrls.value.splice(index, 1);
				await db.put("settings", whitelistUrls);
				renderList();
			};

			listItem.appendChild(urlText);
			listItem.appendChild(deleteBtn);
			urlList.appendChild(listItem);
		});
	};

	// Add URL logic
	addButton.onclick = async () => {
		const urlParts = input.value.trim().split("/");
		const newUrl = urlParts.length > 2 ? `${urlParts[0]}//${urlParts[2]}` : "";

		if (newUrl && !whitelistUrls.value.includes(newUrl)) {
			whitelistUrls.value.push(newUrl);
			await db.put("settings", whitelistUrls);
			renderList();
			input.value = "";
		}
	};

	// Toggle logic
	const onToggle = async () => {
		const newState = toggle.getState();
		await db.put("settings", { key: "whitelistEnabled", value: newState });

		// Dynamically add or remove input/button based on toggle
		if (newState) {
			whiteListContainer.insertBefore(input, urlList);
			whiteListContainer.insertBefore(addButton, urlList);
		} else {
			input.remove();
			addButton.remove();
		}
	};

	const toggle = toggleSwitch({
		label: "Enable Whitelist",
		checked: whitelistEnabled.value,
		onToggle: onToggle,
		checkPasswordEncryption: true,
	});

	// Add elements to container
	whiteListContainer.appendChild(toggle.container);
	if (whitelistEnabled.value) {
		whiteListContainer.appendChild(input);
		whiteListContainer.appendChild(addButton);
	}
	whiteListContainer.appendChild(urlList);

	// Initial render of the list
	renderList();

	return whiteListContainer;
};

export default WhitelistContent;
