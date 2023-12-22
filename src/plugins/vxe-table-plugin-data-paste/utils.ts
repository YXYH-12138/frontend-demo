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

// function checkVersion(minVersion: string): boolean {
// 	const minVersionArr = minVersion.split(".");
// 	const currentVersionArr = version.split(".");
// 	const result: boolean[] = [];
// 	for (let i = 0; i < minVersionArr.length; i++) {
// 		if (parseInt(currentVersionArr[i]) > parseInt(minVersionArr[i])) {
// 			result.push(false);
// 		} else {
// 			result.push(true);
// 		}
// 	}
// 	console.log(result);
// 	return !result.some((val) => val);
// }

export const tableHelper = {
	addEmitOption: (function () {
		if (isVue3) {
			return function (instance: any, event: string) {
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
		} else {
			return noop;
		}
	})()
};
