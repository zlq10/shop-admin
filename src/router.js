import Vue from "vue";
import Router from "vue-router";
import login from "./assets/login.vue";
import Home from "./assets/Home.vue";
import user from "./assets/user.vue"


Vue.use(Router);



export default new Router({
    routes: [{
            path: '/login',
            component: login
        },
        {
            path: '/Home',
            component: Home,
            children: [{
                    path: '/user',
                    component: user
                }

            ]
        },
        {
            path: '/',
            redirect: '/home'
        }

    ]
});