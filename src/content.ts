import { tabBlocker } from "./contentScripts";

chrome.runtime.onMessage.addListener(
	(
		message: any,
		sender: chrome.runtime.MessageSender,
		sendResponse: (response?: any) => void
	) => {
		console.log("Received message:", message, "from sender:", sender);
		if (message.action === "blockTab") {
			tabBlocker(message, sendResponse);
			return false;
		} else {
			return false;
		}
	}
);
