/* @refresh reload */
import { Component, createSignal } from "solid-js";
import { render } from "solid-js/web";
import { createElement } from "./libs/elements";
import { SettingsDialog } from "./pages/Setttings";

export const Wrapper: Component = () => {
	const [open, setOpen] = createSignal(false);
	const handleClick = () => {
		setOpen(true);
	};
	return (
		<>
			{/* rome-ignore lint/a11y/useValidAnchor: javascript:void */}
			<a href="javascript:void(0)" onClick={handleClick}>
				{"*rdas設定*"}
				<i class="icon iconArrowOrangeRight" />
			</a>
			<SettingsDialog open={open()} setOpen={(v) => setOpen(v)} />
		</>
	);
};

export const applySettings = () => {
	const footerMenu = document.querySelector(".footerMenu");
	if (!footerMenu) {
		return;
	}

	footerMenu.appendChild(
		createElement("li", (li) => {
			render(() => <Wrapper />, li);
		}),
	);
};
