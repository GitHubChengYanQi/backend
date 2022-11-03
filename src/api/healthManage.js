import request, { newRequest } from '@/utils/request'

// 问卷详情
export function diagnosisCareQuestionnaireDetail (params) {
  return request({
    url: '/diagnosisCareQuestionnaire/detail',
    method: 'get',
    params: params
  })
}

// 风险预警问卷列表
export function diagnosisCareQuestionnaireQuestionnaireList (data, params) {
  return request({
    url: 'diagnosisCareQuestionnaire/questionnaireList',
    method: 'POST',
    data: data,
    params: params
  })
}

// 问卷列表
export function diagnosisCareQuestionnaireList (data, params) {
  return request({
    url: '/diagnosisCareQuestionnaire/list',
    method: 'POST',
    data: data,
    params: params
  })
}

// 新建问卷
export function diagnosisCareQuestionnaireSaveByExcel (data) {
  return request({
    url: '/diagnosisCareQuestionnaire/saveByExcel',
    method: 'POST',
    data: data
  })
}
// 问卷删除
export function diagnosisCareQuestionnaireDlete (data) {
  return request({
    url: '/diagnosisCareQuestionnaire/delete',
    method: 'POST',
    data: data
  })
}
// 新建方案
export function planPlanAdd (data) {
  return request({
    url: '/planPlan/add',
    method: 'POST',
    data: data
  })
}

// 方案详情
export function planPlanDetail (data) {
  return request({
    url: '/planPlan/detail',
    method: 'POST',
    data: data
  })
}

// 编辑方案
export function planPlanEdit (data) {
  return request({
    url: '/planPlan/edit',
    method: 'POST',
    data: data
  })
}
// 启用 / 暂停状态
export function planPlanUpdateStatus (data) {
  return request({
    url: '/planPlan/updateStatus',
    method: 'POST',
    data: data
  })
}

// 已用随访方案 - 详情 - 患者管理列表 -添加患者
export function planBindAddBatch (data) {
  return request({
    url: '/planBind/addBatch',
    method: 'POST',
    data: data
  })
}

// 已用随访方案 - 详情 - 患者管理列表
export function planBindList (data, params) {
  return request({
    url: '/planBind/list',
    method: 'POST',
    data: data,
    params: params
  })
}
// 已用随访方案 - 详情 - 患者管理状态修改
export function planBindEdit (data) {
  return request({
    url: '/planBind/edit',
    method: 'POST',
    data: data
  })
}
// 已用随访方案 - 详情 - 患者管理状态修改
export function planBindDelete (data) {
  return request({
    url: '/planBind/delete',
    method: 'POST',
    data: data
  })
}

// 已用随访方案列表
export function planPlanList (data, params) {
  return request({
    url: '/planPlan/list',
    method: 'POST',
    data: data,
    params: params
  })
}
// 患者详情
export function getContactPlans (params) {
  return request({
    url: '/planBind/getContactPlans',
    method: 'get',
    params: params
  })
}

// 已用随访方案 - 详情 - 随访任务
export function taskDetailList (data, params) {
  return request({
    url: '/taskDetail/list',
    method: 'POST',
    data: data,
    params: params
  })
}

// 患者详情 - 随访记录 时间轴
export function taskContactDetailTasks (data) {
  return request({
    url: '/task/contactDetailTasks',
    method: 'POST',
    data: data
  })
}

// 患者分组 - 添加分组
export function categoryAdd (data) {
  return request({
    url: '/category/add',
    method: 'POST',
    data: data
  })
}
// 患者分组 - 修改分组
export function categoryEdit (data) {
  return request({
    url: '/category/edit',
    method: 'POST',
    data: data
  })
}
// 患者分组 - 解散分组
export function categoryDelete (data) {
  return request({
    url: '/category/delete',
    method: 'POST',
    data: data
  })
}
// 患者分组 - 分组列表
export function categoryList (data) {
  return request({
    url: '/category/list',
    method: 'POST',
    data: data
  })
}
// 患者分组 - 组内成员
export function categoryBindList (data, params) {
  return request({
    url: '/categoryBind/list',
    method: 'POST',
    data: data,
    params: params
  })
}

// 患者分组 - 给患者添加分组
export function categoryBindAdd (data) {
  return request({
    url: '/categoryBind/add',
    method: 'POST',
    data: data
  })
}
// 患者分组 - 移动分组
export function categoryBindTransfer (data) {
  return request({
    url: '/categoryBind/transfer',
    method: 'POST',
    data: data
  })
}
// 患者分组 - 移除患者
export function categoryBindDelete (data) {
  return request({
    url: '/categoryBind/delete',
    method: 'POST',
    data: data
  })
}
// 方案库 - 添加企业方案
export function planTemplateAdd (data) {
  return request({
    url: '/planTemplate/add',
    method: 'POST',
    data: data
  })
}

// 方案库 - 查看企业方案
export function planTemplateDetail (data) {
  return request({
    url: '/planTemplate/detail',
    method: 'POST',
    data: data
  })
}
// 方案库 - 修改企业方案
export function planTemplateEdit (data) {
  return request({
    url: '/planTemplate/edit',
    method: 'POST',
    data: data
  })
}
// 方案库 - 修改企业方案
export function planTemplateList (data) {
  return request({
    url: '/planTemplate/list',
    method: 'POST',
    data: data
  })
}
// 方案库 - 添加到随访方案
export function planTemplateAddToPlan (data) {
  return request({
    url: '/planTemplate/addToPlan',
    method: 'POST',
    data: data
  })
}

// 患者详情 - 插入任务
export function taskAdd (data) {
  return request({
    url: '/task/add',
    method: 'POST',
    data: data
  })
}
// 素材库 - 分类列表
export function mediumGroupInde (params) {
  return request({
    url: '/mediumGroup/index',
    method: 'get',
    params: params
  })
}
// 素材库 - 素材列表
export function mediumIndex (params) {
  return request({
    url: '/medium/index',
    method: 'get',
    params: params
  })
}

// 上传图片
export function commonUpload (data) {
  return request({
    url: '/common/upload',
    method: 'POST',
    data: data
  })
}

// 答卷
export function diagnosisCareResultAdd (data) {
  return request({
    url: '/diagnosisCareResult/add',
    method: 'POST',
    data: data
  })
}
// 获取答卷详情
export function diagnosisCareResultDetail (params) {
  return request({
    url: '/diagnosisCareResult/detail',
    method: 'GET',
    params: params
  })
}
// 删除任务
export function taskDetailDelete (data) {
  return request({
    url: '/taskDetail/delete',
    method: 'POST',
    data: data
  })
}
// 全部患者列表
export function planBindContactList (data, params) {
  return request({
    url: '/planBind/contactList',
    method: 'POST',
    data: data,
    params: params
  })
}
// 获取部门+人员Tree
export function workDepartmentDepartmentEmp (data) {
  return request({
    url: '/workDepartment/departmentEmp',
    method: 'get',
    data: data
  })
}
// 下载模板
export function questionExcelDownloadTemplate (data) {
  return newRequest({
    url: '/questionExcel/downloadTemplate',
    method: 'POST',
    responseType: 'blob',
    fileName: '问卷模板',
    data: data
  })
}
// 下载问卷
export function questionExcelDownLoadQuestionnaire (data) {
  return newRequest({
    url: '/questionExcel/downLoadQuestionnaire',
    method: 'POST',
    responseType: 'blob',
    fileName: `问卷${Math.round(new Date() / 1000)}`,
    data: data
  })
}
// 历史问卷
export function diagnosisCareResultList (params, data) {
  return request({
    url: '/diagnosisCareResult/list',
    method: 'POST',
    params: params,
    data: data
  })
}
// 查询患教/嘱托详情
export function taskDetailGetMediumDetail (params) {
  return request({
    url: '/taskDetail/getMediumDetail',
    method: 'GET',
    params: params
  })
}
// 获取方案下的所有任务
export function taskDetailSelectList (data) {
  return request({
    url: '/taskDetail/selectList',
    method: 'POST',
    data: data
  })
}
// 随访统计列表
export function taskDetailTaskView (params, data) {
  return request({
    url: '/taskDetail/taskView',
    method: 'POST',
    params: params,
    data: data
  })
}
// 随访统计图表
export function taskDetailTaskViewList (data) {
  return request({
    url: '/taskDetail/taskViewList',
    method: 'POST',
    data: data
  })
}
// 客户-客户列表
export function workContactList (data, params) {
  return request({
    url: '/planBind/contactPageList',
    method: 'POST',
    data: data,
    params: params
  })
}
// 方案下所有任务列表
export function taskSelectList (data) {
  return request({
    url: '/task/selectList',
    method: 'POST',
    data: data
  })
}
// 问卷更新
export function diagnosisCareQuestionnaireUpdateByExcel (data) {
  return request({
    url: '/diagnosisCareQuestionnaire/updateByExcel',
    method: 'POST',
    data: data
  })
}
