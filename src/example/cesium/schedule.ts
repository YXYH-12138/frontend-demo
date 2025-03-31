import { sleep } from "@/utils";

// 记录 callback
let scheduledHostCallback;
let isMessageLoopRunning = false;
const getCurrentTime = () => performance.now();

// rIC 更名为 requestHostCallback
export function requestHostCallback(callback) {
	scheduledHostCallback = callback;
	if (!isMessageLoopRunning) {
		isMessageLoopRunning = true;
		schedulePerformWorkUntilDeadline();
	}
}

const channel = new MessageChannel();
const port = channel.port2;
channel.port1.onmessage = performWorkUntilDeadline;

const schedulePerformWorkUntilDeadline = () => {
	port.postMessage(null);
};

function performWorkUntilDeadline() {
	if (scheduledHostCallback !== null) {
		const currentTime = getCurrentTime();
		let hasMoreWork = true;
		try {
			hasMoreWork = scheduledHostCallback(currentTime);
		} finally {
			if (hasMoreWork) {
				schedulePerformWorkUntilDeadline();
			} else {
				isMessageLoopRunning = false;
				scheduledHostCallback = null;
			}
		}
	} else {
		isMessageLoopRunning = false;
	}
}

export async function taskSplit<T = any>(
	array: T[],
	maxCount: number,
	callback: (item: T) => void
) {
	const len = array.length;
	const chunks = Math.ceil(len / maxCount);
	for (let i = 0; i < chunks; i++) {
		const start = i * maxCount;
		const end = start + maxCount;
		if (end > len) return;
		array.slice(start, end).forEach(callback);
		await sleep(10);
	}
}
