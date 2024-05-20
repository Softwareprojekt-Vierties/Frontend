import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import axios from 'axios';

// Setze die Basis-URL für alle Anfragen
axios.defaults.baseURL = 'https://jsonplaceholder.typicode.com';

// Erstelle die App-Instanz
const app = createApp(App);

// Füge Axios zu Vue-Instanz hinzu
app.config.globalProperties.$axios = axios;

createApp(App).use(router).mount('#app')
