import { whiteListBlocker } from ".";
chrome.tabs.onActivated.addListener(({ tabId, windowId }) => {
	handleActiveTabChange(tabId, windowId);
});

chrome.windows.onFocusChanged.addListener((windowId) => {
	if (windowId !== chrome.windows.WINDOW_ID_NONE) {
		chrome.tabs.query({ active: true, windowId }, ([tab]) => {
			if (tab) handleActiveTabChange(tab.id as number, windowId);
		});
	}
});

export default function handleActiveTabChange(tabId: number, windowId: number) {
	chrome.tabs.get(tabId, (tab) => {
		whiteListBlocker(tabId, tab);
	});
}
