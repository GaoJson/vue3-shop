import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index'

import { setupPageStackRouter } from './router/pageStack'

import pinia from "./store/index";

import 'vant/lib/index.css'
import Vant from "vant";

const app = createApp(App)
app.use(router);
app.use(Vant);
app.use(pinia)
setupPageStackRouter(app);
app.mount('#app')
