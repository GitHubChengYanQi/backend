import request from '@/utils/request'

// 群列表
export function getGroupListReq (params) {
  return request({
    url: '/workRoom/index',
    method: 'get',
    params: params
  })
}
// 按群名称获取群名称列表
export function getSearchGroupNameOptionsListReq (data) {
  return request({
    url: '/workRoom/namelist',
    method: 'POST',
    data: data
  })
}

// 批量设置群标签
export function batchSetTagsReq (data) {
  return request({
    url: '/workRoom/batchsettag',
    method: 'post',
    data: data
  })
}

//  批量移除群标签
export function batchRemoveTagsReq (data) {
  return request({
    url: '/workRoom/batchremovetag',
    method: 'post',
    data: data
  })
}

//  获取群sop群日历列表
export function getListItemSettingInfoReq (params) {
  return request({
    url: '/sopClusterTemplate/getTemplateSetting',
    method: 'get',
    params: params
  })
}

//  保存群sop群日历列表
export function saveListItemSettingInfoReq (data) {
  return request({
    url: '/sopClusterTemplate/saveTemplateSetting',
    method: 'post',
    data: data
  })
}

//  导出群列表数据
export function groupListExportReq (params) {
  return request({
    url: '/workRoom/exportExcel',
    method: 'get',
    responseType: 'blob',
    params
  })
}

// 群统计详情顶端展示信息
export function getGroupDetailTopInfoReq (data) {
  return request({
    url: '/workRoom/countDetailTopInfo',
    method: 'post',
    data: data
  })
}

// 获取折线图数据
export function getItemChartInfoReq (data) {
  return request({
    url: '/workRoom/chartdatas',
    method: 'post',
    data: data
  })
}

// 统计详情天数据列表
export function getItemChartdaysReq (data) {
  return request({
    url: '/workRoom/chartdays',
    method: 'post',
    data: data
  })
}

// 欢迎语

// 列表
export function getJoinSayListReq (data) {
  return request({
    url: '/workRoomWelcomeMsg/list',
    method: 'post',
    data: data
  })
}

// 删除item
export function deleteJoinSayItemReq (data) {
  return request({
    url: '/workRoomWelcomeMsg/delete',
    method: 'post',
    data: data
  })
}

// add item
export function addJoinSayItemReq (data) {
  return request({
    url: '/workRoomWelcomeMsg/add',
    method: 'post',
    data: data
  })
}

// item info
export function getJoinSayItemInfoReq (data) {
  return request({
    url: '/workRoomWelcomeMsg/info',
    method: 'post',
    data: data
  })
}

// item edit
export function setJoinSayItemInfoReq (data) {
  return request({
    url: '/workRoomWelcomeMsg/edit',
    method: 'post',
    data: data
  })
}
