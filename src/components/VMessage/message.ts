import type { ExtractPropTypes, VNode } from "vue";

export type MessageProps = ExtractPropTypes<typeof messageProps>;

export interface MessageHandle {
	close: () => void;
}

export type MessageFn = (options: Partial<MessageProps>) => MessageHandle;

export const messageProps = {
	message: {
		type: String,
		default: ""
	},
	zIndex: {
		type: Number,
		default: 0
	},
	offset: {
		type: Number,
		default: 20
	},
	id: {
		type: String
	},
	onClose: {
		type: Function,
		required: false
	}
};
export const messageEmits = {
	destroy: () => true
};

export type MessageItem = {
	vm: VNode;
};

export type MessageQueue = MessageItem[];
