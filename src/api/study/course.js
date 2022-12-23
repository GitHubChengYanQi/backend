import request from '@/utils/request'

export function courseAdd (data) {
  return request({
    url: '/course/add',
    method: 'post',
    data
  })
}

export function courseEdit (data) {
  return request({
    url: '/course/edit',
    method: 'post',
    data
  })
}

export function courseList (data, params) {
  return request({
    url: '/course/list',
    method: 'post',
    data,
    params
  })
}

export function courseDetail (data) {
  return request({
    url: '/course/detail',
    method: 'post',
    data
  })
}

export function courseDelete (data) {
  return request({
    url: '/course/delete',
    method: 'post',
    data
  })
}
