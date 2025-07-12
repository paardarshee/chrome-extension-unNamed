import { toggleSwitch, passwordEncryptionSettingContainer } from ".";
import getDB from "../db";

const settingsContent = async () => {
	const settingsContainer = document.createElement("div");
	const db = await getDB();

	//for Password Container
	settingsContainer.appendChild(await passwordEncryptionSettingContainer());

	return settingsContainer;
};

export default settingsContent;
