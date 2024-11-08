import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "virtual:uno.css";

// css
import "./assets/css/reset.css";
// plugin
import plugins from "./plugins";

// import { createAutoCheck } from "../script/version-check";

createApp(App).use(router).use(plugins).mount("#app");

// if (!import.meta.env.DEV) {
// 	createAutoCheck({ useWorker: false }).start();
// }
