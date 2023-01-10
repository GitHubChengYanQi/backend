import request, { fileRequest } from '@/utils/request'
// 临时获取通用规则数据
export function getTempCommonData () {
  return [
    {
      id: '1',
      setName: '积分有效期',
      setDetail: '永久有效',
      updatedAt: '2022-07-21 17:27',
      setType: '1',
      creditsSetDeatilVo: {
        restrictionType: '2',
        isChecked: '1',
        monthDay: '10-10',
        lastYearMonthDay: '05-10',
        nextYearMonthDay: '10-09'
      }
    },
    {
      id: '2',
      setName: '积分上限',
      setDetail: '无上限',
      updatedAt: '2022-07-21 17:27',
      setType: '2',
      creditsSetDeatilVo: {
        restrictionType: '4',
        isChecked: '1'
      }
    },
    {
      id: '3',
      setName: '到期提醒',
      setDetail: '不提醒',
      updatedAt: '2022-07-21 17:27',
      setType: '3',
      creditsSetDeatilVo: {
        restrictionType: '6',
        isChecked: '1'
      }
    }
  ]
}
// 获取通用规则数据
export function getCommonRulesApi (params) {
  return request({
    url: '/creditsSet/creditsSetlist',
    method: 'get',
    params
  })
}
// 更新通用规则设置
export function setCommonRulesApi (data) {
  return request({
    url: '/creditsSet/setCreditsSet',
    method: 'post',
    data
  })
}
// 获取积分规则数据
export function getIntegralRulesApi (params) {
  return request({
    url: '/creditsRule/creditsRulePage',
    method: 'get',
    params
  })
}
// 更新积分规则数据
export function setIntegralRulesApi (data) {
  return request({
    url: '/creditsRule/creditsRuleList',
    method: 'post',
    data
  })
}
// 获取员工积分列表
export function getCustomerIntegralApi (params) {
  return request({
    url: '/creditsEmployee/creditsEmployeePage',
    method: 'get',
    params
  })
}
// 临时获取有效期类型数据
export function getValidityTypeData () {
  return [
    {
      id: 0,
      name: '永久有效',
      type: 'allValidity'
    },
    {
      id: 1,
      name: '定期清零',
      type: 'regularReset'
    },
    {
      id: 2,
      name: '每笔积分有效期',
      type: 'singleIntegralValidity'
    }
  ]
}
// 临时获取每笔积分有效期维度列表(年月日)
export function getSingleIntegralTypeData () {
  return [
    {
      id: 0,
      name: '年'
    },
    {
      id: 1,
      name: '月'
    },
    {
      id: 2,
      name: '日'
    }
  ]
}
// 临时获取通用规则设置积分上限选项列表
export function getCommonLimitListData () {
  return [
    {
      id: 0,
      name: '不限制',
      value: 'noLimit'
    },
    {
      id: 1,
      name: '员工每日获取积分上限',
      value: 'limit'
    }
  ]
}
// 临时获取通用规则到期提醒选项列表
export function getCommonRemindListData () {
  return [
    {
      id: 0,
      name: '不提醒',
      value: 'noRemind'
    },
    {
      id: 1,
      name: '到期',
      value: 'remind'
    }
  ]
}
// 临时获取积分规则数据
export function getTempIntegralData () {
  return [
    {
      id: '1',
      ruleType: '1',
      ruleName: '执行群发朋友圈任务',
      rulesDetail: '每完成1次朋友圈群发任务，员工可获得10积分',
      updatedAt: '2022-07-21 17:27',
      state: '1',
      sysRuleType: '系统规则',
      creditsRuleJsonDetailVo: {
        integral: '',
        friendDayNum: '',
        radarArticleIds: '',
        lookAfterDayNum: '',
        goodId: ''
      }
    },
    {
      id: '2',
      ruleType: '2',
      ruleName: '加好友',
      rulesDetail: '新添加1个好友，且3天未流失，员工可获得10积分',
      updatedAt: '2022-07-21 17:27',
      state: '0',
      sysRuleType: '系统规则',
      creditsRuleJsonDetailVo: {
        integral: '8',
        friendDayNum: '2',
        radarArticleIds: '',
        lookAfterDayNum: '',
        goodId: ''
      }
    },
    {
      id: '3',
      ruleType: '3',
      ruleName: '目标客户产生购买[商品名称]',
      rulesDetail: '好友查看了[雷达素材]后，且7天内购买了[商品名称]，员工可获得10积分',
      updatedAt: '2022-07-21 17:27',
      state: '1',
      sysRuleType: '系统规则',
      creditsRuleJsonDetailVo: {
        integral: '10',
        friendDayNum: '',
        radarArticleIds: '',
        lookAfterDayNum: '2',
        goodId: '',
        salesReturnDayNum: '3'
      }
    },
    {
      id: '4',
      ruleType: '4',
      ruleName: '好友查看素材',
      rulesDetail: '好友查看了[雷达素材]后，员工可获得10积分',
      updatedAt: '2022-07-21 17:27',
      state: '1',
      sysRuleType: '系统规则',
      creditsRuleJsonDetailVo: {
        integral: '10',
        friendDayNum: '',
        radarArticleIds: '',
        lookAfterDayNum: '',
        goodId: '',
        validDayNum: '1',
        salesReturnDayNum: ''
      }
    }
  ]
}
// 临时获取积分管理列表数据
export function getTempIntegralManagerData () {
  return [
    {
      id: 1,
      managerName: '员工1',
      integralTotal: 100,
      integralSend: 10,
      integralUse: 20,
      integralOver: 30
    },
    {
      id: 2,
      managerName: '员工2',
      integralTotal: 100,
      integralSend: 10,
      integralUse: 20,
      integralOver: 30
    },
    {
      id: 3,
      managerName: '员工3',
      integralTotal: 100,
      integralSend: 10,
      integralUse: 20,
      integralOver: 30
    },
    {
      id: 4,
      managerName: '员工4',
      integralTotal: 100,
      integralSend: 10,
      integralUse: 20,
      integralOver: 30
    }
  ]
}
// 获取字典
export function getDictData (params) {
  return request({
    url: '/dictData/getListByType',
    method: 'get',
    params
  })
}
// 群SOP导出数据
export function exportClusterSopMethod (params) {
  return fileRequest({
    url: '/sopCluster/getExecutionLogExcel',
    method: 'get',
    responseType: 'blob',
    params
  })
}
// 商品库列表
export function erpGoods (params) {
  return request({
    url: '/erpGoods/list',
    method: 'get',
    params
  })
}
