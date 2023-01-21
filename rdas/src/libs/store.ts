export type Features = {
	addFooterMenu: boolean;
	hideFooterBottom: boolean;
	hideGoods: boolean;
	hideSong: boolean;
	showCompleted: boolean;
};

export type Settings = {
	features: Features;
};

const defaultSettings = (): Settings => ({
	features: {
		addFooterMenu: true,
		hideFooterBottom: true,
		hideGoods: true,
		hideSong: true,
		showCompleted: true,
	},
});

export const loadSettings = (): Settings => {
	try {
		const text = localStorage.getItem("@1gy/rdas/settings");
		if (text) {
			return JSON.parse(text);
		}
	} catch (err) {
		return defaultSettings();
	}
	return defaultSettings();
};

export const saveSettings = (settings: Settings) => {
	localStorage.setItem("@1gy/rdas/settings", JSON.stringify(settings));
};

export const loadCompleted = (): Set<string> => {
	try {
		const text = localStorage.getItem("@1gy/rdas/completed");
		if (text) {
			return new Set(JSON.parse(text));
		}
	} catch (err) {
		return new Set();
	}
	return new Set();
};

export const saveCompleted = (completed: Set<string>) => {
	localStorage.setItem("@1gy/rdas/completed", JSON.stringify([...completed]));
};
