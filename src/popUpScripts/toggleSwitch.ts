import { bypassToggle } from ".";
import getDB from "../db";
const toggleSwitch = ({
	label,
	checked = false,
	onToggle,
	checkPasswordEncryption = false,
}: {
	label?: string;
	checked?: boolean;
	onToggle: () => Promise<void>;
	checkPasswordEncryption?: boolean;
}) => {
	const container = document.createElement("label");
	container.textContent = label || "Toggle";
	container.className = "toggle-switch";
	const input = document.createElement("button");
	input.ariaPressed = checked ? "true" : "false";
	const slider = document.createElement("span");
	slider.className = "slider";
	container.appendChild(input);
	container.appendChild(slider);

	const getState = () => input.ariaPressed === "true";
	console.log("checked", input.ariaPressed);

	input.addEventListener("click", async (event) => {
		const db = await getDB();
		const passwordEncryption = await db.get("settings", "passwordEncryption");
		if (
			checkPasswordEncryption &&
			input.ariaPressed === "true" &&
			passwordEncryption.value !== "None"
		) {
			event.preventDefault();
			const onToggleOff = async () => {
				input.ariaPressed = input.ariaPressed === "true" ? "false" : "true";
				await onToggle();
			};
			bypassToggle(passwordEncryption.value, onToggleOff);
		} else {
			input.ariaPressed = input.ariaPressed === "true" ? "false" : "true";
			await onToggle();
		}
	});

	return { container, getState };
};

export default toggleSwitch;
