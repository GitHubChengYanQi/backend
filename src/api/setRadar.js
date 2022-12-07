import request from '@/utils/request'

// 保存
export function scrmRadarArticleSave (data) {
  return request({
    url: 'scrm_radar_article/save',
    method: 'post',
    data
  })
}

export function scrmRadarLabelFind (data) {
  return request({
    url: 'scrm_radar_label/find',
    method: 'post',
    data
  })
}
