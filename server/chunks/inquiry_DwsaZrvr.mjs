globalThis.process ??= {};
globalThis.process.env ??= {};
import { n as __exportAll } from "./rolldown-runtime_BDykq6kg.mjs";
import { t as getInquiryRepository } from "./factory_DBfNMZuQ.mjs";
import { env } from "cloudflare:workers";
//#region src/lib/storage/r2.ts
var R2Storage = class {
	bucket;
	publicBaseUrl;
	constructor(bucket, publicBaseUrl) {
		this.bucket = bucket;
		this.publicBaseUrl = publicBaseUrl ?? null;
	}
	async upload(file) {
		const key = `inquiries/${Date.now()}-${Math.random().toString(36).substring(2, 8)}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
		await this.bucket.put(key, file.stream(), { httpMetadata: { contentType: file.type || "application/octet-stream" } });
		return {
			url: this.publicBaseUrl ? `${this.publicBaseUrl.replace(/\/$/, "")}/${key}` : key,
			name: file.name,
			size: file.size,
			contentType: file.type || "application/octet-stream"
		};
	}
	async delete(key) {
		try {
			await this.bucket.delete(key);
			return true;
		} catch {
			return false;
		}
	}
	async healthCheck() {
		try {
			await this.bucket.head("health-check");
			return true;
		} catch {
			return false;
		}
	}
};
//#endregion
//#region src/lib/storage/local.ts
var LocalStorage = class {
	async upload(file) {
		return {
			url: `/dev-uploads/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`,
			name: file.name,
			size: file.size,
			contentType: file.type || "application/octet-stream"
		};
	}
	async delete(key) {
		console.log("[LocalStorage] delete (no-op):", key);
		return true;
	}
	async healthCheck() {
		return true;
	}
};
//#endregion
//#region src/lib/storage/factory.ts
/**
* 获取存储服务
* - Cloudflare 环境（有 R2 bucket）：R2Storage
* - 本地开发（无 R2 bucket）：LocalStorage（丢弃文件，仅记录）
*/
function getStorageService(bucket) {
	if (bucket) return new R2Storage(bucket);
	return new LocalStorage();
}
//#endregion
//#region src/lib/email/resend.ts
var ResendEmail = class {
	apiKey;
	from;
	to;
	constructor(apiKey, from, to) {
		this.apiKey = apiKey;
		this.from = from;
		this.to = to;
	}
	async sendInquiryNotification(inquiry) {
		if (!this.apiKey || !this.from || !this.to) {
			console.warn("[ResendEmail] 未配置 API Key 或收发件人，跳过发送");
			return false;
		}
		try {
			const html = `
        <h2>New Inquiry Received</h2>
        <p><strong>Name:</strong> ${inquiry.name}</p>
        <p><strong>Email:</strong> ${inquiry.email}</p>
        <p><strong>Phone:</strong> ${inquiry.phone ?? "-"}</p>
        <p><strong>Company:</strong> ${inquiry.company ?? "-"}</p>
        <p><strong>Message:</strong></p>
        <p>${inquiry.message.replace(/\n/g, "<br/>")}</p>
        ${inquiry.file_url ? `<p><strong>Attachment:</strong> <a href="${inquiry.file_url}">${inquiry.file_name ?? "Download"}</a></p>` : ""}
        <hr/>
        <p style="color:#888;">Sent at ${inquiry.created_at}</p>
      `;
			const response = await fetch("https://api.resend.com/emails", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${this.apiKey}`
				},
				body: JSON.stringify({
					from: this.from,
					to: [this.to],
					subject: `[Inquiry] New message from ${inquiry.name}`,
					html
				})
			});
			if (!response.ok) {
				const body = await response.text();
				console.error("[ResendEmail] 发送失败:", response.status, body);
				return false;
			}
			return true;
		} catch (error) {
			console.error("[ResendEmail] 发送异常:", error);
			return false;
		}
	}
	async healthCheck() {
		return Boolean(this.apiKey);
	}
};
//#endregion
//#region src/lib/email/factory.ts
/**
* 占位邮件实现：未配置密钥时使用，安全跳过所有发送
*/
var NoopEmail = class {
	async sendInquiryNotification(_inquiry) {
		console.log("[NoopEmail] 未配置邮件服务，跳过通知发送");
		return false;
	}
	async healthCheck() {
		return false;
	}
};
/**
* 获取邮件服务
* - 已配置 RESEND_API_KEY：返回 ResendEmail
* - 未配置：返回 NoopEmail（静默跳过）
*/
function getEmailService(apiKey, from, to) {
	if (apiKey && from && to) return new ResendEmail(apiKey, from, to);
	return new NoopEmail();
}
//#endregion
//#region src/lib/validation.ts
/**
* 验证询盘表单输入
* 返回 { ok: true } 或 { ok: false, error: 错误信息 }
*/
function validateInquiryInput(input) {
	if (!input.name || input.name.length < 2) return {
		ok: false,
		error: "Please enter your name (at least 2 characters)."
	};
	if (input.name.length > 100) return {
		ok: false,
		error: "Name must be less than 100 characters."
	};
	if (!input.email) return {
		ok: false,
		error: "Please enter your email."
	};
	if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email)) return {
		ok: false,
		error: "Please enter a valid email address."
	};
	if (input.email.length > 200) return {
		ok: false,
		error: "Email must be less than 200 characters."
	};
	if (!input.message || input.message.length < 10) return {
		ok: false,
		error: "Please enter your message (at least 10 characters)."
	};
	if (input.message.length > 1e4) return {
		ok: false,
		error: "Message must be less than 10000 characters."
	};
	if (input.phone && input.phone.length > 50) return {
		ok: false,
		error: "Phone must be less than 50 characters."
	};
	if (input.company && input.company.length > 200) return {
		ok: false,
		error: "Company must be less than 200 characters."
	};
	return { ok: true };
}
/**
* 验证 Turnstile token
* - 未传入 secretKey：返回 true（跳过验证，本地开发/未启用时）
* - 已传入 secretKey：调用 Cloudflare Turnstile API 验证
*/
async function validateTurnstile(token, secretKey, ip) {
	if (!secretKey) return true;
	if (!token) {
		console.warn("[Turnstile] 缺少 token");
		return false;
	}
	try {
		const formData = new FormData();
		formData.append("secret", secretKey);
		formData.append("response", token);
		if (ip) formData.append("remoteip", ip);
		return (await (await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
			method: "POST",
			body: formData
		})).json()).success === true;
	} catch (error) {
		console.error("[Turnstile] 验证失败:", error);
		return false;
	}
}
//#endregion
//#region src/pages/api/inquiry.ts
var inquiry_exports = /* @__PURE__ */ __exportAll({ POST: () => POST });
/**
* 仅返回 JSON，不需要 CORS（同域）
*/
var JSON_HEADERS = { "Content-Type": "application/json" };
function json(data, status) {
	return new Response(JSON.stringify(data), {
		status,
		headers: JSON_HEADERS
	});
}
var POST = async ({ request }) => {
	try {
		const db = env.DB;
		const bucket = env.INQUIRY_FILES;
		const formData = await request.formData();
		const input = {
			name: String(formData.get("name") ?? "").trim(),
			email: String(formData.get("email") ?? "").trim(),
			phone: String(formData.get("phone") ?? "").trim() || null,
			whatsapp: String(formData.get("whatsapp") ?? "").trim() || null,
			company: String(formData.get("company") ?? "").trim() || null,
			message: String(formData.get("message") ?? "").trim(),
			file: formData.get("file")
		};
		const validation = validateInquiryInput(input);
		if (!validation.ok) return json({
			success: false,
			error: validation.error
		}, 400);
		if (!await validateTurnstile(String(formData.get("turnstile") ?? "").trim(), env.TURNSTILE_SECRET_KEY, request.headers.get("CF-Connecting-IP") ?? void 0)) return json({
			success: false,
			error: "人机验证失败，请重试"
		}, 400);
		const storage = getStorageService(bucket);
		let fileUrl = null;
		let fileName = null;
		if (input.file && input.file instanceof File && input.file.size > 0) {
			if (input.file.size > 20971520) return json({
				success: false,
				error: "文件大小不能超过 20MB"
			}, 400);
			const uploaded = await storage.upload(input.file);
			fileUrl = uploaded.url;
			fileName = uploaded.name;
		}
		const inquiry = await getInquiryRepository(db).create({
			name: input.name,
			email: input.email,
			phone: input.phone ?? void 0,
			whatsapp: input.whatsapp ?? void 0,
			company: input.company ?? void 0,
			message: input.message,
			file_url: fileUrl ?? void 0,
			file_name: fileName ?? void 0,
			ip: request.headers.get("CF-Connecting-IP") ?? void 0,
			user_agent: request.headers.get("User-Agent") ?? void 0
		});
		await getEmailService(env.RESEND_API_KEY, env.RESEND_FROM, env.INQUIRY_NOTIFY_TO).sendInquiryNotification(inquiry).catch((err) => {
			console.error("[inquiry] 邮件通知发送失败（不影响询盘存储）:", err);
		});
		return json({
			success: true,
			message: "Thank you! We will get back to you ASAP.",
			id: inquiry.id
		}, 201);
	} catch (error) {
		console.error("[inquiry] 处理询盘失败:", error);
		return json({
			success: false,
			error: "服务器错误，请稍后重试或直接发送邮件至 RFQ@kinsaimachining.com"
		}, 500);
	}
};
//#endregion
//#region \0virtual:astro:page:src/pages/api/inquiry@_@ts
var page = () => inquiry_exports;
//#endregion
export { page };
