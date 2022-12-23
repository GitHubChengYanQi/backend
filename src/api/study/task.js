import request from '@/utils/request'

export function courseTaskAdd (data) {
  return request({
    url: '/courseTask/add',
    method: 'post',
    data
  })
}

export function courseTaskList (data) {
  return request({
    url: '/courseTask/list',
    method: 'post',
    data
  })
}

export function examTaskAdd (data) {
  return request({
    url: '/examTask/add',
    method: 'post',
    data
  })
}

export function examTaskList (data) {
  return request({
    url: '/examTask/list',
    method: 'post',
    data
  })
}
