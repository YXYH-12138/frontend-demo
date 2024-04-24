import { VERSION_FILE } from "./constance";

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

interface AutoCheckConfig {
	/** 检测间隔 */
	interval: number;
}

export const UpdateEventName = "onmessageUpdate";

export function createAutoCheck(config?: AutoCheckConfig) {
	const { interval } = Object.assign({ interval: 1000 * 5 }, config);

	const start = () => {
		setTimeout(async () => {
			const version = await checkUpdate();
			if (version) {
				console.log(`🚀发现新版本,version:${version}`);
				window.dispatchEvent(
					new CustomEvent(UpdateEventName, {
						detail: { version: lastVersion }
					})
				);
			} else {
				start();
			}
		}, interval);
	};

	return { start };
}
