import request from '@/utils/request'

export function courseTaskAdd (data) {
  return request({
    url: '/courseTask/add',
    method: 'post',
    data
  })
}

export function courseTaskList (data, params) {
  return request({
    url: '/courseTask/list',
    method: 'post',
    data,
    params
  })
}

export function examTaskAdd (data) {
  return request({
    url: '/examTask/add',
    method: 'post',
    data
  })
}

export function examTaskDetail (data) {
  return request({
    url: '/examTask/detail',
    method: 'post',
    data
  })
}

export function examTaskList (data, params) {
  return request({
    url: '/examTask/list',
    method: 'post',
    data,
    params
  })
}
