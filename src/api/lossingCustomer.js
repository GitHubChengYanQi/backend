import request from '@/utils/request'

// 获取列表
export function wastageContactFind (data) {
  return request({
    url: '/wastage_contact/find',
    method: 'post',
    data
  })
}

export function wastageContactDown (data) {
  return request({
    url: '/wastage_contact/down',
    method: 'post',
    data,
    responseType: 'blob'
  })
}
