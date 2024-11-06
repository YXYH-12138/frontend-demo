module.exports = {
	root: true,
	env: {
		node: true
	},
	globals: {
		defineEmits: "readonly",
		defineProps: "readonly",
		defineExpose: "readonly",
		withDefaults: "readonly"
	},
	extends: [
		"eslint:recommended",
		"plugin:vue/vue3-essential",
		"plugin:@typescript-eslint/recommended",
		"plugin:prettier/recommended"
	],
	// 解析vue文件,使得eslint能解析<template>标签中的内容
	parser: "vue-eslint-parser",
	parserOptions: {
		ecmaVersion: "latest",
		sourceType: "module",
		parser: "@typescript-eslint/parser",
		ecmaFeatures: {
			jsx: true
		}
	},
	plugins: ["vue", "@typescript-eslint"],
	rules: {
		"@typescript-eslint/no-var-requires": "off",
		"@typescript-eslint/no-explicit-any": "off",
		"@typescript-eslint/explicit-module-boundary-types": "off",
		"@typescript-eslint/no-empty-function": "off",
		"@typescript-eslint/no-non-null-assertion": "off",
		"vue/multi-word-component-names": "off",
		"no-mixed-spaces-and-tabs": "off"
	}
};
