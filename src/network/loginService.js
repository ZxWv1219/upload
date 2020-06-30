import { request, crossDomain } from './request';


/**
 * 用户登录
 * @param {*} account 
 * @param {*} password 
 */
export function userLogin(account, password) {
  return request({
    url: crossDomain() + '/login',
    params: {
      account,
      password
    }
  })
}