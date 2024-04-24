import { kebabCase } from "xe-utils";
import { version } from "vue";

const noop = () => {};

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

const isVue3 = version.charAt(0) === "3";
export function parseString(text: string) {
	return text
		.split("\n")
		.map((row) => row.split(/\t|\s/).filter(Boolean))
		.filter((item) => item.length);
}

export const tableHelper = {
	addEmitOption: function (instance: any, event: string) {
		if (isVue3) {
			tableHelper.addEmitOption = function (instance: any, event: string) {
				const {
					emitsOptions,
					propsOptions: [propsOptions]
				} = instance;
				if (emitsOptions) {
					emitsOptions[kebabCase(event)] = null;
				}
				if (propsOptions) {
					propsOptions[`on${capitalize(event)}`] = { 0: false, 1: true, type: Function };
				}
			};
			tableHelper.addEmitOption(instance, event);
		} else {
			tableHelper.addEmitOption = noop;
		}
	}
};
