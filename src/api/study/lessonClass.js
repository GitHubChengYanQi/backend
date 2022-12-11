import request from '@/utils/request'

// courseClass 课程分类表
//
// course/课程表
//
// courseWare/课件
//
// exam/考试

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
