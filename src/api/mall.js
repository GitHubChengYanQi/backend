import request, { fileRequest } from '@/utils/request'

// 列表
export function erpGoods (params) {
  return request({
    url: '/erpGoods/list',
    method: 'get',
    params
  })
}

// 同步
export function erpGoodsSync (params) {
  return request({
    url: '/erpGoods/sync',
    method: 'get',
    params
  })
}

// 导出
export function erpGoodsExport (params) {
  return fileRequest({
    url: '/erpGoods/export',
    method: 'get',
    responseType: 'blob',
    params
  })
}

// 导入
export function erpGoodsImport (params) {
  return fileRequest({
    url: '/erpGoods/import',
    method: 'get',
    responseType: 'blob',
    params
  })
}
