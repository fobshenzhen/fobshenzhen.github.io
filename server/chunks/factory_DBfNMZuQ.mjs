globalThis.process ??= {};
globalThis.process.env ??= {};
import fs from "node:fs";
import path from "node:path";
//#region src/lib/repository/d1.ts
var D1Repository = class {
	db;
	initPromise = null;
	constructor(db) {
		this.db = db;
		this.initPromise = this.initialize();
	}
	async initialize() {
		await this.db.batch([
			this.db.prepare(`CREATE TABLE IF NOT EXISTS inquiries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT,
        whatsapp TEXT,
        company TEXT,
        message TEXT NOT NULL,
        file_url TEXT,
        file_name TEXT,
        status TEXT DEFAULT 'new',
        ip TEXT,
        user_agent TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`),
			this.db.prepare(`CREATE INDEX IF NOT EXISTS idx_inquiries_email ON inquiries(email)`),
			this.db.prepare(`CREATE INDEX IF NOT EXISTS idx_inquiries_status ON inquiries(status)`),
			this.db.prepare(`CREATE INDEX IF NOT EXISTS idx_inquiries_created_at ON inquiries(created_at)`)
		]);
	}
	async create(data) {
		await this.initPromise;
		const result = await this.db.prepare(`INSERT INTO inquiries (name, email, phone, whatsapp, company, message, file_url, file_name, ip, user_agent)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         RETURNING *`).bind(data.name, data.email, data.phone ?? null, data.whatsapp ?? null, data.company ?? null, data.message, data.file_url ?? null, data.file_name ?? null, data.ip ?? null, data.user_agent ?? null).first();
		if (!result) throw new Error("[D1Repository] 插入询盘失败，未返回记录");
		return result;
	}
	async findById(id) {
		await this.initPromise;
		return await this.db.prepare("SELECT * FROM inquiries WHERE id = ?").bind(id).first() ?? null;
	}
	async findAll(filter, page = 1, limit = 20) {
		await this.initPromise;
		const conditions = [];
		const params = [];
		if (filter?.status) {
			conditions.push("status = ?");
			params.push(filter.status);
		}
		if (filter?.search) {
			conditions.push("(name LIKE ? OR email LIKE ? OR message LIKE ?)");
			const search = `%${filter.search}%`;
			params.push(search, search, search);
		}
		if (filter?.date_from) {
			conditions.push("created_at >= ?");
			params.push(filter.date_from.toISOString());
		}
		if (filter?.date_to) {
			conditions.push("created_at <= ?");
			params.push(filter.date_to.toISOString());
		}
		const where = conditions.length > 0 ? ` WHERE ${conditions.join(" AND ")}` : "";
		const total = (await this.db.prepare(`SELECT COUNT(*) as total FROM inquiries${where}`).bind(...params).first())?.total ?? 0;
		const offset = (page - 1) * limit;
		return {
			data: (await this.db.prepare(`SELECT * FROM inquiries${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`).bind(...params, limit, offset).all()).results ?? [],
			total,
			page,
			limit,
			total_pages: Math.ceil(total / limit)
		};
	}
	async updateStatus(id, status) {
		await this.initPromise;
		await this.db.prepare(`UPDATE inquiries SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`).bind(status, id).run();
		return await this.findById(id);
	}
	async delete(id) {
		await this.initPromise;
		return ((await this.db.prepare("DELETE FROM inquiries WHERE id = ?").bind(id).run()).meta?.changes ?? 0) > 0;
	}
	async getStats() {
		await this.initPromise;
		const result = await this.db.prepare(`SELECT
          COUNT(*) as total,
          SUM(CASE WHEN status = 'new' THEN 1 ELSE 0 END) as new,
          SUM(CASE WHEN status = 'read' THEN 1 ELSE 0 END) as read,
          SUM(CASE WHEN status = 'replied' THEN 1 ELSE 0 END) as replied,
          SUM(CASE WHEN status = 'archived' THEN 1 ELSE 0 END) as archived
        FROM inquiries`).first();
		return {
			total: result?.total ?? 0,
			new: result?.new ?? 0,
			read: result?.read ?? 0,
			replied: result?.replied ?? 0,
			archived: result?.archived ?? 0
		};
	}
	async healthCheck() {
		try {
			await this.db.prepare("SELECT 1").first();
			return true;
		} catch {
			return false;
		}
	}
};
//#endregion
//#region src/lib/repository/json.ts
var JsonRepository = class {
	filePath;
	store;
	constructor(filePath) {
		this.filePath = filePath ?? path.join(process.cwd(), "data", "inquiries.json");
		this.store = this.load();
	}
	load() {
		try {
			if (fs.existsSync(this.filePath)) {
				const raw = fs.readFileSync(this.filePath, "utf8");
				return JSON.parse(raw);
			}
		} catch (error) {
			console.warn("[JsonRepository] 读取文件失败，使用空存储:", error);
		}
		return {
			inquiries: [],
			next_id: 1
		};
	}
	save() {
		const dir = path.dirname(this.filePath);
		if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
		fs.writeFileSync(this.filePath, JSON.stringify(this.store, null, 2), "utf8");
	}
	async create(data) {
		const now = (/* @__PURE__ */ new Date()).toISOString();
		const inquiry = {
			id: this.store.next_id++,
			name: data.name,
			email: data.email,
			phone: data.phone ?? null,
			whatsapp: data.whatsapp ?? null,
			company: data.company ?? null,
			message: data.message,
			file_url: data.file_url ?? null,
			file_name: data.file_name ?? null,
			status: "new",
			ip: data.ip ?? null,
			user_agent: data.user_agent ?? null,
			created_at: now,
			updated_at: now
		};
		this.store.inquiries.push(inquiry);
		this.save();
		return inquiry;
	}
	async findById(id) {
		return this.store.inquiries.find((i) => i.id === id) ?? null;
	}
	async findAll(filter, page = 1, limit = 20) {
		let items = [...this.store.inquiries];
		if (filter?.status) items = items.filter((i) => i.status === filter.status);
		if (filter?.search) {
			const s = filter.search.toLowerCase();
			items = items.filter((i) => i.name.toLowerCase().includes(s) || i.email.toLowerCase().includes(s) || i.message.toLowerCase().includes(s));
		}
		if (filter?.date_from) items = items.filter((i) => new Date(i.created_at) >= filter.date_from);
		if (filter?.date_to) items = items.filter((i) => new Date(i.created_at) <= filter.date_to);
		items.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
		const total = items.length;
		const offset = (page - 1) * limit;
		return {
			data: items.slice(offset, offset + limit),
			total,
			page,
			limit,
			total_pages: Math.ceil(total / limit)
		};
	}
	async updateStatus(id, status) {
		const inquiry = this.store.inquiries.find((i) => i.id === id);
		if (!inquiry) throw new Error(`Inquiry ${id} not found`);
		inquiry.status = status;
		inquiry.updated_at = (/* @__PURE__ */ new Date()).toISOString();
		this.save();
		return inquiry;
	}
	async delete(id) {
		const index = this.store.inquiries.findIndex((i) => i.id === id);
		if (index >= 0) {
			this.store.inquiries.splice(index, 1);
			this.save();
			return true;
		}
		return false;
	}
	async getStats() {
		const stats = {
			total: this.store.inquiries.length,
			new: 0,
			read: 0,
			replied: 0,
			archived: 0
		};
		for (const i of this.store.inquiries) if (i.status in stats) stats[i.status]++;
		return stats;
	}
	async healthCheck() {
		return true;
	}
};
//#endregion
//#region src/lib/repository/factory.ts
/**
* 获取询盘 Repository
*
* Cloudflare 环境下，D1 数据库通过 `c.env.DB` 传入。
* 本地开发时没有 D1 binding，降级为 JSON 文件存储。
*/
function getInquiryRepository(db) {
	if (db) return new D1Repository(db);
	return new JsonRepository();
}
//#endregion
export { getInquiryRepository as t };
