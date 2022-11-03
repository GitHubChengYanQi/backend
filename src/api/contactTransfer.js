// 引入
import request from '@/utils/request'
// 在职转接列表
export function infoApi (params) {
  return request({
    url: '/contactTransfer/info',
    method: 'get',
    params: params
  })
}
// 同步离职待分配客户列表
export function saveUnassignedListApi (params) {
  return request({
    url: '/contactTransfer/saveUnassignedList',
    method: 'get',
    params: params
  })
}
// 离职待分配客户列表
export function unassignedListApi (params) {
  return request({
    url: '/contactTransfer/unassignedList',
    method: 'get',
    params: params
  })
}
// 分配 离职/在职客户
export function allotContactApi (params) {
  return request({
    url: '/contactTransfer/allotContact',
    method: 'post',
    data: params
  })
}
// 离职待分配群列表
export function roomApi (params) {
  return request({
    url: '/contactTransfer/room',
    method: 'get',
    params: params
  })
}
// 分配离客户群
export function allotRoomApi (params) {
  return request({
    url: '/contactTransfer/allotRoom',
    method: 'post',
    data: params
  })
}
// 分配记录
export function logApi (params) {
  return request({
    url: '/contactTransfer/log',
    method: 'get',
    params: params
  })
}
// 会话内容
export function messageList (params) {
  return request({
    url: '/workMessage/index',
    method: 'get',
    params: params
  })
}
// 成员下拉框
export function department (params) {
  return request({
    url: '/workDepartment/index',
    method: 'get',
    params: params
  })
}
// 分类客户
export function allot (params) {
  return request({
    url: '/contactBatchAdd/allot',
    method: 'POST',
    data: params
  })
}

// 离职客户统计数据
export function getStatistics (params) {
  return request({
    url: '/contactTransfer/getStatistics',
    method: 'get',
    params: params
  })
}

// 离职客户群统计数据
export function getRoomStatistics (params) {
  return request({
    url: '/contactTransfer/getRoomStatistics',
    method: 'get',
    params: params
  })
}

// 同步已分配客户状态
export function setTransferStateAll (params) {
  return request({
    url: '/contactTransfer/setTransferStateAll',
    method: 'get',
    params: params
  })
}

// 员工数据
export function getEmployee (params) {
  return request({
    url: '/workEmployee/getCorpEmployeeName',
    method: 'get',
    params: params
  })
}