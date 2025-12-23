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
