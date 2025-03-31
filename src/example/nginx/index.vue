<template>123</template>

<script lang="ts" setup>
import { fetchEventSource } from "@microsoft/fetch-event-source";

async function deepseepAi(content: string) {
	await fetchEventSource("/ai/open/dev-test/r1_14b/r1-14b/v1/chat/completions", {
		method: "POST",
		headers: {
			"X-Api-Key": "GXKajYL5akdpL39VKHRKtZ"
		},
		body: JSON.stringify({
			model: "shangshan-r1-beta",
			stream: true,
			messages: [{ role: "user", content }]
		}),
		onmessage(ev) {
			if (ev.data.endsWith("[DONE]")) return;
			try {
				console.log(JSON.parse(ev.data));
			} catch (e) {
				console.error(e);
			}
		},
		onerror(err) {
			// https://github1s.com/Azure/fetch-event-source/blob/HEAD/src/fetch.ts#L132-L133
			// stop retrying
			throw err;
		}
	});
}

deepseepAi("你好");
</script>

<style lang="scss" scoped></style>
