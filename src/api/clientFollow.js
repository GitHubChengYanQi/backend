import request from '@/utils/request'

// 添加规则

// 查字典
export function businessTermsList (params) {
  return request({
    url: 'business_terms/list',
    method: 'get',
    params
  })
}
// 数值打标签

export function numberAutoLabelIndex (params) {
  return request({
    url: '/numberAutoLabel/index',
    method: 'get',
    params
  })
}

export function numberAutoLabelStatusChange (params) {
  return request({
    url: '/numberAutoLabel/statusChange',
    method: 'put',
    data: params
  })
}

export function numberAutoLabelDelete (params) {
  return request({
    url: '/numberAutoLabel/delete',
    method: 'DELETE',
    data: params
  })
}

export function numberAutoLabelAdd (params) {
  return request({
    url: '/numberAutoLabel/add',
    method: 'post',
    data: params
  })
}

export function numberAutoLabelUpdate (params) {
  return request({
    url: '/numberAutoLabel/update',
    method: 'PUT',
    data: params
  })
}

export function numberAutoLabelDetail (params) {
  return request({
    url: '/numberAutoLabel/detail',
    method: 'GET',
    params
  })
}

// 客户入群打标签
export function groupAutoLabelIndex (params) {
  return request({
    url: '/groupAutoLabel/index',
    method: 'get',
    params
  })
}

export function groupAutoLabelUpdate (params) {
  return request({
    url: '/groupAutoLabel/update',
    method: 'PUT',
    data: params
  })
}

export function groupAutoLabelAdd (params) {
  return request({
    url: '/groupAutoLabel/add',
    method: 'POST',
    data: params
  })
}

export function groupAutoLabelDetail (params) {
  return request({
    url: '/groupAutoLabel/detail',
    method: 'get',
    params
  })
}

export function groupAutoLabelDelete (params) {
  return request({
    url: '/groupAutoLabel/delete',
    method: 'DELETE',
    data: params
  })
}

export function groupAutoLabelStatusChange (params) {
  return request({
    url: '/groupAutoLabel/statusChange',
    method: 'PUT',
    data: params
  })
}
// 分时段打标签
export function timeAutoLabelIndex (params) {
  return request({
    url: '/timeAutoLabel/index',
    method: 'get',
    params
  })
}

export function timeAutoLabelUpdate (params) {
  return request({
    url: '/timeAutoLabel/update',
    method: 'PUT',
    data: params
  })
}

export function timeAutoLabelAdd (params) {
  return request({
    url: '/timeAutoLabel/add',
    method: 'POST',
    data: params
  })
}

export function timeAutoLabelDetail (params) {
  return request({
    url: '/timeAutoLabel/detail',
    method: 'get',
    params
  })
}

export function timeAutoLabelDelete (params) {
  return request({
    url: '/timeAutoLabel/delete',
    method: 'DELETE',
    data: params
  })
}

export function timeAutoLabelStatusChange (params) {
  return request({
    url: '/timeAutoLabel/statusChange',
    method: 'PUT',
    data: params
  })
}
/**
 * 消费属性打标签列表
 * @param {*} params
 * @returns
 */
export function consumeAutoLabel (params) {
  return request({
    url: '/consumeAutoLabel/index',
    method: 'GET',
    params
  })
}
/**
 * 消费属性状态更新
 * @param {*} params
 * @returns
 */
export function consumeAutoLabelStatus (data) {
  return request({
    url: '/consumeAutoLabel/statusChange',
    method: 'PUT',
    data
  })
}
/**
 * 消费属性创建
 * @param {*} params
 * @returns
 */
export function consumeAutoLabelAdd (data) {
  return request({
    url: '/consumeAutoLabel/add',
    method: 'POST',
    data
  })
}
/**
 * 消费属性更新
 * @param {*} params
 * @returns
 */
export function consumeAutoLabelUpdate (data) {
  return request({
    url: '/consumeAutoLabel/update',
    method: 'PUT',
    data
  })
}
/**
 * 商品列表
 * @param {*} params
 * @returns
 */
export function consumeAutoLabelErpGoodList (params) {
  return request({
    url: '/consumeAutoLabel/erpGoodList',
    method: 'GET',
    params
  })
}
/**
 * 消费规则编辑回显
 * @param {*} params
 * @returns
 */
export function consumeAutoLabelDetail (params) {
  return request({
    url: '/consumeAutoLabel/detail',
    method: 'GET',
    params
  })
}
/**
 * 消费规则删除
 * @param {*} params
 * @returns
 */
export function consumeAutoLabelDelete (data) {
  return request({
    url: '/consumeAutoLabel/delete',
    method: 'DELETE',
    data
  })
}
/**
 * 验证消费属性规则
 * @param {*} params
 * @returns
 */
export function consumeAutoLabelValidRule (data) {
  return request({
    url: '/consumeAutoLabel/validRule',
    method: 'PUT',
    data
  })
}
/**
 * 规则详情
 * @param {*} params
 * @returns
 */
export function consumeAutoLabelRuleDetail (params) {
  return request({
    url: '/consumeAutoLabel/ruleDetail',
    method: 'GET',
    params
  })
}
/**
 * 规则详情列表
 * @param {*} params
 * @returns
 */
export function consumeAutoLabelRuleDetailIndex (params) {
  return request({
    url: '/consumeAutoLabel/ruleDetail/index',
    method: 'GET',
    params
  })
}
