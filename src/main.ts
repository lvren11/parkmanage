import { createApp } from "vue";
import ElementPlus from "element-plus";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import './mock/index';
import "element-plus/dist/index.css";
import "./assets/css/main.css";
import "./assets/icons/iconfont.js";
import * as Icons from '@element-plus/icons-vue';  
import { Store } from "vuex";
declare module "@vue/runtime-core" {
  interface State {
    count: number;
  }

  interface ComponentCustomProperties {
    $store: Store<State>;
  }
}

const app = createApp(App);  
  
// 注册所有图标  
Object.keys(Icons).forEach(key => {  
  app.component(key, Icons[key]);  
});  
  
app.use(store).use(router).use(ElementPlus).mount("#app");
