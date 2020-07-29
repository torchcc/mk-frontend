import axios from 'axios'; // 引入axios
// import { Message} from 'element-ui';
import router from '@/router'
import { Toast , Dialog } from 'vant';

const service = axios.create({
    baseURL: process.env.VUE_APP_BASE_API,
    timeout: 99999
})

//http request 拦截器
service.interceptors.request.use(
    config => {
        config.data = JSON.stringify(config.data);
        config.headers = {
            'Content-Type': 'application/json',
            'token': localStorage.getItem('token') || undefined,
        }
        return config;
    },
    error => {
        Toast.fail(error)
    }
);


//http response 拦截器
service.interceptors.response.use(
    response => {
        if (response.data.ecode == 0) {
            return response.data
        } else if (response.data.ecode == -400) {
            Toast.fail(response.data.emsg)
            return response.data
        } else if (response.data.ecode == -401) {
            window.localStorage.setItem("auth", false)
            window.localStorage.removeItem("token")
            window.location.reload()
        } else if (response.data.ecode == -110) {
            Dialog.confirm({
                title: '暂未登录',
                message: '点击登录前往登录页面',
                confirmButtonText:"前往登录",
                cancelButtonText:"暂不登陆",
              })
                .then(() => {
                  router.push({ name: "login" })
                })
                .catch(() => {
                  // on cancel
                });
            
        }
    },
    error => {
        console.error(error)
    }
)

export default service