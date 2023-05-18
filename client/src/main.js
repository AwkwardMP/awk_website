import { createApp } from 'vue';
import App from './App.vue';

import store from './store';
import router from './router';

const app = createApp(App);

app.use(store);
app.use(router);

import socket from './socket';

const socketProtocol = (window.location.protocol === 'https:' ? 'wss:' : 'ws:');
const socketURL = socketProtocol + '//' + window.location.hostname  + (import.meta.env.PROD ? '/' : ':3000/');

app.use(socket, socketURL, {
    reconnectEnabled: true,
    reconnectInterval: 5000,
});

import './assets/style.css';
app.mount('#app')