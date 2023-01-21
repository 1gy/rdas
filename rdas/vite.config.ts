import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
import suidPlugin from "@suid/vite-plugin";
import devtools from "solid-devtools/vite";
import monkey from "vite-plugin-monkey";

export default defineConfig({
	plugins: [
		devtools(),
		suidPlugin(),
		solidPlugin(),
		monkey({
			entry: "src/main.ts",
			userscript: {
				name: "@1gy/rdas",
				namespace: "http://1gy.github.io",
				author: "1gy",
				description: "refined d-animestore",
				match: [
					"https://animestore.docomo.ne.jp/animestore/tp_pc",
					"https://animestore.docomo.ne.jp/animestore/mpa_cmp_pc*",
					"https://animestore.docomo.ne.jp/animestore/CP/*",
				],
			},
		}),
	],
});
