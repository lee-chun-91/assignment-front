import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import { Button, Checkbox, Input, Select, Switch, Pagination, MessageBox } from 'element-ui';


Vue.config.productionTip = false;

Vue.use(ElementUI);
Vue.use(Button, Checkbox, Input, Select, Switch, Pagination, MessageBox);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
