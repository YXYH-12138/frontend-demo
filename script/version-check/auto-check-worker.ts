import { VERSION_FILE, UpdateEventName, INTERVAL } from "./constance";
import type { AutoCheckConfig } from "./type";

export function createAutoCheck(config?: AutoCheckConfig) {
	const { interval } = Object.assign({ interval: INTERVAL }, config);
	const worker = new Worker("./run.js");

	const start = () => {
		worker.postMessage({ interval, versionFile: VERSION_FILE });
	};

	worker.addEventListener("message", (event) => {
		window.dispatchEvent(new CustomEvent(UpdateEventName, { detail: event.data }));
	});

	return { start };
}
