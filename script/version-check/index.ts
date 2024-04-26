import { createAutoCheck as createBaseAutoCheck, type AutoCheckConfig } from "./auto-check";
import { createAutoCheck as createWorkerAutoCheck } from "./auto-check-worker";

interface Config extends AutoCheckConfig {
	useWorker?: boolean;
}

export function createAutoCheck(config?: Config) {
	// 是否将将轮询放在worker中
	const useWorker = config?.useWorker;

	if ((window.SharedWorker || window.Worker) && useWorker) {
		return createWorkerAutoCheck(config);
	} else {
		return createBaseAutoCheck(config);
	}
}

export { UpdateEventName } from "./constance";
