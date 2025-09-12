import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'
import './assets/css/main.css'
import { themeManager } from './utils/theme'
// Initialize theme system immediately
const currentTheme = themeManager.getCurrentTheme();
themeManager.applyTheme(currentTheme);

// Also apply theme after DOM is ready as a fallback
document.addEventListener('DOMContentLoaded', () => {
  themeManager.applyTheme(themeManager.getCurrentTheme());
});


const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
