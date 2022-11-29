import request, { fileRequest } from '@/utils/request'
// 临时获取群SOP模板数据
export function getTempSopList () {
  return [
    {
      id: 0,
      sopName: '测试1',
      createdAt: '2022-10-23',
      createdByName: '管理员1'
    },
    {
      id: 1,
      sopName: '测试2',
      createdAt: '2022-10-20',
      createdByName: '管理员2'
    },
    {
      id: 2,
      sopName: '测试3',
      createdAt: '2022-10-14',
      createdByName: '管理员3'
    },
    {
      id: 3,
      sopName: '测试4',
      createdAt: '2022-10-27',
      createdByName: '管理员4'
    }
  ]
}
// 临时获取执行中的SOP数据
export function getTempExecuteSopList () {
  return [
    {
      id: 0,
      sopName: '测试1',
      createdAt: '2022-10-23',
      clusterName: '测试群1',
      'listTaskInfo': [
        {
          'id': 182,
          'invalidState': 2,
          'sendContentList': [
            {
              'appId': '',
              'appPhoto': '',
              'appShow': '',
              'appUrl': '',
              'linkPhoto': '',
              'linkShow': '',
              'linkTitle': '',
              'linkUrl': '',
              'mediaId': '',
              'photoUrl': '',
              'sort': '',
              'textData': 'tyherg',
              'type': 1,
              'videoUrl': ''
            },
            {
              'appId': '',
              'appPhoto': '',
              'appShow': '',
              'appUrl': '',
              'linkPhoto': '',
              'linkShow': '',
              'linkTitle': '',
              'linkUrl': '',
              'mediaId': '',
              'photoUrl': 'https://yfscrm.oss-cn-beijing.aliyuncs.com/upload/16672941616550425946.jpg?Expires=1669430004&OSSAccessKeyId=LTAIAX24MUz7rbXu&Signature=2sFw38rZ7V62it9Fj4PJ1td1%2BAY%3D',
              'sort': '',
              'textData': '',
              'type': 2,
              'videoUrl': ''
            },
            {
              'appId': '',
              'appPhoto': '',
              'appShow': '',
              'appUrl': '',
              'linkPhoto': '',
              'linkShow': '',
              'linkTitle': '',
              'linkUrl': '',
              'mediaId': '',
              'photoUrl': 'https://yfscrm.oss-cn-beijing.aliyuncs.com/upload/16672941665650473901.jpg?Expires=1669430004&OSSAccessKeyId=LTAIAX24MUz7rbXu&Signature=hxyX%2FEIoEmQ5vGLuRKgYCevxkOY%3D',
              'sort': '',
              'textData': '',
              'type': 2,
              'videoUrl': ''
            },
            {
              'appId': '',
              'appPhoto': '',
              'appShow': '',
              'appUrl': '',
              'linkPhoto': '',
              'linkShow': '',
              'linkTitle': '',
              'linkUrl': '',
              'mediaId': '',
              'photoUrl': '',
              'sort': '',
              'textData': '',
              'type': 3,
              'videoUrl': 'https://yfscrm.oss-cn-beijing.aliyuncs.com/upload/16672941863590178957.mp4?Expires=1669430004&OSSAccessKeyId=LTAIAX24MUz7rbXu&Signature=j1gSXca6wAEBggbRapKKb3eJPAM%3D'
            },
            {
              'appId': '',
              'appPhoto': '',
              'appShow': '',
              'appUrl': '',
              'linkPhoto': 'https://yfscrm.oss-cn-beijing.aliyuncs.com/upload/16672942043510266707.jpg?Expires=1669430005&OSSAccessKeyId=LTAIAX24MUz7rbXu&Signature=UjZ2i72KP4%2FFkgBOq%2B3Cmp9uI%2BM%3D',
              'linkShow': 'rtertgr5t',
              'linkTitle': 'tertert',
              'linkUrl': 'http://www.baidu.com',
              'mediaId': '',
              'photoUrl': '',
              'sort': '',
              'textData': '',
              'type': 4,
              'videoUrl': ''
            },
            {
              'appId': 'rget',
              'appPhoto': 'https://yfscrm.oss-cn-beijing.aliyuncs.com/upload/16672942157610933056.jpg?Expires=1669430005&OSSAccessKeyId=LTAIAX24MUz7rbXu&Signature=qSf1IuJKNP2iBn%2BV%2B%2BnBfUuEZoc%3D',
              'appShow': 'egretg',
              'appUrl': 'edrtre',
              'linkPhoto': '',
              'linkShow': '',
              'linkTitle': '',
              'linkUrl': '',
              'mediaId': '',
              'photoUrl': '',
              'sort': '',
              'textData': '',
              'type': 5,
              'videoUrl': ''
            },
            {
              'appId': 'tetge',
              'appPhoto': 'https://yfscrm.oss-cn-beijing.aliyuncs.com/upload/16672942331420746873.jpg?Expires=1669430005&OSSAccessKeyId=LTAIAX24MUz7rbXu&Signature=BhmO%2FgbcyqiUEcCse66WXSJAGoQ%3D',
              'appShow': 'egyegt',
              'appUrl': 'egegt',
              'linkPhoto': '',
              'linkShow': '',
              'linkTitle': '',
              'linkUrl': '',
              'mediaId': '',
              'photoUrl': '',
              'sort': '',
              'textData': '',
              'type': 5,
              'videoUrl': ''
            },
            {
              'appId': 'egret',
              'appPhoto': 'https://yfscrm.oss-cn-beijing.aliyuncs.com/upload/16672942597290638888.jpg?Expires=1669430005&OSSAccessKeyId=LTAIAX24MUz7rbXu&Signature=R4fSs%2BgSP6S7nIBrsY5eTI79UlQ%3D',
              'appShow': 'eghet',
              'appUrl': 'eryge',
              'linkPhoto': '',
              'linkShow': '',
              'linkTitle': '',
              'linkUrl': '',
              'mediaId': '',
              'photoUrl': '',
              'sort': '',
              'textData': '',
              'type': 5,
              'videoUrl': ''
            }
          ],
          'sendDayNum': 1,
          'sendTimeRange': '10:20',
          'sort': 1,
          'executionState': '已完成'
        },
        {
          'id': 183,
          'invalidState': 2,
          'sendContentList': [
            {
              'appId': '',
              'appPhoto': '',
              'appShow': '',
              'appUrl': '',
              'linkPhoto': '',
              'linkShow': '',
              'linkTitle': '',
              'linkUrl': '',
              'mediaId': '',
              'photoUrl': '',
              'sort': '',
              'textData': 'tyherg',
              'type': 1,
              'videoUrl': ''
            },
            {
              'appId': '',
              'appPhoto': '',
              'appShow': '',
              'appUrl': '',
              'linkPhoto': '',
              'linkShow': '',
              'linkTitle': '',
              'linkUrl': '',
              'mediaId': '',
              'photoUrl': 'https://yfscrm.oss-cn-beijing.aliyuncs.com/upload/16672941616550425946.jpg?Expires=1669430004&OSSAccessKeyId=LTAIAX24MUz7rbXu&Signature=2sFw38rZ7V62it9Fj4PJ1td1%2BAY%3D',
              'sort': '',
              'textData': '',
              'type': 2,
              'videoUrl': ''
            },
            {
              'appId': '',
              'appPhoto': '',
              'appShow': '',
              'appUrl': '',
              'linkPhoto': '',
              'linkShow': '',
              'linkTitle': '',
              'linkUrl': '',
              'mediaId': '',
              'photoUrl': 'https://yfscrm.oss-cn-beijing.aliyuncs.com/upload/16672941665650473901.jpg?Expires=1669430004&OSSAccessKeyId=LTAIAX24MUz7rbXu&Signature=hxyX%2FEIoEmQ5vGLuRKgYCevxkOY%3D',
              'sort': '',
              'textData': '',
              'type': 2,
              'videoUrl': ''
            },
            {
              'appId': '',
              'appPhoto': '',
              'appShow': '',
              'appUrl': '',
              'linkPhoto': '',
              'linkShow': '',
              'linkTitle': '',
              'linkUrl': '',
              'mediaId': '',
              'photoUrl': '',
              'sort': '',
              'textData': '',
              'type': 3,
              'videoUrl': 'https://yfscrm.oss-cn-beijing.aliyuncs.com/upload/16672941863590178957.mp4?Expires=1669430004&OSSAccessKeyId=LTAIAX24MUz7rbXu&Signature=j1gSXca6wAEBggbRapKKb3eJPAM%3D'
            },
            {
              'appId': '',
              'appPhoto': '',
              'appShow': '',
              'appUrl': '',
              'linkPhoto': 'https://yfscrm.oss-cn-beijing.aliyuncs.com/upload/16672942043510266707.jpg?Expires=1669430005&OSSAccessKeyId=LTAIAX24MUz7rbXu&Signature=UjZ2i72KP4%2FFkgBOq%2B3Cmp9uI%2BM%3D',
              'linkShow': 'rtertgr5t',
              'linkTitle': 'tertert',
              'linkUrl': 'http://www.baidu.com',
              'mediaId': '',
              'photoUrl': '',
              'sort': '',
              'textData': '',
              'type': 4,
              'videoUrl': ''
            },
            {
              'appId': 'rget',
              'appPhoto': 'https://yfscrm.oss-cn-beijing.aliyuncs.com/upload/16672942157610933056.jpg?Expires=1669430005&OSSAccessKeyId=LTAIAX24MUz7rbXu&Signature=qSf1IuJKNP2iBn%2BV%2B%2BnBfUuEZoc%3D',
              'appShow': 'egretg',
              'appUrl': 'edrtre',
              'linkPhoto': '',
              'linkShow': '',
              'linkTitle': '',
              'linkUrl': '',
              'mediaId': '',
              'photoUrl': '',
              'sort': '',
              'textData': '',
              'type': 5,
              'videoUrl': ''
            },
            {
              'appId': 'tetge',
              'appPhoto': 'https://yfscrm.oss-cn-beijing.aliyuncs.com/upload/16672942331420746873.jpg?Expires=1669430005&OSSAccessKeyId=LTAIAX24MUz7rbXu&Signature=BhmO%2FgbcyqiUEcCse66WXSJAGoQ%3D',
              'appShow': 'egyegt',
              'appUrl': 'egegt',
              'linkPhoto': '',
              'linkShow': '',
              'linkTitle': '',
              'linkUrl': '',
              'mediaId': '',
              'photoUrl': '',
              'sort': '',
              'textData': '',
              'type': 5,
              'videoUrl': ''
            },
            {
              'appId': 'egret',
              'appPhoto': 'https://yfscrm.oss-cn-beijing.aliyuncs.com/upload/16672942597290638888.jpg?Expires=1669430005&OSSAccessKeyId=LTAIAX24MUz7rbXu&Signature=R4fSs%2BgSP6S7nIBrsY5eTI79UlQ%3D',
              'appShow': 'eghet',
              'appUrl': 'eryge',
              'linkPhoto': '',
              'linkShow': '',
              'linkTitle': '',
              'linkUrl': '',
              'mediaId': '',
              'photoUrl': '',
              'sort': '',
              'textData': '',
              'type': 5,
              'videoUrl': ''
            }
          ],
          'sendDayNum': 2,
          'sendTimeRange': '09:20',
          'sort': 1,
          'executionState': '未完成'
        }
      ]
    },
    {
      id: 1,
      sopName: '测试2',
      createdAt: '2022-10-20',
      clusterName: '测试群2',
      'listTaskInfo': [
        {
          'id': 179,
          'invalidState': 2,
          'sendContentList': [
            {
              'appId': '',
              'appPhoto': '',
              'appShow': '',
              'appUrl': '',
              'linkPhoto': '',
              'linkShow': '',
              'linkTitle': '',
              'linkUrl': '',
              'mediaId': '',
              'photoUrl': '',
              'sort': '',
              'textData': '测试文本',
              'type': 1,
              'videoUrl': ''
            },
            {
              'appId': '',
              'appPhoto': '',
              'appShow': '',
              'appUrl': '',
              'linkPhoto': '',
              'linkShow': '',
              'linkTitle': '',
              'linkUrl': '',
              'mediaId': '',
              'photoUrl': 'https://yfscrm.oss-cn-beijing.aliyuncs.com/upload/16672691226110319119.png?Expires=1669430086&OSSAccessKeyId=LTAIAX24MUz7rbXu&Signature=et8CDGlGgPiFv4ewl0C5cqboJas%3D',
              'sort': '',
              'textData': '',
              'type': 2,
              'videoUrl': ''
            },
            {
              'appId': '',
              'appPhoto': '',
              'appShow': '',
              'appUrl': '',
              'linkPhoto': '',
              'linkShow': '',
              'linkTitle': '',
              'linkUrl': '',
              'mediaId': '',
              'photoUrl': '',
              'sort': '',
              'textData': '',
              'type': 3,
              'videoUrl': 'https://yfscrm.oss-cn-beijing.aliyuncs.com/upload/16672691270830200930.mp4?Expires=1669430086&OSSAccessKeyId=LTAIAX24MUz7rbXu&Signature=hA2vYhwJxsCcZ4rwQbCCG6Cr%2Bus%3D'
            },
            {
              'appId': 'wxaee2f41eaa5f3fe6',
              'appPhoto': 'https://yfscrm.oss-cn-beijing.aliyuncs.com/upload/16671126941760169370.jpg?Expires=1669430086&OSSAccessKeyId=LTAIAX24MUz7rbXu&Signature=GoiiFgHax0fXycpSaIkg4du7FEY%3D',
              'appShow': '阿萨德小程序',
              'appUrl': 'pages/index/ind',
              'linkPhoto': '',
              'linkShow': '',
              'linkTitle': '',
              'linkUrl': '',
              'mediaId': '',
              'photoUrl': '',
              'sort': '',
              'textData': '',
              'type': 5,
              'videoUrl': ''
            },
            {
              'appId': '',
              'appPhoto': '',
              'appShow': '',
              'appUrl': '',
              'linkPhoto': 'https://yfscrm.oss-cn-beijing.aliyuncs.com/upload/16636379480670032078.jpeg?Expires=1669430086&OSSAccessKeyId=LTAIAX24MUz7rbXu&Signature=C4VceNy0qjGLQtsa5Mq5HfaBE4I%3D',
              'linkShow': '测啊啊',
              'linkTitle': '万径人踪灭',
              'linkUrl': 'https://aiaihospital.yifeijiankang.com/pages/diagnosis/index',
              'mediaId': '',
              'photoUrl': '',
              'sort': '',
              'textData': '',
              'type': 4,
              'videoUrl': ''
            }
          ],
          'sendDayNum': 5,
          'sendTimeRange': '11:20',
          'sort': 1,
          'executionState': '已删除'
        },
        {
          'id': 170,
          'invalidState': 2,
          'sendContentList': [
            {
              'appId': '',
              'appPhoto': '',
              'appShow': '',
              'appUrl': '',
              'linkPhoto': '',
              'linkShow': '',
              'linkTitle': '',
              'linkUrl': '',
              'mediaId': '',
              'photoUrl': '',
              'sort': '',
              'textData': '测试文本',
              'type': 1,
              'videoUrl': ''
            },
            {
              'appId': '',
              'appPhoto': '',
              'appShow': '',
              'appUrl': '',
              'linkPhoto': '',
              'linkShow': '',
              'linkTitle': '',
              'linkUrl': '',
              'mediaId': '',
              'photoUrl': 'https://yfscrm.oss-cn-beijing.aliyuncs.com/upload/16672691226110319119.png?Expires=1669430086&OSSAccessKeyId=LTAIAX24MUz7rbXu&Signature=et8CDGlGgPiFv4ewl0C5cqboJas%3D',
              'sort': '',
              'textData': '',
              'type': 2,
              'videoUrl': ''
            },
            {
              'appId': '',
              'appPhoto': '',
              'appShow': '',
              'appUrl': '',
              'linkPhoto': '',
              'linkShow': '',
              'linkTitle': '',
              'linkUrl': '',
              'mediaId': '',
              'photoUrl': '',
              'sort': '',
              'textData': '',
              'type': 3,
              'videoUrl': 'https://yfscrm.oss-cn-beijing.aliyuncs.com/upload/16672691270830200930.mp4?Expires=1669430086&OSSAccessKeyId=LTAIAX24MUz7rbXu&Signature=hA2vYhwJxsCcZ4rwQbCCG6Cr%2Bus%3D'
            },
            {
              'appId': 'wxaee2f41eaa5f3fe6',
              'appPhoto': 'https://yfscrm.oss-cn-beijing.aliyuncs.com/upload/16671126941760169370.jpg?Expires=1669430086&OSSAccessKeyId=LTAIAX24MUz7rbXu&Signature=GoiiFgHax0fXycpSaIkg4du7FEY%3D',
              'appShow': '阿萨德小程序',
              'appUrl': 'pages/index/ind',
              'linkPhoto': '',
              'linkShow': '',
              'linkTitle': '',
              'linkUrl': '',
              'mediaId': '',
              'photoUrl': '',
              'sort': '',
              'textData': '',
              'type': 5,
              'videoUrl': ''
            },
            {
              'appId': '',
              'appPhoto': '',
              'appShow': '',
              'appUrl': '',
              'linkPhoto': 'https://yfscrm.oss-cn-beijing.aliyuncs.com/upload/16636379480670032078.jpeg?Expires=1669430086&OSSAccessKeyId=LTAIAX24MUz7rbXu&Signature=C4VceNy0qjGLQtsa5Mq5HfaBE4I%3D',
              'linkShow': '测啊啊',
              'linkTitle': '万径人踪灭',
              'linkUrl': 'https://aiaihospital.yifeijiankang.com/pages/diagnosis/index',
              'mediaId': '',
              'photoUrl': '',
              'sort': '',
              'textData': '',
              'type': 4,
              'videoUrl': ''
            }
          ],
          'sendDayNum': 7,
          'sendTimeRange': '15:20',
          'sort': 1,
          'executionState': '未完成'
        }
      ]
    }
  ]
}
// 获取群SOP模板分页数据
export function getSopTemplateListMethod (params) {
  return request({
    url: '/sopClusterTemplate/index',
    method: 'get',
    params
  })
}
// 添加群SOP模板
export function addSopTemplateMethod (data) {
  return request({
    url: '/sopClusterTemplate/add',
    method: 'post',
    data
  })
}
// 获取群SOP模板详情
export function getSopTemplateDetailMethod (params) {
  return request({
    url: '/sopClusterTemplate/detail',
    method: 'get',
    params
  })
}
// 修改群SOP模板
export function editSopTemplateMethod (data) {
  return request({
    url: '/sopClusterTemplate/update',
    method: 'post',
    data
  })
}
// 删除群SOP模板
export function deleteSopTemplateMethod (params) {
  return request({
    url: '/sopClusterTemplate/delete',
    method: 'delete',
    params
  })
}
// 群SOP模板绑定群聊
export function bindSopTemplateMethod (data) {
  return request({
    url: '/sopClusterTemplate/sopBindCluster',
    method: 'post',
    data
  })
}
// 获取群聊列表
export function getGroupChatListMethod (data) {
  return request({
    url: '/sopClusterTemplate/getClusterList',
    method: 'post',
    data
  })
}
// 获取执行中的群SOP列表
export function getExecutingSopListMethod (params) {
  return request({
    url: '/sopCluster/getExecutionSop',
    method: 'get',
    params
  })
}
// 删除执行中的群SOP
export function deleteExecutingSopMethod (params) {
  return request({
    url: '/sopCluster/delete',
    method: 'delete',
    params
  })
}
// 获取执行记录群SOP列表
export function getExecuteRecordSopListMethod (params) {
  return request({
    url: '/sopCluster/getExecutionLog',
    method: 'get',
    params
  })
}
// 删除执行记录群SOP
export function deleteExecuteRecordSopMethod (params) {
  return request({
    url: '/sopCluster/deleteExecutionLog',
    method: 'delete',
    params
  })
}
// 导出数据
export function exportDataMethod (data) {
  return fileRequest({
    url: '/sopTaskDetail/getSopTaskDetailListExcel',
    method: 'post',
    responseType: 'blob',
    data
  })
}

// 获取群日历模板分页数据
export function getCalendarTemplateListMethod (params) {
  return request({
    url: '/sopClusterCalendarTemplate/index',
    method: 'get',
    params
  })
}
// 添加群日历模板
export function addCalendarTemplateMethod (data) {
  return request({
    url: '/sopClusterCalendarTemplate/add',
    method: 'post',
    data
  })
}
// 获取群日历模板详情
export function getCalendarTemplateDetailMethod (params) {
  return request({
    url: '/sopClusterCalendarTemplate/detail',
    method: 'get',
    params
  })
}
// 修改群日历模板
export function editCalendarTemplateMethod (data) {
  return request({
    url: '/sopClusterCalendarTemplate/update',
    method: 'post',
    data
  })
}
// 删除群日历模板
export function deleteCalendarTemplateMethod (params) {
  return request({
    url: '/sopClusterCalendarTemplate/delete',
    method: 'delete',
    params
  })
}
// 群日历模板绑定群聊
export function bindCalendarTemplateMethod (data) {
  return request({
    url: '/sopClusterCalendarTemplate/sopBindCluster',
    method: 'post',
    data
  })
}
// 获取执行中的群日历列表
export function getExecutingCalendarListMethod (params) {
  return request({
    url: '/sopClusterCalendar/getExecutionClusterCalendar',
    method: 'get',
    params
  })
}
// 删除执行中的群日历
export function deleteExecutingCalendarMethod (params) {
  return request({
    url: '/sopClusterCalendar/delete',
    method: 'delete',
    params
  })
}
// 获取执行记录群日历列表
export function getExecuteRecordCalendarListMethod (params) {
  return request({
    url: '/sopClusterCalendar/getExecutionLog',
    method: 'get',
    params
  })
}
// 删除执行记录群日历
export function deleteExecuteRecordCalendarMethod (params) {
  return request({
    url: '/sopClusterCalendar/deleteExecutionLog',
    method: 'delete',
    params
  })
}
