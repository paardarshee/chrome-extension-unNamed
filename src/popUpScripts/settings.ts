import { toggleSwitch } from ".";
import getDB from "../db";

const passwordEncryptionSettingContainer = async () => {
	const db = await getDB();
	const passwordEncryption = await db.get("settings", "passwordEncryption");

	//create a dropdown for password encryption options named "passwordEncryption" and values from an array
	const passwordEncryptionContainer = document.createElement("div");
	const passwordEncryptionLabel = document.createElement("label");
	passwordEncryptionLabel.textContent = "Password Encryption";
	const passwordEncryptionSelect = document.createElement("select");
	const options = ["None", "16-bit", "32-bit", "64-bit"];
	options.forEach((option) => {
		const opt = document.createElement("option");
		opt.value = option;
		opt.textContent = option;
		passwordEncryptionSelect.appendChild(opt);
	});
	passwordEncryptionSelect.value = passwordEncryption.value;

	passwordEncryptionSelect.onchange = async () => {
		passwordEncryption.value = passwordEncryptionSelect.value;
		await db.put("settings", passwordEncryption);
	};

	passwordEncryptionContainer.appendChild(passwordEncryptionLabel);
	passwordEncryptionContainer.appendChild(passwordEncryptionSelect);
	return passwordEncryptionContainer;
};

const settingsContent = async () => {
	const settingsContainer = document.createElement("div");
	const db = await getDB();

	//for Password Container
	settingsContainer.appendChild(await passwordEncryptionSettingContainer());

	return settingsContainer;
};

export default settingsContent;
