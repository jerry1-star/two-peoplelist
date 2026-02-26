import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'
import router from './router'
import AppIcon from './components/AppIcon.vue'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.component('AppIcon', AppIcon)
app.mount('#app')
