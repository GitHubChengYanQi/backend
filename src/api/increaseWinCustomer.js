import request from '@/utils/request'

// 创建修改奖品
export function setPrize (params) {
  return request({
    url: 'customer_activity_prize_detail/save',
    method: 'post',
    data: params
  })
}
// 获取奖品列表
export function setPrizeFind (params) {
  return request({
    url: 'customer_activity_prize_detail/find',
    method: 'post',
    data: params
  })
}

// 获取奖品列表
export function setPrizeGive (params) {
  return request({
    url: 'customer_activity_prize_detail/give',
    method: 'post',
    data: params
  })
}
