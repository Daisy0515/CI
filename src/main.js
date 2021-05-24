
import Vue from 'vue'
import App from './App'
import router from './router'
import '@/assets/iconfont/iconfont.css'
import '@/assets/scss/font.css'
import store from './store/index.js'
import getElement from './utils/elementDemand.js'
import preventClick from './utils/preventClick'
import promise from 'es6-promise';
import Chat from 'jwchat';
import htmlToPdf from './utils/htmlToPdf.js'

promise.polyfill();
// import "@/assets/js/style.scss";
Vue.use(htmlToPdf)
Vue.use(getElement)
Vue.use(preventClick)
Vue.use(Chat)
Vue.config.productionTip = false;
import assign from 'object-assign';
assign({}, {});
import '@/assets/scss/public.scss';
import  '@/assets/scss/element-variables.scss';
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app")
