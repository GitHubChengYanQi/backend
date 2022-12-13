import request from '@/utils/request'

export function courseClassAdd (data) {
  return request({
    url: '/courseClass/add',
    method: 'post',
    data
  })
}

export function courseClassTreeView (data) {
  return request({
    url: '/courseClass/treeView',
    method: 'post',
    data
  })
}

export function courseClassUpdate (data) {
  return request({
    url: '/courseClass/update',
    method: 'post',
    data
  })
}

export function courseClassDelete (data) {
  return request({
    url: '/courseClass/delete',
    method: 'post',
    data
  })
}
