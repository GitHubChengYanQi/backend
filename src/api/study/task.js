import request, { fileRequest } from '@/utils/request'

export function courseTaskAdd (data) {
  return request({
    url: '/courseTask/add',
    method: 'post',
    data
  })
}

export function courseTaskList (data, params) {
  return request({
    url: '/courseTask/list',
    method: 'post',
    data,
    params
  })
}

export function courseTaskExcelExport (data, params) {
  return fileRequest({
    url: '/courseTask/excelExport',
    responseType: 'blob',
    method: 'post',
    data,
    params
  })
}

export function courseTaskDelete (data) {
  return request({
    url: '/courseTask/delete',
    method: 'post',
    data
  })
}

export function examTaskAdd (data) {
  return request({
    url: '/examTask/add',
    method: 'post',
    data
  })
}

export function examTaskDetail (data) {
  return request({
    url: '/examTask/detail',
    method: 'post',
    data
  })
}

export function courseTaskDetail (data) {
  return request({
    url: '/courseTask/detail',
    method: 'post',
    data
  })
}

export function examTaskList (data, params) {
  return request({
    url: '/examTask/list',
    method: 'post',
    data,
    params
  })
}

export function examTaskExcelExport (data, params) {
  return fileRequest({
    url: '/examTask/excelExport',
    responseType: 'blob',
    method: 'post',
    data,
    params
  })
}

export function examTaskDelete (data) {
  return request({
    url: '/examTask/delete',
    method: 'post',
    data
  })
}
