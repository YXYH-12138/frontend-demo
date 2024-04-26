export interface AutoCheckConfig {
	/** 检测间隔 */
	interval?: number;
}

export interface AutoCheckReturnValue {
	start: () => void;
}
