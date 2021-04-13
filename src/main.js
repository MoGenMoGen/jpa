import Vue from 'vue'
import App from './App'
import init from "./utils/init";
Vue.use(init);


Vue.config.productionTip = false
App.mpType = 'app'

const app = new Vue(App)

app.$mount()
Vue.prototype.globalData = getApp().globalData
