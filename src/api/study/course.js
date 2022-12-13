import request from '@/utils/request'

export function courseAdd (data) {
  return request({
    url: '/course/add',
    method: 'post',
    data
  })
}

export function courseList (data) {
  return request({
    url: '/course/list',
    method: 'post',
    data
  })
}
