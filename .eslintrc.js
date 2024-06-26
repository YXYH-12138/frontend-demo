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
		"plugin:vue/vue3-essential",
		"eslint:recommended",
		"@vue/typescript/recommended"
		// "@vue/prettier",
		// "@vue/prettier/@typescript-eslint"
	],
	parserOptions: {
		ecmaVersion: 2020
	},
	rules: {
		"no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
		"no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
		"@typescript-eslint/no-var-requires": "off",
		"@typescript-eslint/no-explicit-any": "off",
		"@typescript-eslint/explicit-module-boundary-types": "off",
		"@typescript-eslint/no-empty-function": "off",
		"@typescript-eslint/no-non-null-assertion": "off",
		"vue/multi-word-component-names": "off",
		"no-mixed-spaces-and-tabs": "off"
	}
};
