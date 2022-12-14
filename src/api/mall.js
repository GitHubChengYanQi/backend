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

/**
 * 症状疾病分类
 */
// 树列表
export function treeList (params) {
  return request({
    url: '/symptomDiseaseClassify/tree',
    method: 'get',
    params
  })
}
// 新增树
export function treeSave (data) {
  return request({
    url: '/symptomDiseaseClassify/save',
    method: 'post',
    data
  })
}
// 修改增树
export function treeModify (data) {
  return request({
    url: '/symptomDiseaseClassify/modify',
    method: 'put',
    data
  })
}
// 删除增树
export function treeDelete (data) {
  return request({
    url: '/symptomDiseaseClassify/delete',
    method: 'DELETE',
    data
  })
}
// 查询销售指导
export function searchSalesGuidance (params) {
  return request({
    url: '/symptomDiseaseClassify/searchSalesGuidance',
    method: 'get',
    params
  })
}
// 修改销售指导
export function modifySalesGuidance (data) {
  return request({
    url: '/symptomDiseaseClassify/modifySalesGuidance',
    method: 'put',
    data
  })
}
// 分类上移
export function moveUp (data) {
  return request({
    url: '/symptomDiseaseClassify/moveUp',
    method: 'put',
    data
  })
}
// 分类下移
export function moveDown (data) {
  return request({
    url: '/symptomDiseaseClassify/moveDown',
    method: 'put',
    data
  })
}

/**
 * 联合用药
 */
export function combinList (params) {
  return request({
    url: '/drugCombination/list',
    method: 'get',
    params
  })
}
