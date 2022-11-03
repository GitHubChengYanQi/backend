import request from '@/utils/request'

/**
 * 规则列表
 * @param {*} params
 * @returns
 */

export function collaboratorRules (data) {
  return request({
    url: '/collaborator_rules/index',
    method: 'post',
    data
  })
}

/**
 * 关联人员列表
 * @param {*} data
 * @returns
 */

export function collaboratorRulesRelationPeople (data) {
  return request({
    url: '/collaborator_rules/relation',
    method: 'post',
    data
  })
}

/**
 * 规则添加
 * @param {*} params
 * @returns
 */
export function collaboratorRulesAdd (data) {
  return request({
    url: '/collaborator_rules/store',
    method: 'POST',
    data
  })
}

/**
 * 规则详情
 * @param {*} params
 * @returns
 */
export function collaboratorRulesShow (params) {
  return request({
    url: '/collaborator_rules/show',
    method: 'GET',
    params
  })
}

/**
 * 规则删除
 * @param {*} params
 * @returns
 */
export function collaboratorRulesDestroy (params) {
  return request({
    url: '/collaborator_rules/destroy',
    method: 'delete',
    params
  })
}

/**
 * 规则编辑
 * @param {*} params
 * @returns
 */
export function collaboratorRulesUpdate (data) {
  return request({
    url: '/collaborator_rules/update',
    method: 'POST',
    data
  })
}

/**
 * 更新规则状态
 * @param {*} params
 * @returns
 */
export function collaboratorRulesUpdateState (params) {
  return request({
    url: '/collaborator_rules/state',
    method: 'GET',
    params
  })
}
