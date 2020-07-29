import myRequest from "@/utils/request";
import axios from 'axios'

export const customer = (data) => {
    return myRequest({
        url: '/customer/customer',
        data,
        method: 'POST'
    })
}


//======登陆 login模块========
export const loginRegister = (data) => {
    return myRequest({
        url: '/login_register/',
        data,
        method: 'POST'
    })
}

//获取图形验证码
export const captcha = (params) => {
    return myRequest({
        url: '/login_register/captcha',
        params,
        method: 'GET'
    })
}

//获取短信验证码
export const sms = (params) => {
        return myRequest({
            url: '/login_register/sms',
            params,
            method: 'GET'
        })
    }
    //======登陆login模块结束========




//=====用户信息 users模块========

//个人中心 账户信息
export const profile = (params) => {
    return myRequest({
        url: '/users/profile',
        params,
        method: 'GET'
    })
}

//修改个人信息
export const profileInfo = (data) => {
    return myRequest({
        url: '/users/profile',
        data,
        method: 'PUT'
    })
}

//上传头像
export const avatar = (formData) => {
    const service = axios.create({
        baseURL: process.env.VUE_APP_BASE_API,
        timeout: 99999
    })
    service.defaults.headers.common['token'] = localStorage.getItem('userToken') ? localStorage.getItem('userToken') : localStorage.getItem('token')
    return service.post('/users/profile/avatar', formData)
}

//=========用户信息 users模块结束============






//==========套餐=========================
//获取套餐列表
export const pkg = (params) => {
    return myRequest({
        url: '/pkg',
        params,
        method: 'GET'
    })
}


//获取单个套餐
export const pkgID = (id) => {
    return myRequest({
        url: `/pkg/${id}`,
        method: 'GET'
    })
}
//==========套餐结束=========================




//============购物车模块================

//获取购物车里面的pkg列表
export const cart = (params) => {
    return myRequest({
        url: '/cart/',
        params,
        method: 'GET'
    })
}

//获取购物车里面的pkg列表
export const addCart = (data) => {
    return myRequest({
        url: '/cart/',
        data,
        method: 'POST'
    })
}

//删除购物车条目
export const deleteCart = (data) => {
    return myRequest({
        url: '/cart/',
        data,
        method: 'DELETE'
    })
}


//============购物车模块结束================






//============订单模块=====================

//创建订单
export const orders = (data) => {
    return myRequest({
        url: '/orders/',
        data,
        method: 'POST'
    })
}

//二次支付
export const scnd_pay = (data) => {
    return myRequest({
        url: '/pay/scnd_pay',
        data,
        method: 'POST'
    })
}


//尚未支付的状态下取消订单
export const cancel_order = (data) => {
    return myRequest({
        url: '/cancel_order/',
        data,
        method: 'PUT'
    })
}

//支付的状态下申请退款
export const refund_order = (data) => {
    return myRequest({
        url: '/refund_order/',
        data,
        method: 'PUT'
    })
}



//=========商品列表搜索项字典============

export const categories = () =>{
    return myRequest({
        url: '/categories',
        method: 'get'
    })
    
}

export const diseases = () =>{
    return myRequest({
        url: '/diseases',
        method: 'get'
    })
    
}
