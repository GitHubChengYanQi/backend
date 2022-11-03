import request from '@/utils/request'

export function getNoticeListReq (data) {
  return request({
    url: '/riskNoticeTemp/list',
    method: 'POST',
    data: data
  })
}

export function changeNiticeStatusReq (data) {
  return request({
    url: '/riskNoticeTemp/state',
    method: 'POST',
    data: data
  })
}

export function createNoticeReq (data) {
  return request({
    url: '/riskNoticeTemp/save',
    method: 'POST',
    data: data
  })
}

export function getNoticeInfoReq (data) {
  return request({
    url: '/riskNoticeTemp/one',
    method: 'POST',
    data: data
  })
}

export function updateNoticeReq (data) {
  return request({
    url: '/riskNoticeTemp/update',
    method: 'POST',
    data: data
  })
}

export function delNoticeReq (data) {
  return request({
    url: '/riskNoticeTemp/delete',
    method: 'delete',
    data: data
  })
}
