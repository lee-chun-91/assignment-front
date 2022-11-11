import Vue from 'vue';
import App from './App.vue';
import router from './router';
import { store } from './store';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import { ValidationProvider } from 'vee-validate';

// import { Button, Radio, Checkbox, Input, Select, Switch, Pagination, Loading, MessageBox, Breadcrumb, BreadcrumbItem } from 'element-ui';


Vue.config.productionTip = false;

Vue.use(ElementUI);
Vue.component('ValidationProvider', ValidationProvider);
// Vue.use(Button, Radio, Checkbox, Input, Select, Switch, Pagination, Loading, MessageBox);
// Vue.use(Loading.directive);
// Vue.prototype.$loading = Loading.service;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
