import { createApp } from 'vue';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import axios from 'axios';


// Setzen der korrekten Basis-URL für alle Anfragen
axios.defaults.baseURL = 'https://webserver-eventure.onrender.com';

// Hole den Token aus localStorage, falls vorhanden, und setze ihn in den Axios-Headern
const token = localStorage.getItem('jwt_token');
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

// Erstelle die App-Instanz
const app = createApp(App);

// Füge Axios zur Vue-Instanz hinzu
app.config.globalProperties.$axios = axios;

// Verwende Router und mounte die App
app.use(router).mount('#app');