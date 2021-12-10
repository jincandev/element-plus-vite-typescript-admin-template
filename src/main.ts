import { createApp } from "vue";
import { createI18n } from "vue-i18n";
import ElementUI from "element-plus";

import "normalize.css/normalize.css";

// 全局样式
import "@/styles/iconfont/iconfont.css";
import "@/styles/index.scss";

import App from "./App.vue";
import router from "./router";
import store from "./store";
import Storage from "./utils/storage";

import "./permission";
//测试
import "@/apis/index"

// 国际化
import zhLocale from "element-plus/lib/locale/lang/zh-cn";
import enLocale from "element-plus/lib/locale/lang/en";
import zh from "./common/locales/zh.json";
import en from "./common/locales/en.json";
const messages = {
  [zhLocale.name]: {
    el: zhLocale.el, // 如果`el`属性被替换，则ElementPlus内部组件的国际化会失效
    ...zh,
  },
  [enLocale.name]: {
    el: enLocale.el,
    ...en,
  },
};
const FALLBACK_LOCALE = "zh-cn";
const lang = Storage.get("language") || FALLBACK_LOCALE;
const i18n = createI18n({
  locale: lang,
  fallbackLocale: FALLBACK_LOCALE,
  messages,
  legacy: false,
});

const app = createApp(App);

app.config.globalProperties.$t = i18n.global.t

app
  .use(i18n)
  .use(ElementUI, {
    size: Storage.get("component_size") || "medium",
    i18n: i18n.global.t,
  })
  .use(router)
  .use(store)
  .mount("#app");
