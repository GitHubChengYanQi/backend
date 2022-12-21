import request from '@/utils/request'

export function courseTask (data) {
  return request({
    url: '/courseTask/add',
    method: 'post',
    data
  })
}
