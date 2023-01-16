import request, { fileRequest } from '@/utils/request'

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

export function courseExcelExport (data, params) {
  return fileRequest({
    url: '/course/excelExport',
    method: 'post',
    responseType: 'blob',
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

export function courseEmployeeBindExcelExport (data, params) {
  return fileRequest({
    url: '/courseEmployeeBind/excelExport',
    responseType: 'blob',
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

export function courseTaskBindExcelExport (data, params) {
  return fileRequest({
    url: '/courseTaskBind/excelExport',
    responseType: 'blob',
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

export function examCourseBindPageExcelExport (data, params) {
  return fileRequest({
    url: '/exam/excelExport',
    responseType: 'blob',
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

export function courseExamBindExamBindPageExcelExport (data, params) {
  return fileRequest({
    url: '/courseExamBind/excelExport',
    responseType: 'blob',
    method: 'post',
    data,
    params
  })
}

export function examTaskBindExamExcelExport (data, params) {
  return fileRequest({
    url: '/examTaskBind/exam/excelExport',
    responseType: 'blob',
    method: 'post',
    data,
    params
  })
}

export function examTaskBindList (data, params) {
  return request({
    url: '/examTaskBind/list',
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

export function courseWareBindExcelExport (data, params) {
  return fileRequest({
    url: '/courseWareBind/excelExport',
    responseType: 'blob',
    method: 'post',
    data,
    params
  })
}

export function courseTaskBindDetailList (data, params) {
  return request({
    url: '/courseTaskBindDetail/list',
    method: 'post',
    data,
    params
  })
}

export function courseTaskBindDetailExcelExport (data, params) {
  return fileRequest({
    url: '/courseTaskBindDetail/excelExport',
    responseType: 'blob',
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
