import Vue from 'vue'
import App from './App.vue'
import router from './router'

import systemFunctions from '@/assets/SystemFunctions'
Vue.prototype.$systemFunctions = systemFunctions;

import systemHtmlElementsAction from '@/assets/SystemHtmlElementsAction'
Vue.prototype.$systemHtmlElementsAction = systemHtmlElementsAction;

Vue.config.productionTip = false

new Vue({
  router,
  render: function (h) { return h(App) }
}).$mount('#system-app')
