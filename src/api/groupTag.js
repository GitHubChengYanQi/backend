import request from '@/utils/request'

// 树状图
export function workRoomLabelTree (data) {
  return request({
    url: 'work_room_label/tree',
    method: 'post',
    data
  })
}
// 操作
export function workRoomLabelSave (data) {
  return request({
    url: 'work_room_label/save',
    method: 'post',
    data
  })
}
// 删除
export function workRoomLabelDrop (data) {
  return request({
    url: 'work_room_label/drop',
    method: 'post',
    data
  })
}
// 标签详情
export function workRoomLabelLoad (data) {
  return request({
    url: 'work_room_label/load',
    method: 'post',
    data
  })
}
// 移动
export function workRoomLabelMove (data) {
  return request({
    url: 'work_room_label/move',
    method: 'post',
    data
  })
}
