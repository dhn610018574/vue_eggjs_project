/*
 * @Author: ji.xuyu
 * @Date: 2020-02-03 12:13:58
 * @LastEditors  : ji.xuyu
 * @LastEditTime : 2020-02-10 19:21:09
 * @Description: file content
 */
import Vue from 'vue';
import App from './App.vue';
import router from './router';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'
import './assets/css/common.less'
// import '.'
import Filter from './utils/filters';
import Global from './utils/global';
import moment from 'moment'
import store from './store/index.js';
import Http from './api/api'


Vue.config.productionTip = false

Vue.use(ElementUI)
Vue.use(Global)
Vue.use(Filter)

Vue.prototype.moment = moment
Vue.prototype.Http = Http



new Vue({
	router,
	store,
	render: h => h(App)
}).$mount('#app')