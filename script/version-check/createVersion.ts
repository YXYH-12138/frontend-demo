import fs from "fs-extra";
import path from "node:path";
import { VERSION_FILE } from "./constance";

export function createVersion(dir: string) {
	if (!fs.existsSync(dir)) {
		console.warn(`不存在文件路径${dir}`);
		return;
	}

	const filePath = path.resolve(dir, VERSION_FILE);

	fs.writeFile(filePath, JSON.stringify({ version: Date.now() })).catch((err) => {
		console.warn(`创建版本文件${filePath}失败`, err);
	});
}
