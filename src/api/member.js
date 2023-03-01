import request, { fileRequest } from '@/utils/request'
// 获取会员列表
export function getMemberListData (params) {
  return request({
    url: '/memberCenterUser/pc/index',
    method: 'get',
    params
  })
}
// 会员列表导出
export function exportMemberListData (params) {
  return fileRequest({
    url: '/memberCenterUser/pc/excel',
    method: 'get',
    responseType: 'blob',
    params
  })
}
// 获取会员消费记录
export function getMemberBuyRecordData (params) {
  return request({
    url: '/memberCenterUser/pc/getConsumptionLogByPhone',
    method: 'get',
    params
  })
}
