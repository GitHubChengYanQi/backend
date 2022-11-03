import request, { fileRequest } from '@/utils/request'

// 协作人订单列表查询
export function acOrderList (data) {
  return request({
    url: '/acOrder/list',
    method: 'post',
    data
  })
}

// 协作人订单统计查询
export function getTotalAmount (data) {
  return request({
    url: '/acOrder/getTotalAmount',
    method: 'post',
    data
  })
}

// 协作人订单详情
export function acOrderDetail (params) {
  return request({
    url: '/acOrder/detail',
    method: 'post',
    params
  })
}

// 协作人订单导出
export function orderExport (data) {
  return fileRequest({
    url: '/acOrder/orderExport',
    method: 'post',
    responseType: 'blob',
    data
  })
}

// 客户协作人列表
export function relList (data) {
  return request({
    url: '/acOrder/relList',
    method: 'post',
    data
  })
}

// 客户协作人详情
export function contactDetail (data) {
  return request({
    url: '/acOrder/contactDetail',
    method: 'post',
    data
  })
}
// 客户协作人详情统计
export function contactDetailStat (params) {
  return request({
    url: '/acOrder/contactDetailStat',
    method: 'get',
    params
  })
}
// 客户协作人详情统计导出
export function contactDetailExport (data) {
  return fileRequest({
    url: '/acOrder/contactDetailExport',
    method: 'post',
    responseType: 'blob',
    data
  })
}
// 客户协作人关联信息导出
export function userRelExport (data) {
  return fileRequest({
    url: '/acOrder/userRelExport',
    method: 'post',
    responseType: 'blob',
    data
  })
}
// 客户设置列表
export function collaboratorList (data) {
  return request({
    url: '/collaborator_rules/list',
    method: 'post',
    data
  })
}
// 添加规则
export function collaboratorStore (data) {
  return request({
    url: '/collaborator_rules/store',
    method: 'post',
    data
  })
}
// 编辑规则
export function collaboratorModify (data) {
  return request({
    url: '/collaborator_rules/modify',
    method: 'post',
    data
  })
}
// 删除规则
export function collaboratorDestroy (params) {
  return request({
    url: '/collaborator_rules/destroy',
    method: 'delete',
    params
  })
}
// 规则状态
export function collaboratorState (params) {
  return request({
    url: '/collaborator_rules/state',
    method: 'get',
    params
  })
}
// 移除冲突人员规则
export function collaboratorDetach (params) {
  return request({
    url: '/collaborator_rules/detach',
    method: 'get',
    params
  })
}
// 保留冲突人员规则
export function collaboratorRetain (params) {
  return request({
    url: '/collaborator_rules/retain',
    method: 'get',
    params
  })
}
// 查询规则关联的人员列表
export function collaboratorRelation (data) {
  return request({
    url: '/collaborator_rules/relation',
    method: 'post',
    data
  })
}
// 移除冲突人员规则
export function collaboratorDetachSave (data) {
  return request({
    url: '/collaborator_rules/detachSave',
    method: 'post',
    data
  })
}
// 保留冲突人员规则
export function collaboratorRetainSave (data) {
  return request({
    url: '/collaborator_rules/retainSave',
    method: 'post',
    data
  })
}
