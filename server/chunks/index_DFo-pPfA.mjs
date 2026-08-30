globalThis.process ??= {};
globalThis.process.env ??= {};
import { n as __exportAll } from "./rolldown-runtime_BDykq6kg.mjs";
import { f as renderHead, u as renderTemplate } from "./server_DoQItGMQ.mjs";
import { t as createComponent } from "./compiler_BydOYTK3.mjs";
//#region src/pages/admin/index.astro
var admin_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Index,
	file: () => $$file,
	prerender: () => false,
	url: () => $$url
});
var $$Index = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`<html lang="en" data-astro-cid-nsou3le4><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta name="robots" content="noindex, nofollow"><title>Admin - Kinsai Machining</title>${renderHead($$result)}</head><body data-astro-cid-nsou3le4><div class="container" data-astro-cid-nsou3le4><h1 data-astro-cid-nsou3le4>Admin</h1><p class="subtitle" data-astro-cid-nsou3le4>Kinsai Machining 管理后台</p><div class="grid" data-astro-cid-nsou3le4><a class="card" href="/admin/inquiries" data-astro-cid-nsou3le4><div class="icon" data-astro-cid-nsou3le4>📋</div><h2 data-astro-cid-nsou3le4>询盘管理</h2><p data-astro-cid-nsou3le4>查看、处理、归档客户提交的询盘记录</p></a><a class="card" href="/keystatic" data-astro-cid-nsou3le4><div class="icon" data-astro-cid-nsou3le4>📝</div><h2 data-astro-cid-nsou3le4>内容管理</h2><p data-astro-cid-nsou3le4>编辑产品、文章、页面等站点内容（Keystatic CMS）</p></a></div></div></body></html>`;
}, "/home/runner/work/company-website/company-website/src/pages/admin/index.astro", void 0);
var $$file = "/home/runner/work/company-website/company-website/src/pages/admin/index.astro";
var $$url = "/admin";
//#endregion
//#region \0virtual:astro:page:src/pages/admin/index@_@astro
var page = () => admin_exports;
//#endregion
export { page };
