import request from '@/utils/request'

export function learningQuestionnaireAdd (data) {
  return request({
    url: '/learningQuestionnaire/add',
    method: 'post',
    data
  })
}

export function learningQuestionnaireList (data) {
  return request({
    url: '/learningQuestionnaire/list',
    method: 'post',
    data
  })
}
