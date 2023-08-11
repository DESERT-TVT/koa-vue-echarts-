import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/css/global.css'
// 引入字体的文件
import './assets/font/iconfont.css'
import SocketService from '@/utils/socket_service'
SocketService.Instance.connect()
Vue.prototype.$socket = SocketService.Instance
Vue.prototype.$echarts = window.echarts
Vue.config.productionTip = false
//this.$socket

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
