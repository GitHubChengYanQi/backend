import request from '@/utils/request'

export function getDepartList (params) {
  return request({
    url: '/workDepartment/departmentIndex',
    method: 'get',
    params
  })
}

export function getMember (params) {
  return request({
    url: '/workDepartment/getDepartmentEmployee',
    method: 'get',
    params
  })
}

export function getMemberTotalCount (params) {
  return request({
    url: '/workDepartment/countDepartmentEmployee',
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
