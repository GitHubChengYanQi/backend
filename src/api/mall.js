import request, { fileRequest } from '@/utils/request'

// 获取字典
export function getDictData (params) {
  return request({
    url: '/dictData/getListByType',
    method: 'get',
    params
  })
}
// 列表
export function erpGoods (params) {
  return request({
    url: '/erpGoods/list',
    method: 'get',
    params
  })
}
// 状态变更
export function erpStatusChange (data) {
  return request({
    url: '/erpGoods/status',
    method: 'put',
    data
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
export function erpGoodsImport (data) {
  return fileRequest({
    url: '/erpGoods/importExcel',
    method: 'post',
    responseType: 'blob',
    data
  })
}

// 查询详情
export function getErpGoodsDetail (params) {
  return request({
    url: '/erpGoods/detailAll',
    method: 'get',
    params
  })
}
// 查询药品信息
export function getErpDrugInformation (params) {
  return request({
    url: '/erpGoods/detail',
    method: 'get',
    params
  })
}
// 修改药品信息
export function editErpGoodsDetail (data) {
  return request({
    url: '/erpGoods/update',
    method: 'put',
    data
  })
}
// 查询通用名列表
export function getCommonNameList (params) {
  return request({
    url: '/commonName/listNames',
    method: 'get',
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
