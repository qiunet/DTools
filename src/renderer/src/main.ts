import { createApp } from 'vue';
import 'element-plus/dist/index.css';
import App from './App.vue';
import ElementPlus from 'element-plus';
import router from './router';
import store from './store';

createApp(App)
    .use(store)
    .use(router)
    .use(ElementPlus)
    .mount('#app')

// window.tool_api.convert('/Users/qiunet/doc/xf3d/client/Config/content/B背包_backpack.xlsx', (str) => {
//     console.log("main.ts getter", str)
// });
//
// console.log(window.tool_api.setting())
