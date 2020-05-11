import axios from 'axios'
import {
    Message
} from 'element-ui'
import router from '../router'



axios.defaults.timeout = 15000
axios.defaults.withCredentials = true
axios.defaults.responseType = 'json'
axios.defaults.headers.common['Cache-Control'] = 'no-cache'
axios.defaults.headers.get['If-Modified-Since'] = '0'
axios.defaults.cache = false
// http request 拦截器
axios.interceptors.request.use(
    config => {
        if (localStorage.getItem('auth_token')) { // 判断是否存在token，如果存在的话，则每个http header都加上token
            config.headers.Authorization = localStorage.getItem('auth_token');
        }
        return config;
    },
    err => {
        return Promise.reject(err);
    });
// http response 拦截器
axios.interceptors.response.use(
    response => {
        // 接口拦截，用户未登陆
        if (response.data.code === 0 || response.data.code === 200) {
            return response
        } else {
            if (response.data.code === 2001) {
                localStorage.removeItem('auth_token') //过期
                localStorage.removeItem('userName') //过期
                localStorage.removeItem('Accesslevel') //过期
                // 登录过期
                Message.error(response.data.msg || '登录过期,请重新登录');
                router.push('login')
                return Promise.reject(response.data)
            } else if (response.data.code === 2002) {
                // 登录过期
                Message.error(response.data.msg || '用户名已经存在');
                return Promise.reject(response.data)
            } else {
                Message.error(response.data.msg || '系统异常！');
                return Promise.reject(response.data)
            }
        }
    },
    error => {
        Message.error('系统异常！请稍后再试');
        if (error.response && error.response.data) {
            return Promise.reject(error.response.data) // 返回接口返回的错误信息
        } else {
            return Promise.reject(error.msg)
        }
    })




export default class Http {
    static send(config) {
        const currentUrl = encodeURIComponent(window.location.href)
        const configs = Object.assign({
            headers: {
                'currentUrl': currentUrl,
                'L-A-Platform': 'erp-web' //后端日志埋点渠道
            },
            timeout: 30000
        }, config)

        return axios(configs).then((res) => {
            return res
        }).catch((error) => {
            throw error
        })
    }

    static post(url, params = {}) {
        const config = {
            method: 'post',
            url,
            data: params
        }
        return Http.send(config)
    }

    static get(url, params = {}) {
        let urlParams = []
        Object.keys(params).forEach((key) => {
            urlParams.push(`${key}=${encodeURIComponent(params[key])}`)
        })
        if (urlParams.length) {
            urlParams = `${url}?${urlParams.join('&')}`
        } else {
            urlParams = url
        }
        const config = {
            url: urlParams,
            params: {
                randomTime: new Date().getTime() // 防止缓存
            }
        }
        return Http.send(config)
    }
}