<template>
	<transition name="message-fade" @before-leave="onClose" @after-leave="$emit('destroy')">
		<div v-show="visible" class="h-message" :style="customStyle">{{ message }}</div>
	</transition>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from "vue-demi";
import { messageProps, messageEmits } from "./message";

export default defineComponent({
	props: messageProps,
	emits: messageEmits,
	setup(props) {
		const visible = ref(false);

		const customStyle = computed(() => ({
			top: `${props.offset}px`,
			zIndex: props.zIndex
		}));

		function startTimer() {
			setTimeout(() => {
				visible.value = false;
			}, 2000);
		}

		onMounted(() => {
			visible.value = true;
			startTimer();
		});

		return {
			customStyle,
			visible
		};
	}
});
</script>

<style lang="scss" scoped>
.message-fade-enter-from,
.message-fade-leave-to {
	opacity: 0;
	transform: translate(-50%, -100%);
}

.h-message {
	position: fixed;
	background-color: skyblue;
	border-radius: 4px;
	left: 50%;
	transform: translateX(-50%);
	transition: opacity 0.3s, transform 0.4s, top 0.4s;
	min-width: 200px;
	height: 30px;
	padding: 6px;
}
</style>
