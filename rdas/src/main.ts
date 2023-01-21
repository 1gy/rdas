import { applyAddFooterMenu } from "./features/addFooterMenu";
import { applyHideFooterBottom } from "./features/hideFooterBottomMenu";
import { applyHideGoods } from "./features/hideGoods";
import { applyHideSong } from "./features/hideSong";
import {
	applyGetCompleted,
	applyShowCompletedToCP,
} from "./features/showCompleted";
import { loadSettings } from "./libs/store";
import { applySettings } from "./settings";

const settings = loadSettings();

if (
	location.href.includes("https://animestore.docomo.ne.jp/animestore/tp_pc")
) {
	applySettings();

	if (settings.features?.addFooterMenu) {
		applyAddFooterMenu();
	}
	if (settings.features?.hideFooterBottom) {
		applyHideFooterBottom();
	}
	if (settings.features?.hideGoods) {
		applyHideGoods();
	}
	if (settings.features?.hideSong) {
		applyHideSong();
	}
}

if (
	location.href.includes(
		"https://animestore.docomo.ne.jp/animestore/mpa_cmp_pc",
	)
) {
	if (settings.features?.showCompleted) {
		applyGetCompleted();
	}
}

if (location.href.includes("https://animestore.docomo.ne.jp/animestore/CP/")) {
	if (settings.features?.showCompleted) {
		applyShowCompletedToCP();
	}
}

if (
	location.href.includes(
		"https://animestore.docomo.ne.jp/animestore/sc_d_pc?partId=*",
	)
) {
	//
}
