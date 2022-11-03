import request from '@/utils/request'

// 列表
export function getList (params) {
  return request({
    url: '/roomTag/index',
    method: 'get',
    params
  })
}

// 添加
export function add (params) {
  return request({
    url: '/roomTag/store',
    method: 'post',
    data: params
  })
}

// 修改
export function update (params) {
  return request({
    url: '/roomTag/update',
    method: 'put',
    data: params
  })
}

// 添加标签
export function addTag (params) {
  return request({
    url: '/roomTag/storeTag',
    method: 'post',
    data: params
  })
}

// 添加群标签
export function roomTagStore (params) {
  return request({
    url: '/roomTag/roomTagStore',
    method: 'post',
    data: params
  })
}

// 删除标签
export function del (params) {
  return request({
    url: '/roomTag/destroy',
    method: 'delete',
    data: params
  })
}
