globalThis.process ??= {};
globalThis.process.env ??= {};
import { n as __exportAll } from "./rolldown-runtime_BDykq6kg.mjs";
import { S as createAstro, f as renderHead, p as addAttribute, u as renderTemplate } from "./server_DoQItGMQ.mjs";
import { t as createComponent } from "./compiler_BydOYTK3.mjs";
import { t as getInquiryRepository } from "./factory_DBfNMZuQ.mjs";
import { env } from "cloudflare:workers";
//#region src/pages/admin/inquiries/index.astro
var inquiries_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Index,
	file: () => $$file,
	prerender: () => false,
	url: () => $$url
});
createAstro("http://kinsaimachining.xg102.yjkj2026.cn");
var $$Index = createComponent(async ($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Index;
	const url = new URL(Astro.request.url);
	const page = Math.max(1, Number(url.searchParams.get("page") ?? "1") || 1);
	const limit = 20;
	const statusFilter = url.searchParams.get("status") ?? "";
	const db = env.DB;
	const repository = getInquiryRepository(db);
	const filter = {};
	if (statusFilter === "new" || statusFilter === "read" || statusFilter === "replied" || statusFilter === "archived") filter.status = statusFilter;
	const search = url.searchParams.get("search")?.trim();
	if (search) filter.search = search;
	const result = await repository.findAll(filter, page, limit);
	const stats = await repository.getStats();
	const statusOptions = [
		{
			value: "new",
			label: "新询盘"
		},
		{
			value: "read",
			label: "已读"
		},
		{
			value: "replied",
			label: "已回复"
		},
		{
			value: "archived",
			label: "已归档"
		}
	];
	function formatDate(dateStr) {
		const d = new Date(dateStr);
		if (isNaN(d.getTime())) return dateStr;
		return d.toLocaleString("zh-CN", { hour12: false });
	}
	function buildQuery(overrides) {
		const q = new URLSearchParams();
		const current = url.searchParams;
		for (const key of ["status", "search"]) {
			const v = current.get(key);
			if (v) q.set(key, v);
		}
		for (const [key, value] of Object.entries(overrides)) if (value) q.set(key, value);
		else q.delete(key);
		const qs = q.toString();
		return qs ? `?${qs}` : "";
	}
	return renderTemplate`<html lang="zh-CN" data-astro-cid-wc5kpeii><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta name="robots" content="noindex, nofollow"><title>询盘管理 - Kinsai Admin</title>${renderHead($$result)}</head><body data-astro-cid-wc5kpeii><div class="container" data-astro-cid-wc5kpeii><div class="header" data-astro-cid-wc5kpeii><h1 data-astro-cid-wc5kpeii>📋 询盘管理</h1><a class="back" href="/admin" data-astro-cid-wc5kpeii>← 返回后台</a></div><div class="stats" data-astro-cid-wc5kpeii><div class="stat" data-astro-cid-wc5kpeii><div class="num" data-astro-cid-wc5kpeii>${stats.total}</div><div class="label" data-astro-cid-wc5kpeii>全部</div></div><div class="stat" data-astro-cid-wc5kpeii><div class="num" data-astro-cid-wc5kpeii>${stats.new}</div><div class="label" data-astro-cid-wc5kpeii>新询盘</div></div><div class="stat" data-astro-cid-wc5kpeii><div class="num" data-astro-cid-wc5kpeii>${stats.read}</div><div class="label" data-astro-cid-wc5kpeii>已读</div></div><div class="stat" data-astro-cid-wc5kpeii><div class="num" data-astro-cid-wc5kpeii>${stats.replied}</div><div class="label" data-astro-cid-wc5kpeii>已回复</div></div><div class="stat" data-astro-cid-wc5kpeii><div class="num" data-astro-cid-wc5kpeii>${stats.archived}</div><div class="label" data-astro-cid-wc5kpeii>已归档</div></div></div><div class="filters" data-astro-cid-wc5kpeii><a class="filter-btn {!statusFilter ? 'active' : ''}"${addAttribute(buildQuery({ status: null }), "href")} data-astro-cid-wc5kpeii>全部</a>${statusOptions.map((opt) => renderTemplate`<a class="filter-btn {statusFilter === opt.value ? 'active' : ''}"${addAttribute(buildQuery({ status: opt.value }), "href")} data-astro-cid-wc5kpeii>${opt.label}</a>`)}<form class="search-form" method="get" action="/admin/inquiries" data-astro-cid-wc5kpeii><input type="text" name="search" placeholder="搜索姓名、邮箱或内容…"${addAttribute(search ?? "", "value")} data-astro-cid-wc5kpeii>${statusFilter ? renderTemplate`<input type="hidden" name="status"${addAttribute(statusFilter, "value")} data-astro-cid-wc5kpeii>` : null}<button type="submit" data-astro-cid-wc5kpeii>搜索</button></form></div>${result.data.length === 0 ? renderTemplate`<div class="empty" data-astro-cid-wc5kpeii>暂无询盘记录</div>` : renderTemplate`<table data-astro-cid-wc5kpeii><thead data-astro-cid-wc5kpeii><tr data-astro-cid-wc5kpeii><th data-astro-cid-wc5kpeii>ID</th><th data-astro-cid-wc5kpeii>姓名</th><th data-astro-cid-wc5kpeii>邮箱</th><th data-astro-cid-wc5kpeii>公司</th><th data-astro-cid-wc5kpeii>状态</th><th data-astro-cid-wc5kpeii>提交时间</th></tr></thead><tbody data-astro-cid-wc5kpeii>${result.data.map((inquiry) => renderTemplate`<tr data-astro-cid-wc5kpeii><td data-astro-cid-wc5kpeii>#${inquiry.id}</td><td data-astro-cid-wc5kpeii><a class="row-link"${addAttribute(`/admin/inquiries/${inquiry.id}`, "href")} data-astro-cid-wc5kpeii>${inquiry.name}</a></td><td data-astro-cid-wc5kpeii>${inquiry.email}</td><td data-astro-cid-wc5kpeii>${inquiry.company ?? "-"}</td><td data-astro-cid-wc5kpeii><span${addAttribute(`badge badge-${inquiry.status}`, "class")} data-astro-cid-wc5kpeii>${statusOptions.find((o) => o.value === inquiry.status)?.label ?? inquiry.status}</span></td><td data-astro-cid-wc5kpeii>${formatDate(inquiry.created_at)}</td></tr>`)}</tbody></table>`}${result.total_pages > 1 ? renderTemplate`<div class="pagination" data-astro-cid-wc5kpeii>${page > 1 ? renderTemplate`<a${addAttribute(buildQuery({ page: String(page - 1) }), "href")} data-astro-cid-wc5kpeii>← 上一页</a>` : null}${page < result.total_pages ? renderTemplate`<a${addAttribute(buildQuery({ page: String(page + 1) }), "href")} data-astro-cid-wc5kpeii>下一页 →</a>` : null}<span class="info" data-astro-cid-wc5kpeii>共 ${result.total} 条 · 第 ${page}/${result.total_pages} 页</span></div>` : null}</div></body></html>`;
}, "/home/runner/work/company-website/company-website/src/pages/admin/inquiries/index.astro", void 0);
var $$file = "/home/runner/work/company-website/company-website/src/pages/admin/inquiries/index.astro";
var $$url = "/admin/inquiries";
//#endregion
//#region \0virtual:astro:page:src/pages/admin/inquiries/index@_@astro
var page = () => inquiries_exports;
//#endregion
export { page };
