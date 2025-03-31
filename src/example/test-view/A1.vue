<template>
	<el-dialog
		draggable
		:append-to-body="true"
		v-model="visible"
		@close="handleClose"
		:modal="false"
		:close-on-click-modal="false"
	>
		A系统弹框
		<template #footer>
			<el-button type="primary" @click="hancleCancel">Cancel</el-button>
			<el-button type="primary" @click="handleConfirm">Confirm</el-button>
		</template>
	</el-dialog>
</template>

<script lang="ts" setup>
import { ref } from "vue";

const visible = ref(false);

window.addEventListener("message", function (event) {
	if (!event.origin.startsWith("http://127.0.0.1:5500")) return;
	const jsonData = JSON.parse(event.data);
	console.log("A1 received message:", event.data);
	switch (jsonData.e) {
		case "open":
			visible.value = true;
			break;
		case "close":
			visible.value = false;
			break;
	}
});

function handleClose() {
	console.log("A1 closed");
	setTimeout(() => {
		window.parent.postMessage(JSON.stringify({ e: "liaonClose" }), "*");
	}, 100);
}

function hancleCancel() {
	window.parent.postMessage(JSON.stringify({ e: "liaonClose" }), "*");
}

function handleConfirm() {
	window.parent.postMessage(JSON.stringify({ e: "liaonConfirm" }), "*");
}
</script>

<style lang="scss" scoped></style>
