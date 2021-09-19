import Vue from 'vue'
import App from './App.vue'
import router from './router'

import systemFunctions from '@/assets/SystemFunctions'
Vue.prototype.$systemFunctions = systemFunctions;

import systemHtmlElementsAction from '@/assets/SystemHtmlElementsAction'
Vue.prototype.$systemHtmlElementsAction = systemHtmlElementsAction;

//axios
import axios from 'axios';
Vue.prototype.$axios = axios;

// For Alerts
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";
const options = {
  timeout: false,
  position: "top-center",
  transition: "Vue-Toastification__fade",
  maxToasts: 1,
};
Vue.use(Toast, options);

Vue.config.productionTip = false

new Vue({
  router,
  render: function (h) { return h(App) }
}).$mount('#system-app')
