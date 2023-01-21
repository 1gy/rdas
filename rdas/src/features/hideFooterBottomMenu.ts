export const applyHideFooterBottom = () => {
	const footerBottomMenu =
		document.querySelector<HTMLDivElement>(".footerBottomMenu");
	if (!footerBottomMenu) {
		return;
	}
	footerBottomMenu.style.display = "none";
};
