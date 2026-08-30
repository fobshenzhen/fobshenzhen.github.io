globalThis.process ??= {};
globalThis.process.env ??= {};
import { n as __exportAll } from "./rolldown-runtime_BDykq6kg.mjs";
import { t as getInquiryRepository } from "./factory_DBfNMZuQ.mjs";
import { env } from "cloudflare:workers";
//#region src/pages/api/admin/inquiries.ts
var inquiries_exports = /* @__PURE__ */ __exportAll({ GET: () => GET });
var JSON_HEADERS = { "Content-Type": "application/json" };
function json(data, status) {
	return new Response(JSON.stringify(data), {
		status,
		headers: JSON_HEADERS
	});
}
var GET = async ({ url }) => {
	try {
		const db = env.DB;
		const repository = getInquiryRepository(db);
		const params = url.searchParams;
		const page = Math.max(1, Number(params.get("page") ?? "1") || 1);
		const limit = Math.min(100, Math.max(1, Number(params.get("limit") ?? "20") || 20));
		const filter = {};
		const status = params.get("status");
		if (status === "new" || status === "read" || status === "replied" || status === "archived") filter.status = status;
		const search = params.get("search")?.trim();
		if (search) filter.search = search;
		const dateFrom = params.get("date_from");
		if (dateFrom) {
			const d = new Date(dateFrom);
			if (!isNaN(d.getTime())) filter.date_from = d;
		}
		const dateTo = params.get("date_to");
		if (dateTo) {
			const d = new Date(dateTo);
			if (!isNaN(d.getTime())) filter.date_to = d;
		}
		return json({
			success: true,
			...await repository.findAll(filter, page, limit)
		}, 200);
	} catch (error) {
		console.error("[api/admin/inquiries] 查询询盘列表失败:", error);
		return json({
			success: false,
			error: "服务器错误，请稍后重试"
		}, 500);
	}
};
//#endregion
//#region \0virtual:astro:page:src/pages/api/admin/inquiries@_@ts
var page = () => inquiries_exports;
//#endregion
export { page };
