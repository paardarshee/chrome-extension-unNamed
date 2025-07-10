import getDB from "./db";
// --- Simulate async tab content ---

import { WhitelistContent, settingsContent } from "./popUpUI";

// --- Tab config ---
const tabs = [
	{ id: "whitelist", label: "Whitelist", loader: WhitelistContent },
	{ id: "settings", label: "Settings", loader: settingsContent },
];

let currentTabId = "settings";
let tabContentContainer = document.getElementById("tab-content");

function renderTabs() {
	const tabButtons = document.getElementById("tab-buttons");
	tabButtons &&
		tabs.forEach((tab) => {
			const btn = document.createElement("button");
			btn.textContent = tab.label;
			btn.onclick = () => switchTab(tab.id);
			tabButtons.appendChild(btn);
		});
}

async function switchTab(tabId: string) {
	if (tabId === currentTabId) return;

	// Clear previous content
	if (!tabContentContainer) {
		return;
	}
	tabContentContainer.innerHTML = "";
	currentTabId = tabId;

	const tab = tabs.find((t) => t.id === tabId);
	if (!tab) return;

	const contentNode = await tab.loader();
	tabContentContainer.appendChild(contentNode);
}

// --- Initial render ---
renderTabs();
switchTab(tabs[0].id); // Default to first tab
