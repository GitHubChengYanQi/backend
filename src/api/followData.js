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
