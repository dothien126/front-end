import { createApp } from 'vue';
import mitt from 'mitt';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import globalComponents from './global-components';
import utils from './utils';
import directives from './directives';
import './assets/css/app.css';
import './assets/scss/app.scss';
import VCalendar from 'v-calendar';

const emitter = mitt();
const app = createApp(App).use(router).use(createPinia()).use(VCalendar, {});

globalComponents(app);
utils(app);
directives(app);
app.config.globalProperties.emitter = emitter;
app.mount('#app');