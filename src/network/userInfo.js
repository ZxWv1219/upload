import { request, crossDomain } from './request';


/**
 * 获取用户信息
 * @param {*} token 
 */
export function getUserInfo(router) {
  return request({
    url: crossDomain() + '/getUserInfo'
  }, 'get', router)
}