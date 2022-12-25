import request from '@/utils/request'

export function examAdd (data) {
  return request({
    url: '/exam/add',
    method: 'post',
    data
  })
}

export function examEdit (data) {
  return request({
    url: '/exam/edit',
    method: 'post',
    data
  })
}

export function examCheckBind (data) {
  return request({
    url: '/exam/checkBind',
    method: 'post',
    data
  })
}

export function examList (data, params) {
  return request({
    url: '/exam/list',
    method: 'post',
    data,
    params
  })
}

export function examDetail (data) {
  return request({
    url: '/exam/detail',
    method: 'post',
    data
  })
}


export function examDelete (data) {
  return request({
    url: '/exam/delete',
    method: 'post',
    data
  })
}
