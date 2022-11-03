import request from '@/utils/request'
// 评分模型
export function judgeFormerSave (params) {
  return request({
    url: '/judge_former/save',
    method: 'POST',
    data: params
  })
}

export function judgeFormerDrop (params) {
  return request({
    url: '/judge_former/drop',
    method: 'POST',
    data: params
  })
}
export function judgeFormerOpen (params) {
  return request({
    url: '/judge_former/open',
    method: 'POST',
    data: params
  })
}

export function judgeFormerLoad (params) {
  return request({
    url: '/judge_former/load',
    method: 'POST',
    data: params
  })
}

export function judgeFormerFind (params) {
  return request({
    url: '/judge_former/find',
    method: 'POST',
    data: params
  })
}

export function judgeFormerNorm (params) {
  return request({
    url: '/judge_former/norm',
    method: 'POST',
    data: params
  })
}

// 预警策略

export function warnStrategyList (params) {
  return request({
    url: '/warn_strategy/list',
    method: 'POST',
    data: params
  })
}

export function warnStrategyDelte (params) {
  return request({
    url: '/warn_strategy/delete',
    method: 'POST',
    data: params
  })
}

export function warnStrategyAdd (params) {
  return request({
    url: '/warn_strategy/add',
    method: 'POST',
    data: params
  })
}

export function warnStrategyInfo (params) {
  return request({
    url: '/warn_strategy/info',
    method: 'POST',
    data: params
  })
}

export function warnStrategyEdit (params) {
  return request({
    url: '/warn_strategy/edit',
    method: 'POST',
    data: params
  })
}

export function warnStrategyOpen (params) {
  return request({
    url: '/warn_strategy/open',
    method: 'POST',
    data: params
  })
}
// 获取消息列表
export function riskNoticeTempGetAll (params) {
  return request({
    url: '/riskNoticeTemp/getAll',
    method: 'POST',
    data: params
  })
}
