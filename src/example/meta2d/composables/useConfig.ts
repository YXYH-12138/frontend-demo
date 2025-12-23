import { inject, ref, type UnwrapRef, watch } from "vue";
import { debounce } from "xe-utils";
import { contextKey } from "../topology/token";
import type { IStationNodeConfig } from "@/utils/topology";

export function useConfig<T = IStationNodeConfig>() {
	const context = inject(contextKey)!;

	const { pen, setValue } = context;

	const config = ref<T>({ ...pen.value } as T);

	watch(pen, (pen) => {
		// console.log(pen);
		config.value = { ...pen } as UnwrapRef<T>;
	});

	const updateValue: (key: string, value?: any, sttpObjKey?: string) => void = (
		key: string,
		value: any,
		sttpObjKey?: string
	) => {
		let _val = value ?? config.value[key];
		setValue({ [key]: _val });
		config.value[key] = _val;
		if (sttpObjKey) {
			const sttpObj = (config.value as any).sttpObj;
			if (sttpObjKey === "stnm") {
				_val = _val.replace(/\s/g, "");
			}
			sttpObj[sttpObjKey] = _val;
			setValue({ sttpObj });
		}
	};

	return {
		...context,
		updateValue,
		lazyUpdateValue: debounce(updateValue, 200, { leading: true }),
		config
	};
}
