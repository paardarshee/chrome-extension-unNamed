import getDB from "./db";
const tabs: Record<number, chrome.tabs.Tab> = {};
import { handleActiveTabChange, whiteListBlocker } from "./serviceScripts";
const registerTab = (tab: chrome.tabs.Tab) => {
	console.log("Tab info:", tab);
	console.log("URL:", tab.url);
	tabs[tab.id!] = tab;
};

chrome.runtime.onInstalled.addListener(async () => {
	console.log("Extension installed");
	// perform some db operations to test
	const db = await getDB();
	console.log("DB ready on install", db.name);
	await db.put("settings", {
		key: "whitelistUrls",
		value: [],
	});
	await db.put("settings", { key: "whitelistEnabled", value: false });
	await db.put("settings", { key: "passwordEncryption", value: "None" });
	await db.put("settings", {
		key: "ExtensionWindowId",
		value: null,
	});
});

chrome.action.onClicked.addListener(async (tab) => {
	const db = await getDB();
	const extensionWindowId = await db.get("settings", "ExtensionWindowId");
	if (extensionWindowId.value) {
		// If the extension window is already open, focus it
		chrome.windows.update(extensionWindowId.value, { focused: true });
		return;
	}

	const popupWindow = await chrome.windows.create({
		url: "popup.html",
		type: "popup",
		width: 500,
		height: 600,
	});
	// Store the window ID in the database
	if (!popupWindow || !popupWindow.id) {
		console.error("Failed to create popup window");
		return;
	}
	await db.put("settings", {
		key: "ExtensionWindowId",
		value: popupWindow.id,
	});
});

chrome.windows.onRemoved.addListener(async (windowId) => {
	const db = await getDB();
	const extensionWindowId = await db.get("settings", "ExtensionWindowId");
	if (extensionWindowId.value === windowId) {
		// If the closed window is the extension popup, reset the stored window ID
		await db.put("settings", {
			key: "ExtensionWindowId",
			value: null,
		});
	}
});

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
	if (changeInfo.status === "complete" && tab?.url) {
		registerTab(tab);
		whiteListBlocker(tabId, tab); // Check if the tab should be blocked
	}
});
