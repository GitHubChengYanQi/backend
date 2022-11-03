// 健康档案
import request from '@/utils/request'

/**
 * 术语列表
 * @param {*} params
 * @returns
 */
export function businessTerms (params) {
  return request({
    url: '/business_terms/index',
    method: 'GET',
    params
  })
}

/**
 * 术语添加
 * @param {*} params
 * @returns
 */
export function businessTermsAdd (data) {
  return request({
    url: '/business_terms/store',
    method: 'POST',
    data
  })
}

/**
 * 术语编辑
 * @param {*} params
 * @returns
 */
export function businessTermsUpdate (data) {
  return request({
    url: '/business_terms/update',
    method: 'POST',
    data
  })
}

/**
 * 术语删除
 * @param {*} params
 * @returns
 */
export function businessTermsDestroy (params) {
  return request({
    url: '/business_terms/destroy',
    method: 'DELETE',
    params
  })
}

/**
 * 术语详情
 * @param {*} params
 * @returns
 */
export function businessTermsShow (params) {
  return request({
    url: '/business_terms/show',
    method: 'GET',
    params
  })
}
