import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "virtual:uno.css";

// css
import "./assets/css/reset.css";
import "element-plus/es/components/menu/style/css";
import "element-plus/es/components/menu-item/style/css";
import "element-plus/es/components/sub-menu/style/css";
// plugin
import plugins from "./plugins";

createApp(App).use(router).use(plugins).mount("#app");
