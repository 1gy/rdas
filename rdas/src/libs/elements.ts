export const createText = (text: string) => document.createTextNode(text);

export const createElement = <K extends keyof HTMLElementTagNameMap>(
	tagName: K,
	operation?: (element: HTMLElementTagNameMap[K]) => void,
) => {
	const element = document.createElement(tagName);
	operation?.(element);
	return element;
};
