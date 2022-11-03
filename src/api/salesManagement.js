import request from '@/utils/request'

// SOP
export function userSopListReq (params) {
  return request({
    url: '/sop_task/find',
    method: 'post',
    data: params
  })
}
export function delSopItemReq (params) {
  return request({
    url: '/sop_task/drop',
    method: 'post',
    data: params
  })
}
export function userSopSettingReq (params) {
  return request({
    url: '/sop_task/save',
    method: 'post',
    data: params
  })
}
export function getUserSopReq (params) {
  return request({
    url: '/sop_task/load',
    method: 'post',
    data: params
  })
}
export function userSopTaskItemSettingReq (params) {
  return request({
    url: '/sop_task/dope',
    method: 'post',
    data: params
  })
}
export function delSopTaskItemReq (params) {
  return request({
    url: '/sop_task/gone',
    method: 'post',
    data: params
  })
}
export function getDepartmentGroupListReq (params) {
  return request({
    url: '/sop_task/room',
    method: 'post',
    data: params
  })
}

export function getExpectNumReq (params) {
  return request({
    url: '/sop_task/mass',
    method: 'post',
    data: params
  })
}

export function sopItemOpenReq (params) {
  return request({
    url: '/sop_task/open',
    method: 'post',
    data: params
  })
}

// 部门列表 searchKeyWords
export function getDepartmentListReq (params) {
  return request({
    url: '/workDepartment/index',
    method: 'get',
    params: params
  })
}
