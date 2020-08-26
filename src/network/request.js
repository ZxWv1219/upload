import axios from 'axios'
import { Toast } from 'vant';

import storage from '@/store/myStorage'

/**
 * 是否开发 /api 开发, '' 正式环境
 */
export function crossDomain() {
  return ''//正式环境
  // return '/api' //开发
}

export function request(config, method = 'get', router, isShowToast = true) {
  var headers
  if (config.headers) {
    headers = Object.assign(config.headers, { 'token': storage.get('token') })
  } else {
    headers = { 'token': storage.get('token') || null }
  }

  const req = axios.create({
    baseURL: "/webupload",//正式环境
    // baseURL: "http://www.lz-10086.com/webupload",
    // baseURL: "http://193.193.50.98:8080/",
    method: method,
    timeout: 10000,
    headers: headers
  })
  //因特赛pe特斯:拦截器
  //请求拦截
  req.interceptors.request.use(
    config => {
      //1.可以修改配置,参数,头部信息
      //2.显示loading界面
      return config
    },
    err => {
      console.log(err)
      return err
    })
  isShowToast && Toast.loading({
    duration: 0,
    message: '加载中...',
    forbidClick: true,
  });

  //响应拦截
  req.interceptors.response.use(
    res => {
      //统一判断返回结果成功,失败,异常,或token失效等
      //隐藏loading界面
      isShowToast && Toast.clear()
      // console.log('*************拦截器response返回res.data*************')
      if (res.data.resultCode == '0002') {
        router.push('/login')
        return ''
      } else {
        return res.data
      }
    },
    err => {
      // console.log(err)
      Toast.fail('失败')
      return err

    }
  )
  //axios 返回本身就是一个Promise,所以直接返回
  return req(config)
}

