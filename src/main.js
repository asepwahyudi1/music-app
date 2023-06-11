import { createApp } from "vue";
import { createPinia } from "pinia";
import "./style.css";
import App from "./App.vue";
import router from "./router";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import axios from "axios";

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

const app = createApp(App);
axios.defaults.baseURL = "https://matrikdev-music-api.vercel.app";
app.use(pinia);
app.use(router);
app.mount("#app");
