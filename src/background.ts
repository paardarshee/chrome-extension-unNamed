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
});

chrome.action.onClicked.addListener(async (tab) => {
	if (tab) {
		registerTab(tab);
		const db = await getDB();
		// console.log("DB ready on click", db.name);
		// await db.put("settings", { key: "theme", value: "dark" });
		const value = await db.get("settings", "theme");
		console.log("Theme setting:", value);
	}
});

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
	if (changeInfo.status === "complete" && tab?.url) {
		registerTab(tab);
		whiteListBlocker(tabId, tab); // Check if the tab should be blocked
	}
});
