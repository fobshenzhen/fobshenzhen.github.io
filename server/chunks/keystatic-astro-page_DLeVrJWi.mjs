globalThis.process ??= {};
globalThis.process.env ??= {};
import { n as __exportAll } from "./rolldown-runtime_BDykq6kg.mjs";
import { i as renderComponent, u as renderTemplate } from "./server_DoQItGMQ.mjs";
import { t as createComponent } from "./compiler_BydOYTK3.mjs";
//#region node_modules/@keystatic/astro/internal/keystatic-astro-page.astro
var keystatic_astro_page_exports = /* @__PURE__ */ __exportAll({
	default: () => $$KeystaticAstroPage,
	file: () => $$file,
	prerender: () => false,
	url: () => void 0
});
var $$KeystaticAstroPage = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${renderComponent($$result, "Keystatic", null, {
		"client:only": "react",
		"client:component-hydration": "only",
		"client:component-path": "/home/runner/work/company-website/company-website/node_modules/@keystatic/astro/internal/keystatic-page.js",
		"client:component-export": "Keystatic"
	})}`;
}, "/home/runner/work/company-website/company-website/node_modules/@keystatic/astro/internal/keystatic-astro-page.astro", void 0);
var $$file = "/home/runner/work/company-website/company-website/node_modules/@keystatic/astro/internal/keystatic-astro-page.astro";
//#endregion
//#region \0virtual:astro:page:node_modules/@keystatic/astro/internal/keystatic-astro-page@_@astro
var page = () => keystatic_astro_page_exports;
//#endregion
export { page };
