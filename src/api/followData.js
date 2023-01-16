import request from '@/utils/request'
// 搜索-方案名称下拉
export function getSearchSchemeNameSelectOptionsReq (data) {
  return request({
    url: '/scrm_diagnosis_care_analysis_project/treat',
    method: 'post',
    data
  })
}

// 概况
export function getDataDetailItemsReq (data) {
  return request({
    url: '/scrm_diagnosis_care_analysis_project/index',
    method: 'post',
    data
  })
}

// 获取图标数据
export function getChartsDataReq (data) {
  return request({
    url: '/scrm_diagnosis_care_analysis_project/chart',
    method: 'post',
    data
  })
}

// 获取表格数据
export function getTableDetailDataReq (data) {
  return request({
    url: '/scrm_diagnosis_care_analysis_project/table',
    method: 'post',
    data
  })
}

// 各个方案被使用数
export function getTableItemDetailDataReq (data) {
  return request({
    url: '/scrm_diagnosis_care_analysis_project/group',
    method: 'post',
    data
  })
}

// 表格数据导出
export function getExcelTableDetailDataReq (data) {
  return request({
    url: '/scrm_diagnosis_care_analysis_project/excel',
    method: 'post',
    data,
    responseType: 'blob'
  })
}

// 任务-今日数据
export function getDayinfoReq (data) {
  return request({
    url: '/diagnosiscareanalysisday/dayinfo',
    method: 'post',
    data
  })
}

// 任务-图标数据
export function getTaskChartsDataReq (data) {
  return request({
    url: '/diagnosiscareanalysisday/reportdata',
    method: 'post',
    data
  })
}

// 任务-报表列表
export function getTaskTableDataReq (data) {
  return request({
    url: '/diagnosiscareanalysisday/reportlist',
    method: 'post',
    data
  })
}
// 任务-导出报表列表
export function getExcelTaskTableDataReq (data) {
  return request({
    url: '/diagnosiscareanalysisday/exportreportlist',
    method: 'post',
    responseType: 'blob',
    data
  })
}

// 任务-各类型数据情况明细列表
export function getChartItemTableDataReq (data) {
  return request({
    url: '/diagnosiscareanalysisday/reporttaskdetallist',
    method: 'post',
    data
  })
}

// 任务-任务数明细列表(点任务数标题进入)
export function getTaskTableTitleItemDataReq (data) {
  return request({
    url: '/diagnosiscareanalysisday/tasknumlist',
    method: 'post',
    data
  })
}

// 任务-导出任务数明细列表(点任务数标题进入)
export function getExportTaskTableTitleItemDataReq (data) {
  return request({
    url: '/diagnosiscareanalysisday/exporttasknumlist',
    method: 'post',
    responseType: 'blob',
    data
  })
}

// 任务-机构/门店/员工任务数明细列表(点机构/门店/员工名称进入)
export function getTaskTableItemDataReq (data) {
  return request({
    url: '/diagnosiscareanalysisday/onamelist',
    method: 'post',
    data
  })
}

// 任务-导出机构/门店/员工任务数明细列表(点机构/门店/员工名称进入)
export function getExportTaskTableItemDataReq (data) {
  return request({
    url: '/diagnosiscareanalysisday/exportonamelist',
    method: 'post',
    responseType: 'blob',
    data
  })
}
