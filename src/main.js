import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'


import { Button } from 'vant'
import { Form } from 'vant';
import { Field } from 'vant';
import { Uploader } from 'vant';
import { Tab, Tabs } from 'vant';
import { Image as VanImage } from 'vant';
import { Col, Row } from 'vant';
import { Grid, GridItem } from 'vant';
import { Pagination } from 'vant';
import { DropdownMenu, DropdownItem } from 'vant';

Vue.use(DropdownMenu);
Vue.use(DropdownItem);
Vue.use(Pagination);
Vue.use(Grid);
Vue.use(GridItem);
Vue.use(Col);
Vue.use(Row);
Vue.use(VanImage);
Vue.use(Tab);
Vue.use(Tabs);
Vue.use(Uploader);
Vue.use(Button);
Vue.use(Form);
Vue.use(Field);

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
