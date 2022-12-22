import request from '@/utils/request'

export function courseTask (data) {
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
