import request, { ossRequest } from '@/utils/request'

/**
 * 字典
 * @param {*} params
 * @returns
 */
export function getDict (params) {
  return request({
    url: '/dictData/getListByType',
    method: 'get',
    params
  })
}
// 新版
export function getDictTree (params) {
  return request({
    url: '/dictTree/getListByType',
    method: 'get',
    params
  })
}
// 获取osstoken
export function mediaGetToken (params) {
  return request({
    url: '/oss/getToken',
    method: 'get',
    params
  })
}
/**
 * 上传
 * @param {*} params
 * @returns
 */
export function upLoad (data) {
  return request({
    url: '/common/upload',
    method: 'post',
    data
  })
}

/**
 * 获取组织机构员工列表
 * @param {*} params
 * @returns
 */
export function departmentEmp (params) {
  return request({
    url: '/workDepartment/departmentEmp',
    method: 'get',
    params
  })
}

/**
 * 获取组织机构列表
 * @param {*} params
 * @returns
 */
export function departmentList (params) {
  return request({
    url: '/workDepartment/departmentIndex',
    method: 'get',
    params
  })
}

/**
 * oss上传
 */
export function ossUpload (data) {
  return ossRequest({
    url: '/',
    method: 'post',
    data
  })
}
