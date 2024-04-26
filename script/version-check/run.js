let lastVersion;

/** 获取版本号 */
const getVersion = async (versionFile) => {
	const res = await fetch(`/${versionFile}?timestep=${Date.now()}`);
	return await res.json();
};

/** 检查更新 */
async function checkUpdate(versionFile) {
	try {
		const { version } = await getVersion(versionFile);
		const prevVersion = lastVersion;
		lastVersion = version;
		if (prevVersion && prevVersion !== version) {
			return version;
		}
	} catch {
		//
	}
}

function run({ interval, versionFile }) {
	const start = () => {
		this.postMessage({ version: lastVersion });

		setTimeout(async () => {
			const version = await checkUpdate(versionFile);
			if (version) {
				console.log(`🚀发现新版本,version:${version}`);
				this.postMessage({ version: lastVersion });
			} else {
				start();
			}
		}, interval);
	};

	start();
}

this.addEventListener("message", (event) => {
	run(event.data);
});
