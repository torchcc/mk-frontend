import Vue from 'vue'
import VueRouter from 'vue-router'

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}



Vue.use(VueRouter)

const routes = [{
        path: '/',
        redirect: '/layout/examList',
    },
    {
        path: "/layout",
        name: "layout",
        component: () =>
            import ("@/views/layout/index.vue"),
        children: [{
                path: "examList",
                name: "examList",
                component: () =>
                    import ("@/views/exam/list.vue")
            },
            {
                path: "shopCart",
                name: "shopCart",
                component: () =>
                    import ("@/views/shopCart/index.vue")
            },
            {
                path: "mine",
                name: "mine",
                component: () =>
                    import ("@/views/mine/index.vue")
            }
        ]
    },
    {
        path: "/examInfo",
        name: "examInfo",
        component: () =>
            import ("@/views/exam/info.vue")
    },
    {
        path: "/login",
        name: "login",
        component: () =>
            import ("@/views/login/login.vue")
    },
    {
        path: "/passwordLogin",
        name: "passwordLogin",
        component: () =>
            import ("@/views/login/passwordLogin.vue")
    },
    {
        path: "/forgotPwd",
        name: "forgotPwd",
        component: () =>
            import ("@/views/login/forgotPwd.vue")
    },
    {
        path: "/mineDetail",
        name: "mineDetail",
        component: () =>
            import ("@/views/mine/mineDetail.vue")
    },
    {
        path: "/orderDetail",
        name: "orderDetail",
        component: () =>
            import ("@/views/mine/orderDetail.vue")
    },
    {
        path: "/personalInfo",
        name: "personalInfo",
        component: () =>
            import ("@/views/mine/personalInfo/personalInfo.vue")
    },
    {
        path: "/personal",
        name: "personal",
        component: () =>
            import ("@/components/personal.vue")
    },
    {
        path: "/contact",
        name: "contact",
        component: () =>
            import ("@/views/mine/contact.vue")
    },
    {
        path: "/order",
        name: "order",
        component: () =>
            import ("@/views/order/index.vue")
    },


]

const router = new VueRouter({
    mode: "hash",
    routes
})

export default router