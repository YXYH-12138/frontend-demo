import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

// css
import "./assets/css/reset.css";
import "leaflet/dist/leaflet.css";
import "element-plus/es/components/menu/style/css";
import "element-plus/es/components/menu-item/style/css";
import "element-plus/es/components/sub-menu/style/css";
// plugin
import "./plugins";

createApp(App).use(router).mount("#app");