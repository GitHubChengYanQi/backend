import request from '@/utils/request'

export function getGroupList (params) {
  return request({
    url: '/channelCodeGroup/index',
    method: 'get',
    params
  })
}

export function addGroup (params) {
  return request({
    url: '/channelCodeGroup/store',
    method: 'post',
    data: params
  })
}

export function delGroup (params) {
  return request({
    url: '/channelCodeGroup/destroy',
    method: 'delete',
    params
  })
}

export function updateGroup (params) {
  return request({
    url: '/channelCodeGroup/update',
    method: 'put',
    data: params
  })
}

export function delCode (params) {
  return request({
    url: '/channelCode/destroy',
    method: 'delete',
    params
  })
}

export function move (params) {
  return request({
    url: '/channelCodeGroup/move',
    method: 'put',
    data: params
  })
}

export function getCodeList (params) {
  return request({
    url: '/channelCode/index',
    method: 'get',
    params
  })
}

export function getCodeDetail (params) {
  return request({
    url: '/channelCode/show',
    method: 'get',
    params
  })
}

export function addCode (params) {
  return request({
    url: '/channelCode/store',
    method: 'post',
    data: params
  })
}

export function updateCode (params) {
  return request({
    url: '/channelCode/update',
    method: 'put',
    data: params
  })
}

export function getStatistics (params) {
  return request({
    url: '/channelCode/statistics',
    method: 'get',
    params
  })
}

export function getStatisticsTable (params) {
  return request({
    url: '/channelCode/statisticsIndex',
    method: 'get',
    params
  })
}

export function getCodeAllList (params) {
  return request({
    url: '/channelCode/channelCodeIndex',
    method: 'get',
    params
  })
}
