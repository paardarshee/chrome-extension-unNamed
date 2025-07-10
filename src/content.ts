import { tabBlocker, passwordEncryption } from "./contentScripts";

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
		} else if (message.action === "checkPasswordEncryption") {
			// console.log("Entered Password Encryption Check");
			passwordEncryption(message, sendResponse);
			return true;
		} else {
			return false;
		}
	}
);
