import request from '@/utils/request'

// 企业成员列表
export function enterMembersList (params) {
  return request({
    url: '/workEmployee/index',
    method: 'get',
    params: params
  })
}

// 同步企业成员
export function syncEmployee (params) {
  return request({
    url: '/workEmployee/syncEmployee',
    method: 'put',
    data: params
  })
}

// 同步时间-成员列表搜索条件数据
export function syncTime (params) {
  return request({
    url: '/workEmployee/searchCondition',
    method: 'get',
    data: params
  })
}

export function defaultEmployeeList (params) {
  return request({
    url: '/workDepartment/departMentEmployee',
    method: 'get',
    params
  })
}

export function searchEmployeeList (params) {
  return request({
    url: '/workDepartment/getEmployee',
    method: 'get',
    params
  })
}

export function pageEmployeeList (params) {
  return request({
    url: '/workDepartment/getDepartmentEmployee',
    method: 'get',
    params
  })
}

export function EmployeeCount (params) {
  return request({
    url: '/workDepartment/countDepartmentEmployee',
    method: 'get',
    params
  })
}

export function statusUpdate (params) {
  return request({
    url: '/workEmployee/statusUpdate',
    method: 'put',
    data: params
  })
}

export function exportExcel (params) {
  return request({
    url: '/workEmployee/exportExcel',
    method: 'post',
    data: params,
    responseType: 'blob'
  })
}
