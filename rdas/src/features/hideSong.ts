export const applyHideSong = () => {
	const songWrapper = document.querySelector<HTMLDivElement>(".songWrapper");
	if (!songWrapper) {
		return;
	}
	songWrapper.style.display = "none";
};
