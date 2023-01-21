import { createElement, createText } from "../libs/elements";

export const applyAddFooterMenu = () => {
	const footerMenu = document.querySelector(".footerMenu");
	if (!footerMenu) {
		return;
	}

	footerMenu.appendChild(
		createElement("li", (li) => {
			li.appendChild(
				createElement("a", (anchor) => {
					anchor.href = "CF/feature_index";
					anchor.appendChild(createText("*特集一覧*"));
					anchor.appendChild(
						createElement("i", (italic) => {
							italic.className = "icon iconArrowOrangeRight";
						}),
					);
				}),
			);
		}),
	);
};
