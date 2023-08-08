import { createVNode, render } from "vue";
import MessageConstructor from "./index.vue";
import type { MessageFn, MessageProps, MessageQueue } from "./message";

const messageQueue: MessageQueue = [];

let index = 1;

const DISTANCE = 16;

const message: MessageFn = function (options) {
	let verticalOffset = options.offset || 20;

	messageQueue.forEach(({ vm }) => {
		verticalOffset += DISTANCE + (vm.el?.offsetHeight || 0);
	});

	const id = `message_${index++}`;

	const props: Partial<MessageProps> = {
		...options,
		offset: verticalOffset,
		id,
		onClose() {
			close(id);
		}
	};

	const container = document.createElement("div");

	const vm = createVNode(MessageConstructor, props);

	vm.props!.onDestroy = function () {
		console.log("销毁了");
		render(null, container);
	};

	render(vm, container);

	messageQueue.push({ vm });

	document.body.appendChild(container.firstElementChild!);

	return {
		close() {
			close(id);
		}
	};
};

function close(id: string) {
	const index = messageQueue.findIndex(({ vm }) => vm.props!.id == id);
	if (index === -1) return;

	const { vm } = messageQueue[index];
	if (!vm) return;

	const removeHeight = vm.el!.offsetHeight;

	const len = messageQueue.length;
	if (len < 1) return;

	for (let i = 0; i < len; i++) {
		const { vm } = messageQueue[i];
		const pos = parseInt(vm.el!.style.top, 10) - removeHeight - DISTANCE;

		vm.component!.props.offset = pos;
	}

	messageQueue.splice(index, 1);
}

export default message;
