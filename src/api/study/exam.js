import request from '@/utils/request'

export function examAdd (data) {
  return request({
    url: '/exam/add',
    method: 'post',
    data
  })
}

export function examList (data) {
  return request({
    url: '/exam/list',
    method: 'post',
    data
  })
}

export function examDetail (data) {
  return request({
    url: '/exam/detail',
    method: 'post',
    data
  })
}
