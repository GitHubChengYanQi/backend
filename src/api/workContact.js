import request from '@/utils/request'
// 获取企微会员中心信息
export function getQwMemberInfo (params) {
  return request({
    url: '/memberCenterUser/memberErpAuth',
    method: 'get',
    params
  })
}

// 客户-客户详情-用户画像
export function getUserPortrait (params) {
  return request({
    url: '/contactFieldPivot/index',
    method: 'get',
    params: params
  })
}

// 客户-客户详情-编辑用户画像
export function editUserPortrait (params) {
  return request({
    url: '/contactFieldPivot/update',
    method: 'put',
    data: params
  })
}

// 客户-客户详情-批量打标签
export function addTag (params) {
  return request({
    url: '/workContact/batchLabeling',
    method: 'post',
    data: params
  })
}

// 客户-客户详情-查看客户详情基本信息
export function getWorkContactInfo (params) {
  return request({
    url: '/workContact/show',
    method: 'get',
    params: params
  })
}

// 客户-客户详情-编辑客户详情基本信息
export function editWorkContactInfo (params) {
  return request({
    url: '/workContact/update',
    method: 'put',
    data: params
  })
}

// 客户-客户列表
export function workContactList (params) {
  return request({
    url: '/workContact/index',
    method: 'get',
    params: params
  })
}

// 所有标签
export function allTag (params) {
  return request({
    url: '/workContactTag/allTag',
    method: 'get',
    params: params
  })
}

// 群聊列表下拉框
export function groupChatList (params) {
  return request({
    url: '/workRoom/roomIndex',
    method: 'get',
    params: params
  })
}

// 客户来源下拉框
export function customersSource (params) {
  return request({
    url: '/workContact/source',
    method: 'get',
    params: params
  })
}

// 客户 - 客户列表筛选 -- 用户画像
export function UserPortraitList (params) {
  return request({
    url: '/contactField/portrait',
    method: 'get',
    params: params
  })
}

// 客户 - 同步客户
export function synContact (params) {
  return request({
    url: '/workContact/synContact',
    method: 'put',
    data: params
  })
}

// 客户 - 互动轨迹
export function track (params) {
  return request({
    url: '/workContact/track',
    method: 'get',
    params: params
  })
}

// 模板列表
export function templateList (params) {
  return request({
    url: '/contactFollow/templateIndex',
    method: 'get',
    params
  })
}

export function templateStore (params) {
  return request({
    url: '/contactFollow/templateStore',
    method: 'post',
    data: params
  })
}

// 客户动态列表
export function trackContactList (params) {
  return request({
    url: '/workContact/indexTrack',
    method: 'get',
    params
  })
}

// 添加事件
export function addFollow (params) {
  return request({
    url: '/contactFollow/store',
    method: 'post',
    data: params
  })
}

// 打标签
export function batchCreateTag (params) {
  return request({
    url: '/workContactTagQw/batchAddTag',
    method: 'post',
    data: params
  })
}
// 移除标签
export function batchDestroyContactTag (params) {
  return request({
    url: '/workContactTagQw/batchRemoveTag',
    method: 'delete',
    data: params
  })
}

export function getStageManageList (params) {
  return request({
    url: '/contactStage/show',
    method: 'get',
    params
  })
}

export function updateStageManageList (params) {
  return request({
    url: '/contactStage/contactStageEmployeeUpdate',
    method: 'put',
    data: params
  })
}

export function employeeCreateContactTag (params) {
  return request({
    url: '/workContact/employeeCreateContactTag',
    method: 'put',
    data: params
  })
}

// 个人标签
export function contactEmployeeTag (params) {
  return request({
    url: '/contactEmployeeTag/index',
    method: 'get',
    params
  })
}

export function contactEmployeeTagStore (params) {
  return request({
    url: '/contactEmployeeTag/store',
    method: 'post',
    data: params
  })
}

export function contactEmployeeTagStoreDestroy (params) {
  return request({
    url: '/contactEmployeeTag/destroy',
    method: 'DELETE',
    data: params
  })
}

export function employeeTagSet (params) {
  return request({
    url: '/contactEmployeeTag/employeeTagSet',
    method: 'POST',
    data: params
  })
}

export function contactDistinctCount (params) {
  return request({
    url: '/workContact/contactDistinctCount',
    method: 'get',
    params
  })
}
// 自定义筛选字段
export function contactField (params) {
  return request({
    url: '/contactField/index',
    method: 'get',
    params
  })
}

// 新-健康档案模块以及部分信息修改接口：

// 个人信息
export function getUserInfoReq (data) {
  return request({
    url: '/healthRecord/person/info',
    method: 'POST',
    data
  })
}

// 页面数据保存
export function saveUserInfoReq (data) {
  return request({
    url: '/healthRecord/multi/save',
    method: 'POST',
    data
  })
}

// 获取 tab组
export function getTabsArrReq (data) {
  return request({
    url: '/healthRecord/record/info',
    method: 'POST',
    data
  })
}

// 获取单个tab详情
export function getTabDetailReq (data) {
  return request({
    url: '/healthRecord/record/getDetails',
    method: 'POST',
    data
  })
}

// 获取血压血糖弹窗详情
export function getSpecialItemReq (data) {
  return request({
    url: '/healthRecord/record/getOne',
    method: 'POST',
    data
  })
}

// 获取血压血糖弹窗下拉信息
export function getSpecialItemDetailReq (data) {
  return request({
    url: '/healthRecord/modal/getInfo',
    method: 'POST',
    data
  })
}

// 保存血压血糖记录
export function saveSpecialItemReq (data) {
  return request({
    url: '/healthRecord/record/save',
    method: 'POST',
    data
  })
}

// 删除血压血糖记录
export function delSpecialItemReq (data) {
  return request({
    url: '/healthRecord/record/delete',
    method: 'POST',
    data
  })
}
