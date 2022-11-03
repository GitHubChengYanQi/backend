import request, { fileRequest } from '@/utils/request'
export function getTagList (params) {
  return request({
    url: '/workContactTagGroup/index',
    method: 'get',
    params
  })
}
/*
导出数据
*/
// 获取导出数据
export function exportDataList (data) {
  return request({
    url: '/sopTaskDetail/getSopTaskDetailList',
    method: 'post',
    data
  })
}
// 导出数据
export function exportDataMethod (data) {
  return fileRequest({
    url: '/sopTaskDetail/getSopTaskDetailListExcel',
    method: 'post',
    responseType: 'blob',
    data
  })
}
/*
群发助手sop
*/
// 获取群发助手列表
export function getGeneralList (params) {
  return request({
    url: '/sopGeneral/index',
    method: 'get',
    params
  })
}
// 根据id获取群发助手详情
export function getGeneralDetail (params) {
  return request({
    url: '/sopGeneral/detail',
    method: 'get',
    params
  })
}
// 获取字典
export function getDictData (params) {
  return request({
    url: '/dictData/getListByType',
    method: 'get',
    params
  })
}
// 获取群发助手预计人数
export function getGeneralPersonNum (data) {
  return request({
    url: '/sopGeneral/getPredictNum',
    method: 'post',
    data
  })
}
// 新增群发助手sop
export function addGeneralSop (data) {
  return request({
    url: '/sopGeneral/add',
    method: 'post',
    data
  })
}
// 修改群发助手sop
export function editGeneralSop (data) {
  return request({
    url: '/sopGeneral/update',
    method: 'post',
    data
  })
}
// 删除群发助手sop
export function delGeneralSop (data) {
  return request({
    url: '/sopGeneral/delete',
    method: 'delete',
    data
  })
}
/*
群发活动sop
*/
// 获取群发活动sop列表
export function getActivityList (params) {
  return request({
    url: '/sopActivity/index',
    method: 'get',
    params
  })
}
// 根据id获取群发活动详情
export function getActivityDetail (params) {
  return request({
    url: '/sopActivity/detail',
    method: 'get',
    params
  })
}
// 获取群发活动预计人数
export function getActivityPersonNum (data) {
  return request({
    url: '/sopActivity/getPredictNum',
    method: 'post',
    data
  })
}
// 新增群发活动sop
export function addActivitySop (data) {
  return request({
    url: '/sopActivity/add',
    method: 'post',
    data
  })
}
// 修改群发活动sop
export function editActivitySop (data) {
  return request({
    url: '/sopActivity/update',
    method: 'post',
    data
  })
}
// 删除群发活动sop
export function delActivitySop (data) {
  return request({
    url: '/sopActivity/delete',
    method: 'delete',
    data
  })
}

/*
定时提醒sop
*/
// 获取定时提醒sop列表
export function getRegularList (params) {
  return request({
    url: '/sopRegular/index',
    method: 'get',
    params
  })
}
// 根据id获取定时提醒详情
export function getRegularDetail (params) {
  return request({
    url: '/sopRegular/detail',
    method: 'get',
    params
  })
}
// 删除定时提醒
export function delRegularSop (data) {
  return request({
    url: '/sopRegular/delete',
    method: 'delete',
    data
  })
}
// 新增定时提醒
export function addRegularSop (data) {
  return request({
    url: '/sopRegular/add',
    method: 'post',
    data
  })
}
// 修改定时提醒
export function editRegularSop (data) {
  return request({
    url: '/sopRegular/update',
    method: 'post',
    data
  })
}
// 定时任务启动/禁用
export function updateRegularState (data) {
  return request({
    url: '/sopRegular/updateState',
    method: 'post',
    data
  })
}
/*
新增好友sop
*/
// 获取好友sop列表
export function getFriendList (params) {
  return request({
    url: '/sopFriend/index',
    method: 'get',
    params
  })
}
// 根据id获取好友sop详情
export function getFriendDetail (params) {
  return request({
    url: '/sopFriend/detail',
    method: 'get',
    params
  })
}
// 新增好友sop
export function addFriendSop (data) {
  return request({
    url: '/sopFriend/add',
    method: 'post',
    data
  })
}
// 修改好友sop
export function editFriendSop (data) {
  return request({
    url: '/sopFriend/update',
    method: 'post',
    data
  })
}
// 删除好友sop
export function delFriendSop (data) {
  return request({
    url: '/sopFriend/delete',
    method: 'delete',
    data
  })
}
// 好友sop启动/禁用
export function updateFriendState (data) {
  return request({
    url: '/sopFriend/updateState',
    method: 'post',
    data
  })
}
/*
新增生日sop
*/
// 获取生日sop列表
export function getBirthdayList (params) {
  return request({
    url: '/sopBirthday/index',
    method: 'get',
    params
  })
}
// 根据id获取生日sop详情
export function getBirthdayDetail (params) {
  return request({
    url: '/sopBirthday/detail',
    method: 'get',
    params
  })
}
// 新增生日sop
export function addBirthdaySop (data) {
  return request({
    url: '/sopBirthday/add',
    method: 'post',
    data
  })
}
// 修改生日sop
export function editBirthdaySop (data) {
  return request({
    url: '/sopBirthday/update',
    method: 'post',
    data
  })
}
// 删除生日sop
export function delBirthdaySop (data) {
  return request({
    url: '/sopBirthday/delete',
    method: 'delete',
    data
  })
}
// 生日sop启动/禁用
export function updateBirthdayState (data) {
  return request({
    url: '/sopBirthday/updateState',
    method: 'post',
    data
  })
}
