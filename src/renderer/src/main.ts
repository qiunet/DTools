import { createApp } from 'vue';
import 'element-plus/dist/index.css';
import App from './App.vue';
import ElementPlus from 'element-plus';
import Menus from 'vue3-menus';
import router from './router';
import store from './store';

createApp(App)
    .use(store)
    .use(router)
    .use(Menus)
    .use(ElementPlus)
    .mount('#app')
