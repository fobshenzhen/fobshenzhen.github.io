globalThis.process ??= {};
globalThis.process.env ??= {};
import { n as __exportAll } from "./rolldown-runtime_BDykq6kg.mjs";
import { env } from "cloudflare:workers";
//#region src/pages/inquiries/[...key].ts
var ____key__exports = /* @__PURE__ */ __exportAll({
	GET: () => GET,
	prerender: () => false
});
var GET = async ({ params }) => {
	try {
		const segments = params.key;
		if (!segments || segments.length === 0) return new Response("Not found", { status: 404 });
		const key = `inquiries/${segments.join("/")}`;
		const bucket = env.INQUIRY_FILES;
		if (!bucket) return new Response("Storage not configured", { status: 503 });
		const object = await bucket.get(key);
		if (!object) return new Response("File not found", { status: 404 });
		const headers = new Headers();
		const contentType = object.httpMetadata?.contentType ?? "application/octet-stream";
		headers.set("Content-Type", contentType);
		if (object.size !== void 0 && object.size !== null) headers.set("Content-Length", String(object.size));
		const asciiFileName = (segments[segments.length - 1] ?? "attachment").replace(/[^\x20-\x7E]/g, "_").replace(/["\\]/g, "_");
		headers.set("Content-Disposition", `inline; filename="${asciiFileName}"`);
		headers.set("Cache-Control", "private, max-age=3600");
		return new Response(object.body, {
			status: 200,
			headers
		});
	} catch (error) {
		console.error("[inquiries/[...key]] 读取附件失败:", error);
		return new Response("Internal server error", { status: 500 });
	}
};
//#endregion
//#region \0virtual:astro:page:src/pages/inquiries/[...key]@_@ts
var page = () => ____key__exports;
//#endregion
export { page };
