import type { App } from "vue";
import { createPinia } from "pinia";
import { createPersistedState } from "pinia-plugin-persistedstate"

const store = createPinia();
// 状态持久化-插件配置
store.use(createPersistedState({
  serializer: {
    serialize: JSON.stringify,// 序列化
    deserialize: JSON.parse// 反序列化
  }
}))
export function setupStore(app: App<Element>) {
  app.use(store);
}

export { store };
