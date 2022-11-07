import Vue from 'vue';
import App from './App.vue';
import router from './router';
import { store } from './store';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import { Button, Radio, Checkbox, Input, Select, Switch, Pagination, Loading, MessageBox } from 'element-ui';


Vue.config.productionTip = false;

Vue.use(ElementUI);
Vue.use(Button, Radio, Checkbox, Input, Select, Switch, Pagination, Loading, Loading.directive, MessageBox);
Vue.prototype.$loading = Loading.service;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
