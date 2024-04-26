import { VERSION_FILE, UpdateEventName, INTERVAL } from "./constance";
import type { AutoCheckConfig as BaseAutoCheckConfig, AutoCheckReturnValue } from "./type";

export interface AutoCheckConfig extends BaseAutoCheckConfig {
	mode?: "file" | "src";
}

function createAutoCheckByFile({ interval }: BaseAutoCheckConfig): AutoCheckReturnValue {
	let lastVersion: number;

	/** 获取版本号 */
	const getVersion = async (): Promise<{ version: number }> => {
		const res = await fetch(`/${VERSION_FILE}?timestep=${Date.now()}`);
		return await res.json();
	};

	/** 检查更新 */
	async function checkUpdate() {
		try {
			const { version } = await getVersion();
			const prevVersion = lastVersion;
			lastVersion = version;
			if (prevVersion && prevVersion !== version) {
				return version;
			}
		} catch {
			//
		}
	}

	const start = () => {
		setTimeout(async () => {
			const version = await checkUpdate();
			if (version) {
				console.log(`🚀发现新版本`);
				window.dispatchEvent(new CustomEvent(UpdateEventName));
			} else {
				start();
			}
		}, interval);
	};

	return { start };
}

function createAutoCheckBySrc({ interval }: BaseAutoCheckConfig): AutoCheckReturnValue {
	let prevLinksAndScripts: string[];

	const getAllLinksAndScripts = () => {
		const linksAndScripts: string[] = [];

		// 获取所有的 <link> 标签
		const linkElements = document.getElementsByTagName("link");
		for (let i = 0; i < linkElements.length; i++) {
			const href = linkElements[i].getAttribute("href");
			if (href) {
				linksAndScripts.push(href);
			}
		}

		// 获取所有的 <script> 标签
		const scriptElements = document.getElementsByTagName("script");
		for (let i = 0; i < scriptElements.length; i++) {
			const src = scriptElements[i].getAttribute("src");
			if (src) {
				linksAndScripts.push(src);
			}
		}

		return linksAndScripts;
	};

	const checkUpdate = () => {
		const oldLinksAndScripts = prevLinksAndScripts;
		const linksAndScripts = (prevLinksAndScripts = getAllLinksAndScripts());

		if (!oldLinksAndScripts) return false;

		console.log({ oldLinksAndScripts, linksAndScripts });

		const oldLen = oldLinksAndScripts.length;
		const newLen = linksAndScripts.length;
		if (oldLen !== newLen) return true;

		const oldMap = oldLinksAndScripts.reduce<Record<string, boolean>>(
			(acc, cur) => Object.assign(acc, { [cur]: true }),
			{}
		);

		// 如果新文件在旧文件数组中找不到，则说明有更新
		for (let i = 0; i < newLen; i++) {
			if (!oldMap[linksAndScripts[i]]) return true;
		}

		return false;
	};

	const start = () => {
		setTimeout(() => {
			const isUpdate = checkUpdate();
			if (isUpdate) {
				console.log(`🚀发现新版本`);
				window.dispatchEvent(new CustomEvent(UpdateEventName));
			} else {
				start();
			}
		}, interval);
	};

	return { start };
}

export function createAutoCheck(config?: AutoCheckConfig) {
	const newConfig = Object.assign({ interval: INTERVAL, mode: "file" } as AutoCheckConfig, config);

	switch (newConfig.mode) {
		case "file":
			return createAutoCheckByFile(newConfig);
		default:
			return createAutoCheckBySrc(newConfig);
	}
}
