import axios from 'axios'

const appId = "X15i835PMDNsPcMdod2p9oVk";
const appSecret = "pF2WqLKSwGQCrHKdzDwZpdov";

/* tslint:disable:no-string-literal */
const instance = axios.create({
    baseURL: 'https://gp-server.hunger-valley.com/',
    headers: {
        't-app-id': appId,
        't-app-secret': appSecret,
    }
});

// 添加请求拦截器
instance.interceptors.request.use((config) => {
    // 在发送请求之前做些什么
    const xToken = localStorage.getItem('x-token');
    if (xToken) {
        config.headers['Authorization'] = `Bearer ${xToken}`
    }
    return config;
}, (error) => {
    // 对请求错误做些什么
    console.log(error);
    return Promise.reject(error);
});

// 添加响应拦截器
instance.interceptors.response.use((response) => {
    // 对响应数据做点什么
    if (response.headers['x-token']) {
        localStorage.setItem('x-token', response.headers['x-token'])
    }
    return response;
}, (error) => {
    // 对响应错误做点什么
    return Promise.reject(error);
});
/* tslint:enable:no-string-literal */
export default instance