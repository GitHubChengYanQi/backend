import request from '@/utils/request'

export function learningQuestionnaireAdd (data) {
  return request({
    url: '/learningQuestionnaire/add',
    method: 'post',
    data
  })
}

export function learningQuestionnaireEdit (data) {
  return request({
    url: '/learningQuestionnaire/edit',
    method: 'post',
    data
  })
}

export function learningQuestionnaireDownloadTemplate (data) {
  return request({
    url: '/learningQuestionnaire/downloadTemplate',
    responseType: 'blob',
    method: 'post',
    data
  })
}

export function learningQuestionnaireImportQuestionnaire (data) {
  return request({
    url: '/learningQuestionnaire/ImportQuestionnaire',
    method: 'post',
    data
  })
}

export function learningQuestionnaireList (data, params) {
  return request({
    url: '/learningQuestionnaire/list',
    method: 'post',
    data,
    params
  })
}

export function learningQuestionnaireDetail (data) {
  return request({
    url: '/learningQuestionnaire/detail',
    method: 'post',
    data
  })
}

export function learningQuestionnaireCheckBind (data) {
  return request({
    url: '/learningQuestionnaire/checkBind',
    method: 'post',
    data
  })
}

export function learningQuestionnaireDelete (data) {
  return request({
    url: '/learningQuestionnaire/delete',
    method: 'post',
    data
  })
}
