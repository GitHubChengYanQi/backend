import request from '@/utils/request'

// 获取列表
export function wastageContactLine (data) {
  return request({
    url: '/wastage_contact/line',
    method: 'post',
    data
  })
}

export function wastageContactCake (data) {
  return request({
    url: '/wastage_contact/cake',
    method: 'post',
    data
  })
}

export function wastageContactCalc (data) {
  return request({
    url: '/wastage_contact/calc',
    method: 'post',
    data
  })
}

export function wastageContactCome (data) {
  return request({
    url: '/wastage_contact/come',
    method: 'post',
    data,
    responseType: 'blob'
  })
}
