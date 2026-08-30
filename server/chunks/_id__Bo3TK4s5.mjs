globalThis.process ??= {};
globalThis.process.env ??= {};
import { n as __exportAll } from "./rolldown-runtime_BDykq6kg.mjs";
import { S as createAstro, a as Fragment, f as renderHead, i as renderComponent, m as createRenderInstruction, p as addAttribute, u as renderTemplate } from "./server_DoQItGMQ.mjs";
import { t as createComponent } from "./compiler_BydOYTK3.mjs";
import { t as getInquiryRepository } from "./factory_DBfNMZuQ.mjs";
import { env } from "cloudflare:workers";
//#region node_modules/astro/dist/runtime/server/render/script.js
async function renderScript(result, id) {
	const inlined = result.inlinedScripts.get(id);
	let content = "";
	if (inlined != null) {
		if (inlined) content = `<script type="module">${inlined}<\/script>`;
	} else {
		const resolved = await result.resolve(id);
		content = `<script type="module" src="${result.userAssetsBase ? (result.base === "/" ? "" : result.base) + result.userAssetsBase : ""}${resolved}"><\/script>`;
	}
	return createRenderInstruction({
		type: "script",
		id,
		content
	});
}
//#endregion
//#region src/pages/admin/inquiries/[id].astro
var _id__exports = /* @__PURE__ */ __exportAll({
	default: () => $$Id,
	file: () => $$file,
	prerender: () => false,
	url: () => $$url
});
createAstro("http://kinsaimachining.xg102.yjkj2026.cn");
var $$Id = createComponent(async ($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Id;
	const id = Number(Astro.params.id);
	const db = env.DB;
	const repository = getInquiryRepository(db);
	const inquiry = id && Number.isInteger(id) ? await repository.findById(id) : null;
	const statusOptions = [
		{
			value: "new",
			label: "新询盘",
			color: "#1e40af"
		},
		{
			value: "read",
			label: "已读",
			color: "#4b5563"
		},
		{
			value: "replied",
			label: "已回复",
			color: "#166534"
		},
		{
			value: "archived",
			label: "已归档",
			color: "#92400e"
		}
	];
	function formatDate(dateStr) {
		const d = new Date(dateStr);
		if (isNaN(d.getTime())) return dateStr;
		return d.toLocaleString("zh-CN", { hour12: false });
	}
	function escapeHtml(str) {
		return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
	}
	return renderTemplate`<html lang="zh-CN" data-astro-cid-ryf3tmic><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta name="robots" content="noindex, nofollow"><title>${inquiry ? `询盘 #${inquiry.id} - Kinsai Admin` : "询盘不存在 - Kinsai Admin"}</title>${renderHead($$result)}</head><body data-astro-cid-ryf3tmic><div class="container" data-astro-cid-ryf3tmic><div class="header" data-astro-cid-ryf3tmic><h1 data-astro-cid-ryf3tmic>${inquiry ? `询盘 #${inquiry.id}` : "询盘不存在"}</h1><a class="back" href="/admin/inquiries" data-astro-cid-ryf3tmic>← 返回列表</a></div>${!inquiry ? renderTemplate`<div class="empty" data-astro-cid-ryf3tmic><p data-astro-cid-ryf3tmic>询盘不存在或已被删除</p></div>` : renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result) => renderTemplate`<div class="card" data-astro-cid-ryf3tmic><div class="field" data-astro-cid-ryf3tmic><span class="label" data-astro-cid-ryf3tmic>姓名</span><span class="value" data-astro-cid-ryf3tmic>${escapeHtml(inquiry.name)}</span></div><div class="field" data-astro-cid-ryf3tmic><span class="label" data-astro-cid-ryf3tmic>邮箱</span><span class="value" data-astro-cid-ryf3tmic>${escapeHtml(inquiry.email)}</span></div><div class="field" data-astro-cid-ryf3tmic><span class="label" data-astro-cid-ryf3tmic>电话</span><span class="value" data-astro-cid-ryf3tmic>${inquiry.phone ?? "-"}</span></div><div class="field" data-astro-cid-ryf3tmic><span class="label" data-astro-cid-ryf3tmic>WhatsApp</span><span class="value" data-astro-cid-ryf3tmic>${inquiry.whatsapp ?? "-"}</span></div><div class="field" data-astro-cid-ryf3tmic><span class="label" data-astro-cid-ryf3tmic>公司</span><span class="value" data-astro-cid-ryf3tmic>${inquiry.company ?? "-"}</span></div><div class="field" data-astro-cid-ryf3tmic><span class="label" data-astro-cid-ryf3tmic>询盘内容</span><span class="value" data-astro-cid-ryf3tmic>${escapeHtml(inquiry.message)}</span></div>${inquiry.file_url ? renderTemplate`<div class="field" data-astro-cid-ryf3tmic><span class="label" data-astro-cid-ryf3tmic>附件</span><span class="value" data-astro-cid-ryf3tmic><a${addAttribute(inquiry.file_url, "href")} target="_blank" rel="noopener noreferrer" data-astro-cid-ryf3tmic>${inquiry.file_name ?? "下载附件"}</a></span></div>` : null}<div class="field" data-astro-cid-ryf3tmic><span class="label" data-astro-cid-ryf3tmic>提交时间</span><span class="value" data-astro-cid-ryf3tmic>${formatDate(inquiry.created_at)}</span></div><div class="field" data-astro-cid-ryf3tmic><span class="label" data-astro-cid-ryf3tmic>IP</span><span class="value" data-astro-cid-ryf3tmic>${inquiry.ip ?? "-"}</span></div></div><div class="card" data-astro-cid-ryf3tmic><div class="status-bar" data-astro-cid-ryf3tmic>${statusOptions.map((opt) => renderTemplate`<button class="status-btn {inquiry.status === opt.value ? 'active' : ''}"${addAttribute(opt.value, "data-status")}${addAttribute(inquiry.id, "data-id")}${addAttribute(`window.updateStatus(${inquiry.id}, '${opt.value}')`, "onclick")} data-astro-cid-ryf3tmic>${opt.label}</button>`)}<button class="delete-btn"${addAttribute(`window.deleteInquiry(${inquiry.id})`, "onclick")} data-astro-cid-ryf3tmic>删除询盘</button></div></div>` })}`}</div>${renderScript($$result, "/home/runner/work/company-website/company-website/src/pages/admin/inquiries/[id].astro?astro&type=script&index=0&lang.ts")}</body></html>`;
}, "/home/runner/work/company-website/company-website/src/pages/admin/inquiries/[id].astro", void 0);
var $$file = "/home/runner/work/company-website/company-website/src/pages/admin/inquiries/[id].astro";
var $$url = "/admin/inquiries/[id]";
//#endregion
//#region \0virtual:astro:page:src/pages/admin/inquiries/[id]@_@astro
var page = () => _id__exports;
//#endregion
export { page };
