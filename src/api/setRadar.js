import request from '@/utils/request'

// 增改雷达文章
export function scrmRadarArticleSave (data) {
  return request({
    url: 'scrm_radar_article/save',
    method: 'post',
    data
  })
}
// 删除雷达文章
export function scrmRadarArticleDrop (data) {
  return request({
    url: 'scrm_radar_article/drop',
    method: 'post',
    data
  })
}
// 数据信息
export function scrmRadarVisitorIndex (data) {
  return request({
    url: 'scrm_radar_visitor/index',
    method: 'post',
    data
  })
}
// 数据图表
export function scrmRadarVisitorChart (data) {
  return request({
    url: 'scrm_radar_visitor/chart',
    method: 'post',
    data
  })
}
// 客户数据
export function scrmRadarVisitorVisit (data) {
  return request({
    url: 'scrm_radar_visitor/visit',
    method: 'post',
    data
  })
}
// 文章获取
export function scrmRadarArticleGrab (data) {
  return request({
    url: 'scrm_radar_article/grab',
    method: 'post',
    data
  })
}

export function scrmRadarVisitorExcel (data) {
  return request({
    url: 'scrm_radar_visitor/excel',
    method: 'post',
    data,
    responseType: 'blob'
  })
}

export function getScrmRadarVisitorVisit (data) {
  return request({
    url: 'scrm_radar_visitor/visit',
    method: 'get',
    data,
    responseType: 'blob'
  })
}
// 渠道数据
export function scrmRadarVisitorDitch (data) {
  return request({
    url: 'scrm_radar_visitor/ditch',
    method: 'post',
    data
  })
}
// 员工数据
export function scrmRadarVisitorShift (data) {
  return request({
    url: 'scrm_radar_visitor/shift',
    method: 'post',
    data
  })
}

// 批量删除文章
export function scrmRadarArticleAway (data) {
  return request({
    url: 'scrm_radar_article/away',
    method: 'post',
    data
  })
}
// 批量文章移组
export function scrmRadarArticleMove (data) {
  return request({
    url: 'scrm_radar_article/move',
    method: 'post',
    data
  })
}

// 雷达文章列表
export function scrmRadarArticleFind (data) {
  return request({
    url: 'scrm_radar_article/find',
    method: 'post',
    data
  })
}
// 导出文章列表
export function scrmRadarArticleDown (data) {
  return request({
    url: 'scrm_radar_article/down',
    method: 'post',
    data,
    responseType: 'blob'
  })
}

// 查看文章详情
export function scrmRadarArticleLoad (data) {
  return request({
    url: 'scrm_radar_article/load',
    method: 'post',
    data
  })
}

export function scrmRadarShiftSend (data) {
  return request({
    url: 'scrm_radar_shift/send',
    method: 'post',
    data
  })
}

// 分组 渠道信息
export function scrmRadarLabelFind (data) {
  return request({
    url: 'scrm_radar_label/find',
    method: 'post',
    data
  })
}
// 增改雷达分组
export function scrmRadarLabelSave (data) {
  return request({
    url: 'scrm_radar_label/save',
    method: 'post',
    data
  })
}
// 删除雷达分组
export function scrmRadarLabelDrop (data) {
  return request({
    url: 'scrm_radar_label/drop',
    method: 'post',
    data
  })
}
