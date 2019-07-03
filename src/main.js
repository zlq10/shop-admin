import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css"
import "../public/css/index.css"
import axios from 'axios';



// 通过defaults给axios设置一个默认的baseURL，可以在所有请求中都能用到这个地址
axios.defaults.baseURL = "http://localhost:8888/api/private/v1/";

// 设置axios的请求拦截器
axios.interceptors.request.use(function(config) {
    // config 就是拦截到的请求相关的所有的信息
    // 这个信息是可以进行修改的
    // console.log(config);
    config.headers.Authorization = localStorage.getItem("token");
    // return config不能动，这个函数中必须有这个内容
    return config;
});
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