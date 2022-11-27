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
