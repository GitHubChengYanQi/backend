import request, { fileRequest } from '@/utils/request'

export function getMaintainerList (params) {
  return request({
    url: '/maintainer/pageList',
    method: 'post',
    data: params
  })
}

export function allocateContact (data) {
  return request({
    url: '/maintainer/allocate',
    method: 'post',
    data: data
  })
}

export function getRecordList (data) {
  return request({
    url: '/maintainerRecord/pageList',
    method: 'post',
    data
  })
}

export function getOrderDetailList (params) {
  return request({
    url: '/acOrder/getUserOderListGroupByAc',
    method: 'post',
    params: params
  })
}

export function getAvatarUrls (data) {
  return request({
    url: '/maintainer/getAvatarUrls',
    method: 'post',
    data
  })
}

export function exportRecord (data) {
  return fileRequest({
    url: '/maintainerRecord/export',
    method: 'post',
    responseType: 'blob',
    data
  })
}

// 交易详情
export function marketList (data) {
  return request({
    url: '/acOrder/marketList',
    method: 'post',
    data
  })
}
