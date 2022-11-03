import request, { fileRequest } from '@/utils/request'

// 抽奖活动列表
export function activityVideoInfo (params) {
  return request({
    url: '/activityVideoInfo/index',
    method: 'get',
    params
  })
}

// 新建抽奖活动
export function activityVideoInfoAdd (data) {
  return request({
    url: '/activityVideoInfo/add',
    method: 'post',
    data
  })
}

// 编辑抽奖活动
export function activityVideoInfoUpdate (data) {
  return request({
    url: '/activityVideoInfo/update',
    method: 'put',
    data
  })
}

// 抽奖活动详情
export function activityVideoInfoDetail (params) {
  return request({
    url: '/activityVideoInfo/detail',
    method: 'get',
    params
  })
}

// 删除抽奖活动
export function activityVideoInfoDelete (data) {
  return request({
    url: '/activityVideoInfo/delete',
    method: 'delete',
    data
  })
}

// 会员数据统计
export function activityVideoInfoMemberStatistics (params) {
  return request({
    url: '/activityVideoInfo/memberData/statistics',
    method: 'get',
    params
  })
}

// 会员数据列表
export function activityVideoInfoMemberIndex (params) {
  return request({
    url: '/activityVideoInfo/memberData/index',
    method: 'get',
    params
  })
}

// 非会员数据列表
export function activityVideoInfoNoMemberIndex (params) {
  return request({
    url: '/activityVideoInfo/nonMemberData/index',
    method: 'get',
    params
  })
}

// 导出会员数据execl
export function memberExportExcel (params) {
  return fileRequest({
    url: '/activityVideoInfo/memberData/exportExcel',
    method: 'get',
    responseType: 'blob',
    params
  })
}

// 导出会员数据text
export function memberExportTxt (params) {
  return fileRequest({
    url: '/activityVideoInfo/memberData/exportTxt',
    method: 'get',
    responseType: 'blob',
    params
  })
}

// 导出非会员数据execl
export function noMemberExportExcel (params) {
  return fileRequest({
    url: '/activityVideoInfo/nonMemberData/exportExcel',
    method: 'get',
    responseType: 'blob',
    params
  })
}
