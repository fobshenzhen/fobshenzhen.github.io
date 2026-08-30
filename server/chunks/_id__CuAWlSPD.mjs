globalThis.process ??= {};
globalThis.process.env ??= {};
import { n as __exportAll } from "./rolldown-runtime_BDykq6kg.mjs";
import { t as getInquiryRepository } from "./factory_DBfNMZuQ.mjs";
import { env } from "cloudflare:workers";
//#region src/pages/api/admin/inquiries/[id].ts
var _id__exports = /* @__PURE__ */ __exportAll({
	DELETE: () => DELETE,
	GET: () => GET
});
var JSON_HEADERS = { "Content-Type": "application/json" };
function json(data, status) {
	return new Response(JSON.stringify(data), {
		status,
		headers: JSON_HEADERS
	});
}
var GET = async ({ params }) => {
	try {
		const id = Number(params.id);
		if (!Number.isInteger(id) || id <= 0) return json({
			success: false,
			error: "无效的询盘 ID"
		}, 400);
		const db = env.DB;
		const inquiry = await getInquiryRepository(db).findById(id);
		if (!inquiry) return json({
			success: false,
			error: "询盘不存在"
		}, 404);
		return json({
			success: true,
			data: inquiry
		}, 200);
	} catch (error) {
		console.error("[api/admin/inquiries/[id]] 查询询盘详情失败:", error);
		return json({
			success: false,
			error: "服务器错误，请稍后重试"
		}, 500);
	}
};
var DELETE = async ({ params }) => {
	try {
		const id = Number(params.id);
		if (!Number.isInteger(id) || id <= 0) return json({
			success: false,
			error: "无效的询盘 ID"
		}, 400);
		const db = env.DB;
		if (!await getInquiryRepository(db).delete(id)) return json({
			success: false,
			error: "询盘不存在或删除失败"
		}, 404);
		return json({ success: true }, 200);
	} catch (error) {
		console.error("[api/admin/inquiries/[id]] 删除询盘失败:", error);
		return json({
			success: false,
			error: "服务器错误，请稍后重试"
		}, 500);
	}
};
//#endregion
//#region \0virtual:astro:page:src/pages/api/admin/inquiries/[id]@_@ts
var page = () => _id__exports;
//#endregion
export { page };
