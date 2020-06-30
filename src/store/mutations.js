import * as types from '@/store/mutations-types'

const mutations = {
  /**
   * 记录当前用户信息
   * @param {*} state 
   * @param {*} userInfo 
   */
  [types.USER_INFO](state, userInfo) {
    state.userInfo = userInfo
  },
  /**
   * 记录当前用户token
   * @param {}} state 
   * @param {*} token 
   */
  [types.USER_TOKEN](state, token) {
    state.token = token
  }
}

export default mutations
