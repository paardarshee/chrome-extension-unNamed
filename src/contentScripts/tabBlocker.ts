const tabBlocker = (message: any, sendResponse: (response?: any) => void) => {
	const tabId = message.tabId;
	if (tabId !== undefined) {
		document.body.innerHTML = ``;
		const popUp = document.createElement("div");
		popUp.style = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; background: rgba(18, 18, 18, 0.4); /* Dark-tinted blur for contrast */ backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 12px; color: #ffffff; font-size: 28px; font-weight: 600; text-shadow: 0 2px 8px rgba(0, 0, 0, 0.6); padding: 40px; text-align: center; z-index: 9999;`;
		popUp.id = `block-popup-${tabId}`;
		popUp.innerHTML = `
                    <h1>Blocked</h1>
                    <p>This tab has been blocked.</p>
                    <p>URL: ${message.url}</p>
                `;
		document.body.appendChild(popUp);
		document.body.style.textAlign = "center";
		document.body.style.marginTop = "20%";
		sendResponse({ status: "blocked" });
	}
};

export default tabBlocker;
