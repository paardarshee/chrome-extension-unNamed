import { openDB } from "idb";

const dbPromise = openDB("MyExtensionDB", 1, {
	upgrade(db) {
		if (!db.objectStoreNames.contains("settings")) {
			db.createObjectStore("settings", { keyPath: "key" });
		}
	},
});

function getDB() {
	return dbPromise;
}

export default getDB;
