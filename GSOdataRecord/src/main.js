import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './index.js'

const app = createApp(App)

const pinia = createPinia()

app.use(pinia)   // ⭐ friend's store support
app.use(router)  // ⭐ your router

app.mount('#app')