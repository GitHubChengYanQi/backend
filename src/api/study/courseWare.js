import request from '@/utils/request'

export function courseWareAdd (data) {
  return request({
    url: '/courseWare/add',
    method: 'post',
    data
  })
}

export function courseWareList (data, params) {
  return request({
    url: '/courseWare/list',
    method: 'post',
    data,
    params
  })
}
