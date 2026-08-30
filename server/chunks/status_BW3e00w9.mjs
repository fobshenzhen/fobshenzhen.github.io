globalThis.process ??= {};
globalThis.process.env ??= {};
import { n as __exportAll } from "./rolldown-runtime_BDykq6kg.mjs";
import { t as getInquiryRepository } from "./factory_DBfNMZuQ.mjs";
import { env } from "cloudflare:workers";
//#region src/pages/api/admin/inquiries/[id]/status.ts
var status_exports = /* @__PURE__ */ __exportAll({ PUT: () => PUT });
var JSON_HEADERS = { "Content-Type": "application/json" };
function json(data, status) {
	return new Response(JSON.stringify(data), {
		status,
		headers: JSON_HEADERS
	});
}
var VALID_STATUSES = [
	"new",
	"read",
	"replied",
	"archived"
];
var PUT = async ({ params, request }) => {
	try {
		const id = Number(params.id);
		if (!Number.isInteger(id) || id <= 0) return json({
			success: false,
			error: "无效的询盘 ID"
		}, 400);
		let body;
		try {
			body = await request.json();
		} catch {
			return json({
				success: false,
				error: "无效的请求体"
			}, 400);
		}
		const status = body.status;
		if (!VALID_STATUSES.includes(status)) return json({
			success: false,
			error: `状态必须是 ${VALID_STATUSES.join("、")} 之一`
		}, 400);
		const db = env.DB;
		return json({
			success: true,
			data: await getInquiryRepository(db).updateStatus(id, status)
		}, 200);
	} catch (error) {
		console.error("[api/admin/inquiries/[id]/status] 更新状态失败:", error);
		return json({
			success: false,
			error: "服务器错误，请稍后重试"
		}, 500);
	}
};
//#endregion
//#region \0virtual:astro:page:src/pages/api/admin/inquiries/[id]/status@_@ts
var page = () => status_exports;
//#endregion
export { page };
