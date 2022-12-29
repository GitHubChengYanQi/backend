import request from '@/utils/request'

export function courseAdd (data) {
  return request({
    url: '/course/add',
    method: 'post',
    data
  })
}

export function courseEdit (data) {
  return request({
    url: '/course/edit',
    method: 'post',
    data
  })
}

export function courseList (data, params) {
  return request({
    url: '/course/list',
    method: 'post',
    data,
    params
  })
}

export function courseEmployeeBindList (data, params) {
  return request({
    url: '/courseEmployeeBind/list',
    method: 'post',
    data,
    params
  })
}

export function courseTaskBindList (data, params) {
  return request({
    url: '/courseTaskBind/list',
    method: 'post',
    data,
    params
  })
}

export function examCourseBindPageList (data, params) {
  return request({
    url: '/exam/courseBindPageList',
    method: 'post',
    data,
    params
  })
}

export function courseExamBindExamBindPageList (data, params) {
  return request({
    url: '/courseExamBind/examBindPageList',
    method: 'post',
    data,
    params
  })
}

export function courseWareBindList (data, params) {
  return request({
    url: '/courseWareBind/list',
    method: 'post',
    data,
    params
  })
}

export function courseDetail (data) {
  return request({
    url: '/course/detail',
    method: 'post',
    data
  })
}

export function courseDelete (data) {
  return request({
    url: '/course/delete',
    method: 'post',
    data
  })
}
