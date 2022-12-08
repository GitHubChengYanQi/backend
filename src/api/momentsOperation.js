import request from '@/utils/request'

// 列表
export function getMomentsListReq (params) {
  return request({
    url: '/moments/list',
    method: 'post',
    data: params
  })
}
// 列表导出
export function momentsListExportReq (params) {
  return request({
    url: '/moments/exportExcel',
    method: 'post',
    responseType: 'blob',
    data: params
  })
}

// 新增
export function addMomentsItemReq (params) {
  return request({
    url: '/moments/add',
    method: 'post',
    data: params
  })
}

// 删除
export function deleteMomentsItemReq (params) {
  return request({
    url: '/moments/delete',
    method: 'post',
    data: params
  })
}

// 获取item info
export function getMomentsItemInfoReq (params) {
  return request({
    url: '/moments/info',
    method: 'post',
    data: params
  })
}

// 修改
export function setMomentsItemInfoReq (params) {
  return request({
    url: '/moments/edit',
    method: 'post',
    data: params
  })
}

// 获取预计人数
export function getMomentsItemExpectedNumReq (params) {
  return request({
    url: '/moments/countcontact',
    method: 'post',
    data: params
  })
}

// 获取详情列表
export function getMomentsItemListReq (params) {
  return request({
    url: '/moments/emplist',
    method: 'post',
    data: params
  })
}

// 详情列表导出
export function momentsListItemExportReq (params) {
  return request({
    url: '/moments/exportEmpExcel',
    method: 'post',
    responseType: 'blob',
    data: params
  })
}

// 折线图数据
export function getMomentsChartDataReq (params) {
  return request({
    url: '/moments/chartdatas',
    method: 'post',
    data: params
  })
}

// 统计列表
export function getMomentsStatisticsListReq (params) {
  return request({
    url: '/moments/chartemps',
    method: 'post',
    data: params
  })
}

// 统计列表导出
export function momentsStatisticsListExportReq (params) {
  return request({
    url: '/moments/exportChartEmpExcel',
    method: 'post',
    responseType: 'blob',
    data: params
  })
}
