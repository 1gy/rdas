import { createElement } from "../libs/elements";
import { loadCompleted, saveCompleted } from "../libs/store";

export const applyGetCompleted = () => {
	const completed = loadCompleted();
	document.querySelectorAll("i.iconTextComplete").forEach((complete) => {
		const workId = complete
			.closest("div.itemModule")
			?.querySelector<HTMLInputElement>("[class=workId")?.value;
		if (workId) {
			completed.add(workId);
		}
	});
	saveCompleted(completed);
};

export const applyShowCompletedToCP = () => {
	const showComplete = (content: HTMLElement) => {
		content.style.position = "relative";
		content.append(
			createElement("div", (div) => {
				div.style.display = "flex";
				div.style.position = "absolute";
				div.style.left = "0";
				div.style.top = "0";
				div.style.width = "100%";
				div.style.height = "100%";
				div.style.boxSizing = "border-box";
				div.style.background = "rgba(0,0,0,.3)";
				div.style.border = "2px solid gray";
				div.style.pointerEvents = "none";
				div.style.justifyContent = "center";
				div.style.alignItems = "center";
				div.appendChild(
					createElement("i", (italic) => {
						italic.className = "icon iconTextComplete";
					}),
				);
			}),
		);
	};
	const checkAndShowCompleted = (
		completed: Set<string>,
		content: HTMLElement,
	) => {
		const workId = content
			.querySelector("a")
			?.href.match(".*?workId=(\\d+)")?.[1];
		if (workId && completed.has(workId)) {
			showComplete(content);
		}
	};

	const completed = loadCompleted();
	document
		.querySelectorAll<HTMLElement>(".contents1In0.itemModule.small")
		.forEach((content) => checkAndShowCompleted(completed, content));
	document
		.querySelectorAll<HTMLElement>(".lineup_list")
		.forEach((content) => checkAndShowCompleted(completed, content));
	document
		.querySelectorAll<HTMLElement>(".itemWrapper.smallBox.clearfix")
		.forEach((content) => checkAndShowCompleted(completed, content));
};
