import { createApp } from "vue";
import App from "./App.vue";
import router, { setupRouter } from "./router";
import { setupStore } from "@/stores";
import "normalize.css";
import "tailwindcss/tailwind.css";
import { setupNaive } from "@/plugins";
// 通用字体
import "vfonts/Lato.css";
import { setupNaiveDiscreteApi } from "@/plugins/naiveDiscreteApi";
async function bootstrap() {
  const app = createApp(App);
  //去除warning警告
  app.config.warnHandler = () => {};
  // 挂载状态管理
  setupStore(app);

  // 注册全局常用的 naive-ui 组件
  setupNaive(app);
  //
  // // 挂载 naive-ui 脱离上下文的 Api
  setupNaiveDiscreteApi();
  //
  // // 注册全局自定义组件
  // //setupCustomComponents();
  //
  // // 注册全局自定义指令，如：v-permission权限指令
  // setupDirectives(app);

  // 注册全局方法，如：app.config.globalProperties.$message = message
  //setupGlobalMethods(app);

  // 挂载路由
  setupRouter(app);

  // 路由准备就绪后挂载 APP 实例
  // https://router.vuejs.org/api/interfaces/router.html#isready
  await router.isReady();

  app.mount("#app", true);
}

void bootstrap();
