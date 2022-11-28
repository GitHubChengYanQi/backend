import request from '@/utils/request'

// 树状图
export function workRoomShiftSave (data) {
  return request({
    url: 'work_room_shift/save',
    method: 'post',
    data
  })
}
// 删除
export function workRoomShiftDrop (data) {
  return request({
    url: 'work_room_shift/drop',
    method: 'post',
    data
  })
}
// 查询客户群数
export function workRoomShiftRoom (data) {
  return request({
    url: 'work_room_shift/room',
    method: 'post',
    data
  })
}

// 查询客户群数
export function workRoomShiftFind (data) {
  return request({
    url: 'work_room_shift/find',
    method: 'post',
    data
  })
}
// 编辑复制数据
export function workRoomShiftLoad (data) {
  return request({
    url: 'work_room_shift/load',
    method: 'post',
    data
  })
}
