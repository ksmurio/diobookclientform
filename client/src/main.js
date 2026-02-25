import { createApp } from 'vue';
import { createVuetify } from 'vuetify';
import App from './App.vue';
import { registerPlugins } from '@/plugins';
import '@mdi/font/css/materialdesignicons.css'
import router from '@/router' ;
import 'vuetify/styles';
import { components, directives } from 'vuetify/dist/vuetify.js';

const vuetify = createVuetify({
    components,
    directives,
})

const app = createApp(App);
registerPlugins(app);

app.use(router);
app.use(vuetify);
app.mount('#app');

