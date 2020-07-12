import axios from 'axios'
import store from '../store/index.js'
//let api = "http://10.249.46.207:8083/cosine-core-web-api/"
//let api = "http://118.178.194.230:8083/cosine-core-web-api/"//测试环境
let api = "http://120.79.19.115:8083/cosine-core-web-api/" //new测试环境
// let api = "http://8.129.186.75:8083/cosine-core-web-api/"
//let api = "http://120.25.149.86:8083/"
// let api = "http://api.cosine.ienkel.com/cosine-core-web-api/"
//let api = "http://10.250.19.18:8081/cosine-core-web-api/"
// let api = "http://192.168.5.112:8081/cosine-core-web-api/"
// let api = "http://192.168.5.112:8081/cosine-core-web-api/"
// let api = "/api"
// let api = ''
import router from '@/router'
import {
  MessageBox
} from "element-ui";
import {
  errTips
} from "@/utils/tips.js";
axios.defaults.headers.common['Content-Type'] = 'application/json;charset=UTF-8';
axios.defaults.timeout = 10000;
axios.interceptors.request.use(
  config => {
    const token = store.state.userToken
    token && (config.headers.accessToken = token);
    return config;
  },
  err => {
    return Promise.reject(err);
  });
export const httpGet = (url, params) => {
  url = url.indexOf('?') == '-1' ? url + '?' + (new Date().getTime()) : url + '&&' + (new Date().getTime())
  return axios.get(api + url, {
    params: params
  })
}
export const httpPost = (url, data) => {
  return axios.post(api + url, data, {
    headers: {
      'Content-Type': 'application/json;'
    }
  })
}
export const httpPut = (url, data) => {
  return axios.put(api + url, data)
}
export const httpDelete = (url, data) => {
  return axios.delete(api + url, data)
}



// // http request 拦截器

// http response 拦截器
axios.interceptors.response.use(
  response => {
    // console.log('join method get token',store.state.userToken)
    switch (response.data.httpCode) {
      case 401:
        if (store.state.userToken != undefined) {
          store.commit("setLogout")
          MessageBox.alert('登录过期,请重新登录', '提示', {
            type: 'warning',
            confirmButtonText: '确定',
            callback: () => {
              router.push({
                path: '/login'
              })
            }
          });
          return false
        }
        break;
      case 207:
        errTips("已发送验证码，请1分钟后再试")
        break;
    }
    return response;
  },
  error => {
    // errTips("请求超时！");
    if (!error.response) {
      // 请求超时状态
      if (error.message.includes('timeout')) {
        errTips('请求超时，请检查网络是否连接正常')
      } else {
        errTips('请求失败，请检查网络是否已连接')
      }
      return
    }
    return Promise.reject(error) // 返回接口返回的错误信息
  });
