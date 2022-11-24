import request from '@/utils/request'

// 树状图
export function workRoomLabelTree (data) {
  return request({
    url: '/work_room_label/tree',
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
