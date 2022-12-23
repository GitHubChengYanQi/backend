import request from '@/utils/request'

export function courseWareAdd (data) {
  return request({
    url: '/courseWare/add',
    method: 'post',
    data
  })
}

export function courseWarEdit (data) {
  return request({
    url: '/courseWare/edit',
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

export function courseWareDetail (data, params) {
  return request({
    url: '/courseWare/detail',
    method: 'post',
    data,
    params
  })
}

export function courseWareDelete (data) {
  return request({
    url: '/courseWare/delete',
    method: 'post',
    data
  })
}
