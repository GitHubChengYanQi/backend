export const routeList = {
  '/corp/index': {
    path: '/corp/index',
    name: 'corpIndex',
    component: () => import('@/views/corp/index'),
    meta: { title: '企业微信授权' }
  },
  '/dict/dictData': {
    path: '/dict/dictData',
    name: 'dictData',
    component: () => import('@/views/dict/dictData'),
    meta: { title: '普通字典' }
  },
  '/dict/dictDataDetail': {
    path: '/dict/dictDataDetail',
    name: 'dictDataDetail',
    hidden: true,
    component: () => import('@/views/dict/dictDataDetail'),
    meta: { title: '普通字典详情' }
  },
  '/dict/dictTreeType': {
    path: '/dict/dictTreeType',
    name: 'dictTreeType',
    component: () => import('@/views/dict/dictTreeType'),
    meta: { title: '多级字典分类' }
  },
  '/dict/dictTreeDict': {
    path: '/dict/dictTreeDict',
    name: 'dictTreeDict',
    hidden: true,
    component: () => import('@/views/dict/dictTreeDict'),
    meta: { title: '多级字典详情' }
  },
  '/corp/create': {
    path: '/corp/create',
    name: 'corpCreate',
    // hidden: true,
    component: () => import(/* webpackChunkName: "corpCreate" */'@/views/corp/create'),
    meta: { title: '添加企业' }
  },
  '/corp/configManage': {
    path: '/corp/configManage',
    name: 'corpConfigManage',
    component: () => import(/* webpackChunkName: "corpConfigManage" */ '@/views/corp/configManage'),
    meta: { title: '配置管理' }
  },
  '/user/index': {
    path: '/user/index',
    name: 'user',
    component: () => import('@/views/user/index'),
    meta: { title: '子账户管理' }
  },
  '/passwordUpdate/index': {
    path: '/passwordUpdate/index',
    name: 'passwordUpdate',
    hidden: true,
    component: () => import('@/views/passwordUpdate/index'),
    meta: { title: '修改密码' }
  },
  '/workEmployee/index': {
    path: '/workEmployee/index',
    name: 'workEmployeeIndex',
    component: () => import('@/views/workEmployee/index'),
    meta: { title: '企业成员' }
  },
  '/workMessageConfig/corpShow': {
    path: '/workMessageConfig/corpShow',
    name: 'workMessageConfigCorpShow',
    component: () => import('@/views/workMessageConfig/corpShow'),
    meta: { title: '聊天记录申请' }
  },
  '/role/index': {
    path: '/role/index',
    name: 'roleIndex',
    component: () => import('@/views/role/index'),
    meta: { title: '角色管理' }
  },
  '/role/permissionShow': {
    path: '/role/permissionShow',
    name: 'rolePermissionShow',
    hidden: true,
    component: () => import('@/views/role/permissionShow'),
    meta: { title: '权限设置' }
  },
  '/chatTool/enhance': {
    path: '/chatTool/enhance',
    name: 'chatEnhance',
    component: () => import('@/views/chatTool/enhance'),
    meta: { title: '聊天增强' }
  },
  '/chatTool/customer': {
    path: '/chatTool/customer',
    name: 'customer',
    component: () => import('@/views/chatTool/customer'),
    meta: { title: '用户画像' }
  },
  '/menu/index': {
    path: '/menu/index',
    name: 'menuIndex',
    component: () => import('@/views/menu/index'),
    meta: { title: '菜单' }
  },
  '/department/index': {
    path: '/department/index',
    name: 'departmentIndex',
    component: () => import('@/views/department/index'),
    meta: { title: '组织架构' }
  },
  '/workContact/index': {
    path: '/workContact/index',
    name: 'workContactIndex',
    // hideChildrenInMenu: true,
    component: () => import('@/views/workContactNew/index'),
    meta: { title: '客户列表' }
  },
  '/workContact/contactFieldPivot': {
    path: '/workContact/contactFieldPivot',
    name: 'contactFieldPivot',
    hidden: true,
    component: () => import('@/views/workContactNew/detail'),
    meta: { title: '客户详情' }
  },
  '/contactField/index': {
    path: '/contactField/index',
    name: 'contactField',
    component: () => import('@/views/contactField/index'),
    meta: { title: '客户资料卡' }
  },
  '/lossContact/index': {
    path: '/lossContact/index',
    name: 'lossContact',
    component: () => import('@/views/lossContact/index'),
    meta: { title: '流失客户' }
  },
  // 客户迁移
  '/contactTransfer/resignIndex': {
    path: '/contactTransfer/resignIndex',
    name: 'contactTransferResignIndex',
    component: () => import(/* webpackChunkName: "contact-transfer" */ '@/views/contactTransfer/resignIndex'),
    meta: { title: '离职继承' },
    header: {
      nav: ['待分配客户', '待分配群聊'],
      course: true
    }
  },
  '/contactTransfer/resignAllotRecord': {
    path: '/contactTransfer/resignAllotRecord',
    name: 'contactTransferResignAllotRecord',
    hidden: true,
    component: () => import(/* webpackChunkName: "contact-transfer" */ '@/views/contactTransfer/resignAllotRecord'),
    meta: { title: '分配记录' },
    header: {
      title: '分配记录',
      return: false
    }
  },
  '/contactTransfer/workIndex': {
    path: '/contactTransfer/workIndex',
    name: 'contactTransferWorkIndex',
    component: () => import(/* webpackChunkName: "contact-transfer" */ '@/views/contactTransfer/workIndex'),
    meta: { title: '在职转接' },
    header: {
      title: '在职转接',
      course: true
    }
  },
  '/contactTransfer/workAllotRecord': {
    path: '/contactTransfer/workAllotRecord',
    name: 'contactTransferWorkAllotRecord',
    hidden: true,
    component: () => import(/* webpackChunkName: "contact-transfer" */ '@/views/contactTransfer/workAllotRecord'),
    meta: { title: '分配记录' },
    header: {
      title: '分配记录',
      return: true
    }
  },
  '/workContactTag/index': {
    path: '/workContactTag/index',
    name: 'workContactTag',
    component: () => import('@/views/workContactTag/index'),
    meta: { title: '标签管理' }
  },
  '/workRoom/index': {
    path: '/workRoom/index',
    name: 'workRoomIndex',
    component: () => import('@/views/workRoom/index'),
    meta: { title: '群列表' }
  },
  '/workRoom/statistics': {
    path: '/workRoom/statistics',
    name: 'statistics',
    hidden: true,
    component: () => import('@/views/workRoom/statistics'),
    meta: { title: '群统计' }
  },
  '/workRoomAutoPull/index': {
    path: '/workRoomAutoPull/index',
    name: 'workRoomAutoPull',
    component: () => import('@/views/workRoomAutoPull/index'),
    meta: { title: '自动拉群列表' }
  },
  '/workRoomAutoPull/store': {
    path: '/workRoomAutoPull/store',
    name: 'workRoomAutoPullStore',
    hidden: true,
    component: () => import('@/views/workRoomAutoPull/store'),
    meta: { title: '新建拉群' }
  },
  '/mediumGroup/index': {
    path: '/mediumGroup/index',
    name: 'mediumGroupIndex',
    component: () => import('@/views/mediumGroup/index'),
    meta: { title: '素材库' }
  },
  '/workMessage/index': {
    path: '/workMessage/index',
    name: 'workMessageIndex',
    component: () => import('@/views/workMessage/index'),
    meta: { title: '聊天记录' }
  },
  '/workMessage/toUsers': {
    path: '/workMessage/toUsers',
    name: 'workMessageToUsers',
    hidden: true,
    component: () => import('@/views/workMessage/toUsers'),
    meta: { title: '聊天记录查看' }
  },
  '/sensitiveWords/index': {
    path: '/sensitiveWords/index',
    name: 'sensitiveWordsIndex',
    component: () => import('@/views/sensitiveWords/index'),
    meta: { title: '敏感词词库' }
  },
  '/sensitiveWordsMonitor/index': {
    path: '/sensitiveWordsMonitor/index',
    name: 'sensitiveWordsMonitorIndex',
    component: () => import('@/views/sensitiveWordsMonitor/index'),
    meta: { title: '敏感词监控' }
  },
  '/greeting/index': {
    path: '/greeting/index',
    name: 'greetingIndex',
    component: () => import('@/views/greeting/index'),
    meta: { title: '欢迎语' }
  },
  '/greeting/store': {
    path: '/greeting/store',
    name: 'greetingStore',
    hidden: true,
    component: () => import('@/views/greeting/store'),
    meta: { title: '设置欢迎语' }
  },
  // '/channelCode/index': {
  //   path: '/channelCode/index',
  //   name: 'channelCodeIndex',
  //   component: () => import('@/views/channelCode/index'),
  //   meta: { title: '渠道码' }
  // },
  // '/channelCode/store': {
  //   path: '/channelCode/store',
  //   name: 'channelCodeStore',
  //   hidden: true,
  //   component: () => import('@/views/channelCode/store'),
  //   meta: { title: '新建渠道码' }
  // },
  // '/channelCode/statistics': {
  //   path: '/channelCode/statistics',
  //   name: 'channelCodeStatistics',
  //   hidden: true,
  //   component: () => import('@/views/channelCode/statistics'),
  //   meta: { title: '统计' }
  // },
  '/corpData/index': {
    path: '/corpData/index',
    name: 'systemHomePage',
    component: () => import('@/views/corpData/index'),
    meta: { title: '系统首页' }
  },
  '/channelCodeNew/index': {
    path: '/channelCodeNew/index',
    name: 'channelCodeNewIndex',
    component: () => import('@/views/channelCodeNew/index'),
    meta: { title: '门店活码' }
  },
  '/channelCodeNew/store': {
    path: '/channelCodeNew/store',
    name: 'channelCodeNewStore',
    hidden: true,
    component: () => import('@/views/channelCodeNew/store'),
    meta: { title: '新建活码' }
  },
  '/greeting/userSearch': {
    path: '/greeting/userSearch',
    name: 'userSearch',
    component: () => import('@/views/greeting/userSearch'),
    meta: { title: '用户搜索添加' }
  },
  '/increaseWinCustomer/taskPrize': {
    path: '/increaseWinCustomer/taskPrize',
    name: 'taskPrize',
    component: () => import('@/views/increaseWinCustomer/taskPrize'),
    meta: { title: '任务奖品' }
  },
  '/increaseWinCustomer/taskPrize/addPrize': {
    path: '/increaseWinCustomer/taskPrize/addPrize',
    name: 'addPrize',
    hidden: true,
    component: () => import('@/views/increaseWinCustomer/addPrize'),
    meta: { title: '新建奖品' }
  },
  '/increaseWinCustomer/taskPrize/redactPrize': {
    path: '/increaseWinCustomer/taskPrize/redactPrize',
    name: 'redactPrize',
    hidden: true,
    component: () => import('@/views/increaseWinCustomer/addPrize'),
    meta: { title: '编辑奖品' }
  },
  '/increaseWinCustomer/taskPrize/redeemCodeManagement': {
    path: '/increaseWinCustomer/taskPrize/redeemCodeManagement',
    name: 'redeemCodeManagement',
    hidden: true,
    component: () => import('@/views/increaseWinCustomer/redeemCodeManagement'),
    meta: { title: '兑换码管理' }
  },
  '/wxCustomer/index': {
    path: '/wxCustomer/index',
    name: 'wxCustomer',
    component: () => import('@/views/wxCustomer/index'),
    meta: { title: '公众号获客' }
  },
  '/customer/actor': {
    path: '/customer/actor',
    name: 'actor',
    component: () => import('@/views/customer/actor'),
    meta: { title: '客户设置' }
  },
  '/customer/actorDetail': {
    path: '/customer/actorDetail',
    name: 'actorDetail',
    hidden: true,
    component: () => import('@/views/customer/list/components/actorDetail'),
    meta: { title: '客户协作人详情' }
  },
  '/customer/list': {
    path: '/customer/list',
    name: 'actorList',
    component: () => import('@/views/customer/list'),
    meta: { title: '协作人列表' }
  },
  '/marketing/draw': {
    path: '/marketing/draw',
    name: 'draw',
    component: () => import('@/views/marketing/draw'),
    meta: { title: '抽奖' }
  },
  '/marketing/drawData': {
    path: '/marketing/drawData',
    name: 'drawData',
    hidden: true,
    component: () => import('@/views/marketing/draw/data'),
    meta: { title: '抽奖数据' }
  },
  '/marketing/drawAdd': {
    path: '/marketing/drawAdd',
    name: 'drawAdd',
    hidden: true,
    component: () => import('@/views/marketing/draw/update'),
    meta: { title: '创建抽奖' }
  },
  '/marketing/drawEdit': {
    path: '/marketing/drawEdit',
    name: 'drawEdit',
    hidden: true,
    component: () => import('@/views/marketing/draw/update'),
    meta: { title: '编辑抽奖' }
  },
  '/wxCustomer/data': {
    path: '/wxCustomer/data',
    name: 'wxCustomerData',
    hidden: true,
    component: () => import('@/views/wxCustomer/data'),
    meta: { title: '活动数据' }
  },
  '/wxCustomer/add': {
    path: '/wxCustomer/add',
    name: 'wxCustomerAdd',
    hidden: true,
    component: () => import('@/views/wxCustomer/update'),
    meta: { title: '创建活动' }
  },
  '/wxCustomer/edit': {
    path: '/wxCustomer/edit',
    name: 'wxCustomerEdit',
    hidden: true,
    component: () => import('@/views/wxCustomer/update'),
    meta: { title: '编辑活动' }
  },
  '/wxCustomer/publicAccountsAuthorization': {
    path: '/wxCustomer/publicAccountsAuthorization',
    name: 'publicAccountsAuthorization',
    hidden: true,
    component: () => import('@/views/wxCustomer/publicAccountsAuthorization'),
    meta: { title: '公众号授权' }
  },
  '/wxCustomer/popularize': {
    path: '/wxCustomer/popularize',
    name: 'popularize',
    hidden: true,
    component: () => import('@/views/wxCustomer/popularize'),
    meta: { title: '活动推广' }
  },
  '/followUp/patient': {
    path: '/followUp/patient',
    name: 'patient',
    component: () => import('@/views/followUp/patient/index'),
    meta: { title: '全部随访患者' }
  },
  '/followUp/knowledge': {
    path: '/followUp/knowledge',
    name: 'knowledge',
    component: () => import('@/views/followUp/knowledge/index'),
    meta: { title: '知识库' }
  },
  '/followUp/group': {
    path: '/followUp/group',
    name: 'group',
    component: () => import('@/views/followUp/group/index'),
    meta: { title: '随访患者分组' }
  },
  '/followUp/bluePrint': {
    path: '/followUp/bluePrint',
    name: 'bluePrint',
    component: () => import('@/views/followUp/bluePrint/index'),
    meta: { title: '已用随访方案' }
  },
  '/followUp/schemeLibrary': {
    path: '/followUp/schemeLibrary',
    name: 'schemeLibrary',
    component: () => import('@/views/followUp/schemeLibrary/index'),
    meta: { title: '随访方案库' }
  },
  '/healthRecords/trem/index': {
    path: '/healthRecords/trem/index',
    name: 'healthRecords',
    component: () => import('@/views/healthRecords/trem/index'),
    meta: { title: '业务术语' }
  },
  '/clientFollow/autoLabel': {
    path: '/clientFollow/autoLabel',
    name: 'autoLabel',
    component: () => import('@/views/clientFollow/autoLabel'),
    meta: { title: '自动标签' }
  },
  '/clientFollow/labelInfo': {
    path: '/clientFollow/labelInfo',
    name: 'labelInfo',
    hidden: true,
    component: () => import('@/views/clientFollow/labelInfo'),
    meta: { title: '规则详情' }
  },
  '/clientFollow/addRule': {
    path: '/clientFollow/addRule',
    name: 'addRule',
    hidden: true,
    component: () => import('@/views/clientFollow/addRule'),
    meta: { title: '添加规则' }
  },
  '/sales/sop': {
    path: '/sales/sop',
    name: 'sop',
    component: () => import('@/views/sales/sop'),
    meta: { title: 'SOP管理' },
    header: {
      nav: ['群发助手SOP', '群发活动SOP', '定时提醒SOP', '好友SOP', '生日SOP'],
      course: true
    }
  },
  '/sales/generalAdd': {
    path: '/sales/generalAdd',
    name: 'generalAdd',
    component: () => import('@/views/sales/sop/components/generalAdd'),
    hidden: true,
    meta: { title: '新增群发助手SOP' }
  },
  '/sales/generalEdit': {
    path: '/sales/generalEdit',
    name: 'generalEdit',
    component: () => import('@/views/sales/sop/components/generalAdd'),
    hidden: true,
    meta: { title: '修改群发助手SOP' }
  },
  '/sales/activityAdd': {
    path: '/sales/activityAdd',
    name: 'generalAdd',
    component: () => import('@/views/sales/sop/components/activityAdd'),
    hidden: true,
    meta: { title: '新增群发活动SOP' }
  },
  '/sales/activityEdit': {
    path: '/sales/activityEdit',
    name: 'generalEdit',
    component: () => import('@/views/sales/sop/components/activityAdd'),
    hidden: true,
    meta: { title: '修改群发活动SOP' }
  },
  '/sales/regularAdd': {
    path: '/sales/regularAdd',
    name: 'regularAdd',
    component: () => import('@/views/sales/sop/components/regularAdd'),
    hidden: true,
    meta: { title: '新增定时提醒SOP' }
  },
  '/sales/regularEdit': {
    path: '/sales/regularEdit',
    name: 'regularEdit',
    component: () => import('@/views/sales/sop/components/regularAdd'),
    hidden: true,
    meta: { title: '修改定时提醒SOP' }
  },
  '/sales/friendAdd': {
    path: '/sales/friendAdd',
    name: 'friendAdd',
    component: () => import('@/views/sales/sop/components/friendAdd'),
    hidden: true,
    meta: { title: '新增好友SOP' }
  },
  '/sales/friendEdit': {
    path: '/sales/friendEdit',
    name: 'friendEdit',
    component: () => import('@/views/sales/sop/components/friendAdd'),
    hidden: true,
    meta: { title: '修改好友SOP' }
  },
  '/sales/birthdayAdd': {
    path: '/sales/birthdayAdd',
    name: 'birthdayAdd',
    component: () => import('@/views/sales/sop/components/birthdayAdd'),
    hidden: true,
    meta: { title: '新增生日SOP' }
  },
  '/sales/birthdayEdit': {
    path: '/sales/birthdayEdit',
    name: 'birthdayEdit',
    component: () => import('@/views/sales/sop/components/birthdayAdd'),
    hidden: true,
    meta: { title: '修改生日SOP' }
  },
  '/sales/clusterAdd': {
    path: '/sales/clusterAdd',
    name: 'clusterAdd',
    component: () => import('@/views/sales/sop/components/clusterAdd'),
    hidden: true,
    meta: { title: '新增群SOP' }
  },
  '/sales/clusterEdit': {
    path: '/sales/clusterEdit',
    name: 'clusterEdit',
    component: () => import('@/views/sales/sop/components/clusterAdd'),
    hidden: true,
    meta: { title: '修改群SOP' }
  },
  // '/salesManagement/userSop': {
  //   path: '/salesManagement/userSop',
  //   name: 'userSop',
  //   component: () => import('@/views/salesManagement/userSop'),
  //   meta: { title: '客户SOP' }
  // },
  '/salesManagement/addSop': {
    path: '/salesManagement/addSop',
    name: 'addSop',
    hidden: true,
    component: () => import('@/views/salesManagement/addSop'),
    meta: { title: '创建SOP' }
  },
  '/salesManagement/editSop': {
    path: '/salesManagement/editSop',
    name: 'editSop',
    hidden: true,
    component: () => import('@/views/salesManagement/addSop'),
    meta: { title: '编辑SOP' }
  },
  // 风险预警
  '/riskEarlyWarning/warningRule': {
    path: '/riskEarlyWarning/warningRule',
    name: 'warningRule',
    component: () => import('@/views/riskEarlyWarning/index'),
    meta: { title: '预警规则' }
  },
  '/riskEarlyWarning/creatingWarningRule': {
    path: '/riskEarlyWarning/creatingWarningRule',
    hidden: true,
    name: 'creatingWarningRule',
    component: () => import('@/views/riskEarlyWarning/creatingWarningRule'),
    meta: { title: '新建预警策略' }
  },
  '/riskEarlyWarning/scoringTemplate': {
    path: '/riskEarlyWarning/scoringTemplate',
    name: 'scoringTemplate',
    component: () => import('@/views/riskEarlyWarning/scoringTemplate'),
    meta: { title: '评分模型' }
  },
  '/riskEarlyWarning/creatingScoringTemplate': {
    path: '/riskEarlyWarning/creatingScoringTemplate',
    hidden: true,
    name: 'creatingScoringTemplate',
    component: () => import('@/views/riskEarlyWarning/creatingScoringTemplate'),
    meta: { title: '新建评分模型' }
  },
  // 商城-商品库
  '/mall/goods': {
    path: '/mall/goods',
    name: '商品库',
    component: () => import('@/views/mall/goods/index'),
    meta: { title: '商品库' }
  },
  // 商城-联合用药
  '/mall/combination': {
    path: '/mall/combination',
    name: '联合用药',
    component: () => import('@/views/mall/combination/index'),
    meta: { title: '联合用药' }
  },
  // 客户跟进-公司话术
  '/speechcraft/company': {
    path: '/speechcraft/company',
    name: 'companySpeechcraft',
    component: () => import('@/views/speechcraft/company/index'),
    meta: { title: '公司话术' }
  },
  // 客户跟进-部门话术
  '/speechcraft/department': {
    path: '/speechcraft/department',
    name: 'departmentSpeechcraft',
    component: () => import('@/views/speechcraft/department/index'),
    meta: { title: '部门话术' }
  },
  // 客户跟进-个人话术
  '/speechcraft/individual': {
    path: '/speechcraft/individual',
    name: 'individualSpeechcraft',
    component: () => import('@/views/speechcraft/individual/index'),
    meta: { title: '个人话术' }
  },
  // 随访管理-已用随访方案
  '/healthManage/currentProgramme': {
    path: '/healthManage/currentProgramme',
    name: 'currentProgrammeHealthManage',
    component: () => import('@/views/healthManage/currentProgramme/index'),
    meta: { title: '已用随访方案' }
  },
  // 随访管理-已用随访方案详情
  '/healthManage/currentProgrammeDetail': {
    path: '/healthManage/currentProgrammeDetail',
    name: 'currentProgrammeDetailHealthManage',
    hidden: true,
    component: () => import('@/views/healthManage/currentProgramme/detail'),
    meta: { title: '方案详情' }
  },
  // 随访管理-随访方案库 - 模板方案详情
  '/healthManage/allProgrammeDetail': {
    path: '/healthManage/allProgrammeDetail',
    name: 'allProgrammeDetailHealthManage',
    hidden: true,
    component: () => import('@/views/healthManage/allProgramme/detail'),
    meta: { title: '模板方案详情' }
  },
  // 随访管理-随访方案库
  '/healthManage/allProgramme': {
    path: '/healthManage/allProgramme',
    name: 'allProgrammeHealthManage',
    component: () => import('@/views/healthManage/allProgramme/index'),
    meta: { title: '随访方案库' }
  },
  // 添加随访方案
  '/healthManage/addProgramme': {
    path: '/healthManage/addProgramme',
    name: 'addProgrammeHealthManage',
    hidden: true,
    component: () => import('@/views/healthManage/addProgramme/index'),
    meta: { title: '随访方案库' }
  },
  // 知识库
  '/healthManage/knowledgeBase': {
    path: '/healthManage/knowledgeBase',
    name: 'knowledgeBaseHealthManage',
    component: () => import('@/views/healthManage/knowledgeBase/index'),
    meta: { title: '知识库' }
  },
  // 患者详情
  '/healthManage/patientDetails': {
    path: '/healthManage/patientDetails',
    name: 'patientDetailsHealthManage',
    hidden: true,
    component: () => import('@/views/healthManage/patientDetails/index'),
    meta: { title: '患者详情' }
  },
  // 患者详情
  '/healthManage/patientDetails1': {
    path: '/healthManage/patientDetails1',
    name: 'patientDetailsHealthManage1',
    hidden: true,
    component: () => import('@/views/healthManage/patientDetails/index'),
    meta: { title: '患者详情' }
  },
  // 随访统计
  '/healthManage/statistics': {
    path: '/healthManage/statistics',
    name: 'statisticsHealthManage',
    component: () => import('@/views/healthManage/statistics/index'),
    meta: { title: '问卷统计' }
  },
  '/templateLibrary/messageNotice': {
    path: '/templateLibrary/messageNotice',
    name: 'messageNotice',
    component: () => import('@/views/templateLibrary/messageNotice'),
    meta: { title: '消息通知模板' }
  },
  '/templateLibrary/createNotice': {
    path: '/templateLibrary/createNotice',
    name: 'createNotice',
    hidden: true,
    component: () => import('@/views/templateLibrary/createNotice'),
    meta: { title: '设置通知模板' }
  },
  '/lossingCustomer/index': {
    path: '/lossingCustomer/index',
    name: '流失客户',
    component: () => import('@/views/lossingCustomer/index'),
    meta: { title: '流失客户' }
  },
  '/lossAnalysis/index': {
    path: '/lossAnalysis/index',
    name: '流失分析',
    component: () => import('@/views/lossAnalysis/index'),
    meta: { title: '流失分析' }
  }
}
