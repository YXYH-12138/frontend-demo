import fs from "fs-extra";
import path from "node:path";
import { VERSION_FILE } from "./constance";

export function createVersion(dir: string, useWorker = false) {
	if (!fs.existsSync(dir)) {
		console.warn(`不存在文件路径${dir}`);
		return;
	}

	const filePath = path.resolve(dir, VERSION_FILE);

	fs.writeFile(filePath, JSON.stringify({ version: Date.now() })).catch((err) => {
		console.warn(`创建版本文件${filePath}失败`, err);
	});

	if (useWorker) {
		const fsStream = fs.createReadStream(path.resolve(__dirname, "./run.js"), {
			encoding: "utf-8"
		});
		const fsWriter = fs.createWriteStream(path.resolve(dir, "./run.js"), { encoding: "utf-8" });
		fsStream.pipe(fsWriter);
	}
}
