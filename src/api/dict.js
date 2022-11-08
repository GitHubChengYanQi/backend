import request from '@/utils/request'
// 获取普通字典数据
export function getDictData (params) {
  return request({
    url: '/acOrder/list',
    method: 'get',
    params
  })
}
