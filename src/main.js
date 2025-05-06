import Vue from 'vue'
import '@babel/polyfill'
import 'mutationobserver-shim'
import './Utils/fliter'
// import './config/firebase'
import App from './App.vue'
import router from './router'
import store from './store'
import Raphael from 'raphael/raphael'
import './plugins'
import './registerServiceWorker'
import i18n from './i18n'
import { VuejsDatatableFactory } from 'vuejs-datatable'
import VueSweetalert2 from 'vue-sweetalert2'

// If you don't need the styles, do not connect
import 'sweetalert2/dist/sweetalert2.min.css'

import Pusher from 'pusher-js'

const pusher = new Pusher(process.env.VUE_APP_PUSHER_KEY, {
  cluster: process.env.VUE_APP_PUSHER_CLUSTER
  // Additional options if needed
})

global.Raphael = Raphael
Vue.config.productionTip = false
Vue.use(VuejsDatatableFactory)
Vue.use(VueSweetalert2)
Vue.prototype.$pusher = pusher
let vm = new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')

window.vm = vm
