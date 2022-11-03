import request from '@/utils/request'

// 微信授权列表
export function wechatAuthList (params) {
  return request({
    url: '/corp/index',
    method: 'get',
    params: params
  })
}

// 新增企业微信授权
export function addEnterpriseWeChat (params) {
  return request({
    url: '/corp/store',
    method: 'post',
    data: params
  })
}

// 编辑企业微信授权
export function editEnterpriseWeChat (params) {
  return request({
    url: '/corp/update',
    method: 'put',
    data: params
  })
}

// 查看企业微信授权
export function lookEnterpriseWeChat (params) {
  return request({
    url: '/corp/show',
    method: 'get',
    params: params
  })
}

// 配置企业微信账号
export function storeApi (params) {
  return request({
    url: '/corp/store',
    method: 'post',
    data: params
  })
}
// 创建自建应用
export function agentStoreApi (params) {
  return request({
    url: '/agent/store',
    method: 'post',
    data: params
  })
}
// 配置企业通讯录
export function userSecretStoreApi (params) {
  return request({
    url: '/corp/userSecretStore',
    method: 'post',
    data: params
  })
}
// 接受事件服务器详情
export function callbackInfoApi (params) {
  return request({
    url: '/corp/callbackInfo',
    method: 'get',
    params
  })
}
// 配置客户联系
export function contactSecretStoreApi (params) {
  return request({
    url: '/corp/contactSecretStore',
    method: 'post',
    data: params
  })
}
// 第一步  详情
export function showApi (params) {
  return request({
    url: '/corp/show',
    method: 'get',
    params
  })
}
// 第一步 更新
export function updateApi (params) {
  return request({
    url: '/corp/update',
    method: 'put',
    data: params
  })
}
// 第2.5步 更新
export function agentUpdateApi (params) {
  return request({
    url: '/agent/update',
    method: 'put',
    data: params
  })
}
export function agentInfoApi (params) {
  return request({
    url: '/agent/info',
    method: 'get',
    params
  })
}
export function getAuthQrCode (params) {
  return request({
    url: '/agent/customizedAuthQRCode',
    method: 'get',
    params
  })
}

export function getPublishStatus (params) {
  return request({
    url: '/agent/publishStatus',
    method: 'get',
    params
  })
}
