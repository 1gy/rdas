export const applyHideGoods = () => {
	const goodsWrapper =
		document.querySelector<HTMLDivElement>(".goodsTopWrapper");
	if (!goodsWrapper) {
		return;
	}
	goodsWrapper.style.display = "none";
};
