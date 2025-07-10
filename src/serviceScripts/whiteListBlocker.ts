import getDB from "../db";
const whiteListBlocker = async (tabId: number, tab: chrome.tabs.Tab) => {
	const db = await getDB();
	const whitelistMode = await db.get("settings", "whitelistEnabled");
	if (
		!tab.url ||
		(!tab.url.startsWith("http://") && !tab.url.startsWith("https://"))
	) {
		return;
	}
	if (whitelistMode.value) {
		const whitelist = await db.get("settings", "whitelistUrls");
		if (whitelist.value.length === 0) {
			// If whitelist is empty, do not block any tabs
			return;
		}
		// Extract the substring up to the third "/"
		const urlParts = tab.url.split("/");
		const baseUrl = urlParts.slice(0, 3).join("/");
		if (!whitelist.value.includes(baseUrl)) {
			// chrome.tabs.remove(tabId);
			const response = await chrome.tabs.sendMessage(tabId, {
				action: "blockTab",
				tabId: tab.id,
				url: tab.url,
			});
			console.log(response);
		}
	}
};

export default whiteListBlocker;
