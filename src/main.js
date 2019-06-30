import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css"
import "../public/css/index.css"

import * as filters from "../src/filter/index";
Object.keys(filters).forEach(item => {
    Vue.filter(item, filters[item])
})

Vue.config.productionTip = false;
Vue.use(ElementUI)
    //注册一个导航守卫
router.beforeEach((to, from, next) => {
    if (to.path === '/login') {
        next();
        return
    };
    if (localStorage.getItem('token')) {
        next()
    } else {
        router.push('./login')
    }


})

new Vue({
    router,
    render: h => h(App)
}).$mount("#app");