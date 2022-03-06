import { watch } from "vue-demi";
import { IconDefaultUrl } from "./type";

export const capitalizeFirstLetter = (string: string) => {
	if (!string || typeof string.charAt !== "function") {
		return string;
	}
	return string.charAt(0).toUpperCase() + string.slice(1);
};

export const propsBinder = (
	methods: Record<string, (...arg: any[]) => any>,
	leafletElement: Record<string, any>,
	props: Record<string, unknown>
) => {
	for (const key in props) {
		const setMethodName = "set" + capitalizeFirstLetter(key);
		if (methods[setMethodName]) {
			watch(
				() => props[key],
				(newVal, oldVal) => {
					methods[setMethodName](newVal, oldVal);
				}
			);
		} else if (leafletElement[setMethodName]) {
			watch(
				() => props[key],
				(newVal) => {
					leafletElement[setMethodName](newVal);
				}
			);
		}
	}
};

export const remapEvents = (contextAttrs: Record<string, unknown>) => {
	const result: Record<string, (event: Event) => void> = {};
	for (const attrName in contextAttrs) {
		if (attrName.startsWith("on") && !attrName.startsWith("onUpdate") && attrName !== "onReady") {
			const eventName = attrName.slice(2).toLocaleLowerCase();
			result[eventName] = contextAttrs[attrName] as (event: Event) => void;
		}
	}
	return result;
};

export const resetWebpackIcon = async (Icon: any, urlMap: IconDefaultUrl = {}) => {
	const modules = await Promise.all([
		Promise.resolve({ default: urlMap.iconRetinaUrl }) ||
			import("leaflet/dist/images/marker-icon-2x.png"),
		Promise.resolve({ default: urlMap.iconUrl }) || import("leaflet/dist/images/marker-icon.png"),
		Promise.resolve({ default: urlMap.shadowUrl }) ||
			import("leaflet/dist/images/marker-shadow.png")
	]);

	Icon.Default.mergeOptions({
		iconRetinaUrl: modules[0].default,
		iconUrl: modules[1].default,
		shadowUrl: modules[2].default
	});
};
