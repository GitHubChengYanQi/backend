// 公众号授权
import request from '@/utils/request'

// 获取公众号授权地址
export function wxmpAuthUrl (params) {
  return request({
    url: 'wxmp/auth/url',
    method: 'get',
    params: params
  })
}
// 更新公众号授权地址
export function wxmpAuthMappupdate (params) {
  return request({
    url: 'wxmp/auth/mappupdate',
    method: 'get',
    params
  })
}

// 新增公众获客推广
export function popularizeMake (params) {
  return request({
    url: 'customer_activity_prize_detail/make',
    method: 'post',
    data: params
  })
}

// 公众获客推广管理
export function popularizeCard (params) {
  return request({
    url: 'customer_activity_prize_detail/card',
    method: 'post',
    data: params
  })
}
// 图片下载转码
export function popularizeCors (params) {
  return request({
    url: 'customer_activity_prize_detail/cors',
    method: 'post',
    data: params
  })
}

export function wxmpAuthList (params) {
  return request({
    url: 'wxmp/auth/list',
    method: 'get',
    params: params
  })
}

/**
 * 活动列表
 * @param {*} params
 * @returns
 */
export function activityList (params) {
  return request({
    url: '/customerActivity/list',
    method: 'GET',
    params
  })
}

/**
 * 活动详情
 * @param {*} params
 * @returns
 */
export function activityDetail (params) {
  return request({
    url: '/customerActivity/getById',
    method: 'GET',
    params
  })
}

/**
 * 活动列表-发布
 * @param {*} params
 * @returns
 */
export function activityPublish (data) {
  return request({
    url: '/customerActivity/publish',
    method: 'POST',
    data
  })
}

/**
 * 公众号列表
 * @param {*} params
 * @returns
 */
export function mpList (params) {
  return request({
    url: '/customerActivity/mpList',
    method: 'GET',
    params
  })
}

/**
 * 奖品列表
 * @param {*} params
 * @returns
 */
export function prizeList (params) {
  return request({
    url: '/customerActivity/prizeList',
    method: 'GET',
    params
  })
}

/**
 * 样例二维码
 * @param {*} params
 * @returns
 */
export function getQrcode (params) {
  return request({
    url: '/customerActivity/getQrcode',
    method: 'GET',
    params
  })
}

/**
 * 活动删除
 * @param {*} params
 * @returns
 */
export function activityDel (data) {
  return request({
    url: '/customerActivity/destroy',
    method: 'DELETE',
    data
  })
}

/**
 * 活动保存发布
 * @param {*} params
 * @returns
 */
export function activityUpdate (data) {
  return request({
    url: '/customerActivity/store',
    method: 'POST',
    data
  })
}

/**
 * 查询数据统计
 * @param {*} params
 * @returns
 */
export function queryStatistics (params) {
  return request({
    url: '/customerActivityPromote/queryStatistics',
    method: 'GET',
    params
  })
}

/**
 * 查询数据列表
 * @param {*} params
 * @returns
 */
export function queryList (params) {
  return request({
    url: '/customerActivityPromote/queryList',
    method: 'GET',
    params
  })
}

/**
 * 获取渠道
 * @param {*} params
 * @returns
 */
export function chanelList (params) {
  return request({
    url: '/customerActivityPromote/chanelList',
    method: 'GET',
    params
  })
}
