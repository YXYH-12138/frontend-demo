<script lang="ts">
import { defineComponent, ref, reactive, toRef, toRefs } from "vue";

export default defineComponent({
	setup() {
		// ref reactive shallowReactive shallowRef watchEffect toRef toRefs markRaw

		const counter = ref(1);

		const obj = reactive({ count: 1, foo: 1 });

		const objCounter = toRef(obj, "count");

		// const list = reactive([1, 2, 3]);
		// watch(
		// 	[() => obj.foo, counter],
		// 	(val) => {
		// 		console.log(val);
		// 	},
		// 	{ immediate: true, deep: true }
		// );
		return { ...toRefs(obj), counter, objCounter };
	}
});
</script>

<template>
	<el-button @click="objCounter++">objCounter+1</el-button>
	<el-button @click="count++">count+1</el-button>
	<el-button @click="foo++">foo+1</el-button>
	{{ objCounter }} {{ count }}
</template>

<style lang="scss" scoped></style>
