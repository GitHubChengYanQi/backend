import request, { fileRequest } from '@/utils/request'

// 设备列表分页查询
export function equipListApi (params) {
  return request({
    url: '/healthWorkstationDevices/index',
    method: 'get',
    params
  })
}

// 获取设备详情
export function getEquipDetailApi (params) {
  return request({
    url: '/healthWorkstationDevices/getDevicesById',
    method: 'get',
    params
  })
}

// 设备修改
export function updateEquipApi (data) {
  return request({
    url: '/healthWorkstationDevices/update',
    method: 'post',
    data
  })
}

// 数据统计血压
export function bloodPressureTestApi (params) {
  return request({
    url: '/healthWorkstationBloodPressure/indexBloodPressure',
    method: 'get',
    params
  })
}

// 数据统计血压导出
export function exportBloodPressureTestApi (params) {
  return fileRequest({
    url: '/healthWorkstationBloodPressure/excelBloodPressure',
    method: 'get',
    responseType: 'blob',
    params
  })
}

// 数据统计血糖
export function bloodSugarTestApi (params) {
  return request({
    url: '/healthWorkstationBloodGlucose/indexBloodGlucose',
    method: 'get',
    params
  })
}

// 数据统计血糖导出
export function exportBloodSugarTestApi (params) {
  return fileRequest({
    url: '/healthWorkstationBloodGlucose/excelBloodGlucose',
    method: 'get',
    responseType: 'blob',
    params
  })
}
// 数据统计血脂
export function bloodFlatTestApi (params) {
  return request({
    url: '/healthWorkstationBloodFat/indexBloodFat',
    method: 'get',
    params
  })
}

// 数据统计血脂导出
export function exportBloodFlatTestApi (params) {
  return fileRequest({
    url: '/healthWorkstationBloodFat/excelBloodFat',
    method: 'get',
    responseType: 'blob',
    params
  })
}
// 数据统计尿酸
export function uricAcidTestApi (params) {
  return request({
    url: '/healthWorkstationUricAcid/indexUricAcid',
    method: 'get',
    params
  })
}

// 数据统计尿酸导出
export function exportUricAcidTestApi (params) {
  return fileRequest({
    url: '/healthWorkstationUricAcid/excelUricAcid',
    method: 'get',
    responseType: 'blob',
    params
  })
}

// 数据统计员工检测数据
export function managerTestApi (params) {
  return request({
    url: '/healthWorkstationEmpDetection/indexEmpDetection',
    method: 'get',
    params
  })
}

// 数据统计员工检测数据导出
export function exportManagerTestApi (params) {
  return fileRequest({
    url: '/healthWorkstationEmpDetection/excelEmpDetection',
    method: 'get',
    responseType: 'blob',
    params
  })
}
