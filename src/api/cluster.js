import request, { fileRequest } from '@/utils/request'
// 获取字典
export function getDictData (params) {
  return request({
    url: '/dictData/getListByType',
    method: 'get',
    params
  })
}
// 获取群SOP模板分页数据
export function getSopTemplateListMethod (params) {
  return request({
    url: '/sopClusterTemplate/index',
    method: 'get',
    params
  })
}
// 添加群SOP模板
export function addSopTemplateMethod (data) {
  return request({
    url: '/sopClusterTemplate/add',
    method: 'post',
    data
  })
}
// 获取群SOP模板详情
export function getSopTemplateDetailMethod (params) {
  return request({
    url: '/sopClusterTemplate/detail',
    method: 'get',
    params
  })
}
// 修改群SOP模板
export function editSopTemplateMethod (data) {
  return request({
    url: '/sopClusterTemplate/update',
    method: 'post',
    data
  })
}
// 删除群SOP模板
export function deleteSopTemplateMethod (params) {
  return request({
    url: '/sopClusterTemplate/delete',
    method: 'delete',
    params
  })
}
// 群SOP模板绑定群聊
export function bindSopTemplateMethod (data) {
  return request({
    url: '/sopClusterTemplate/sopBindCluster',
    method: 'post',
    data
  })
}
// 获取群聊列表
export function getGroupChatListMethod (data) {
  return request({
    url: '/sopClusterTemplate/getClusterList',
    method: 'post',
    data
  })
}
// 获取执行中的群SOP列表
export function getExecutingSopListMethod (params) {
  return request({
    url: '/sopCluster/getExecutionSop',
    method: 'get',
    params,
    timeout: '180000'
  })
}
// 删除执行中的群SOP
export function deleteExecutingSopMethod (params) {
  return request({
    url: '/sopCluster/delete',
    method: 'delete',
    params,
    timeout: '180000'
  })
}
// 获取执行记录群SOP列表
export function getExecuteRecordSopListMethod (params) {
  return request({
    url: '/sopCluster/getExecutionLog',
    method: 'get',
    params
  })
}
// 删除执行记录群SOP
export function deleteExecuteRecordSopMethod (params) {
  return request({
    url: '/sopCluster/deleteExecutionLog',
    method: 'delete',
    params,
    timeout: '180000'
  })
}
// 群SOP导出数据
export function exportClusterSopMethod (params) {
  return fileRequest({
    url: '/sopCluster/getExecutionLogExcel',
    method: 'get',
    responseType: 'blob',
    params
  })
}
// 群日历导出数据
export function exportClusterCalendarMethod (params) {
  return fileRequest({
    url: '/sopClusterCalendar/getExecutionLogExcel',
    method: 'get',
    responseType: 'blob',
    params
  })
}
// 获取群日历模板分页数据
export function getCalendarTemplateListMethod (params) {
  return request({
    url: '/sopClusterCalendarTemplate/index',
    method: 'get',
    params
  })
}
// 添加群日历模板
export function addCalendarTemplateMethod (data) {
  return request({
    url: '/sopClusterCalendarTemplate/add',
    method: 'post',
    data
  })
}
// 获取群日历模板详情
export function getCalendarTemplateDetailMethod (params) {
  return request({
    url: '/sopClusterCalendarTemplate/detail',
    method: 'get',
    params
  })
}
// 修改群日历模板
export function editCalendarTemplateMethod (data) {
  return request({
    url: '/sopClusterCalendarTemplate/update',
    method: 'post',
    data
  })
}
// 删除群日历模板
export function deleteCalendarTemplateMethod (params) {
  return request({
    url: '/sopClusterCalendarTemplate/delete',
    method: 'delete',
    params
  })
}
// 群日历模板绑定群聊
export function bindCalendarTemplateMethod (data) {
  return request({
    url: '/sopClusterCalendarTemplate/sopBindCluster',
    method: 'post',
    data
  })
}
// 获取执行中的群日历列表
export function getExecutingCalendarListMethod (params) {
  return request({
    url: '/sopClusterCalendar/getExecutionClusterCalendar',
    method: 'get',
    params
  })
}
// 删除执行中的群日历
export function deleteExecutingCalendarMethod (params) {
  return request({
    url: '/sopClusterCalendar/delete',
    method: 'delete',
    params,
    timeout: '180000'
  })
}
// 获取执行记录群日历列表
export function getExecuteRecordCalendarListMethod (params) {
  return request({
    url: '/sopClusterCalendar/getExecutionLog',
    method: 'get',
    params
  })
}
// 删除执行记录群日历
export function deleteExecuteRecordCalendarMethod (params) {
  return request({
    url: '/sopClusterCalendar/deleteExecutionLog',
    method: 'delete',
    params
  })
}
