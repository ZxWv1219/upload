import { request, crossDomain } from './request';


/**
 * 获取统计数据
 */
export function getTotalNum() {
  return request({
    url: crossDomain() + '/files/getTotalNum'
  })
}


/**
 * 获取文件列表 
 * @param {*} start 从第几行开始（int）
 * @param {*} limit 每页显示行数（int）
 * @param {*} type 0显示分公司  1：只看自己
 * @param {*} orderby 排序 例：createTime desc
 */
export function getFiles(start = 0, limit = 50, type = 0, orderby) {
  return request({
    url: crossDomain() + '/files/getFiles',
    params: {
      start,
      limit,
      type,
      orderby
    }
  })
}

export function updateFile(file) {
  let formData = new FormData();
  formData.append('file', file.file);
  return request({
    url: crossDomain() + '/files/uploadFile',
    headers: {
      'Content-Type': "multipart/form-data"
    },
    data: formData
  }, "post")
}

export function removeFile(fileId) {
  return request({
    url: crossDomain() + '/files/removeFile',
    params: {
      fileId
    }
  }, "post")
}