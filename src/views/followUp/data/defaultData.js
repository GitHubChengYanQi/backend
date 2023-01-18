export const defaultSearchObj = {
  planId: [],
  planStatus: '',
  planType: '',
  reportIndex: '7',
  reportTrack: []
}
export const defaultSearchObj2 = {
  planids: [],
  range1: 'organids',
  range2: [],
  status: '-1',
  reporttype: '7',
  reportTrack: []
}

export const shemeStatusSelectOptions = [
  {
    label: '待启用',
    value: '0'
  },
  {
    label: '执行中',
    value: '1'
  },
  {
    label: '已删除',
    value: '2'
  }
]

export const shemeClassifySelectOptions = [
  {
    label: '全部',
    value: '0'
  },
  {
    label: '待启用',
    value: '1'
  },
  {
    label: '执行中',
    value: '2'
  },
  {
    label: '已删除',
    value: '3'
  }
]

export const tableColunms1 = [
  {
    title: '时间',
    width: 120,
    dataIndex: 'planOccur',
    align: 'center'
  },
  {
    title: '随访方案名称',
    align: 'center',
    dataIndex: 'planName',
    scopedSlots: { customRender: 'planName' }
  },
  {
    slots: { title: 'fateEmployee' },
    width: 150,
    align: 'center',
    dataIndex: 'fateEmployee'
  },
  {
    title: '使用方案用户数',
    width: 150,
    align: 'center',
    dataIndex: 'fateContact'
  },
  {
    title: '方案使用次数',
    width: 150,
    align: 'center',
    dataIndex: 'fateTogether'
  },
  {
    title: '方案预警次数',
    width: 150,
    align: 'center',
    dataIndex: 'fateWarning'
  },
  {
    title: '方案完成次数',
    width: 150,
    align: 'center',
    dataIndex: 'fateComplete'
  }
]

export const tableColunms2 = [
  {
    title: '时间',
    width: 120,
    dataIndex: 'day',
    align: 'center'
  },
  {
    slots: { title: 'customName2' },
    width: 120,
    dataIndex: 'name',
    align: 'center',
    scopedSlots: { customRender: 'name' }
  },
  {
    slots: { title: 'customName' },
    width: 120,
    dataIndex: 'num',
    align: 'center'
  },
  {
    title: '任务发送数',
    width: 120,
    dataIndex: 'num_send',
    align: 'center'
  },
  {
    title: '超时发送数',
    width: 120,
    dataIndex: 'num_expsend',
    align: 'center'
  },
  {
    title: '任务发送率',
    width: 120,
    dataIndex: 'send_per',
    align: 'center'
  },
  {
    title: '任务完成率',
    width: 120,
    dataIndex: 'finish_per',
    align: 'center'
  },
  {
    title: '随访用户数',
    width: 120,
    dataIndex: 'num_join',
    align: 'center'
  },
  {
    title: '随访用户比例',
    width: 120,
    dataIndex: 'join_per',
    align: 'center'
  },
  {
    title: '预警次数',
    width: 120,
    dataIndex: 'num_warn',
    align: 'center'
  },
  {
    title: '预警次数占比',
    width: 120,
    dataIndex: 'warn_per',
    align: 'center'
  }
]

export const schemeRange1SelectOptions = [
  {
    label: '机构',
    value: 'pieAgency'
  },
  {
    label: '门店',
    value: 'pieOutlet'
  },
  {
    label: '员工',
    value: 'pieEmployee'
  }
]

export const taskRange1SelectOptions = [
  {
    label: '机构',
    value: 'organids'
  },
  {
    label: '门店',
    value: 'shopids'
  },
  {
    label: '员工',
    value: 'empids'
  }
]

export const taskStatusSelectOptions = [
  {
    label: '全部',
    value: '-1'
  },
  {
    label: '未开始',
    value: '0'
  },
  {
    label: '进行中',
    value: '2'
  },
  {
    label: '已完成',
    value: '3'
  },
  {
    label: '已过期',
    value: '4'
  }
]

export const fixTaskSearchObj = obj => {
  if (!obj.tasktab) {
    obj.tasktab = '1'
  }
  if (!obj.taskpertab) {
    obj.taskpertab = '1'
  }
  if (!obj.tasktype) {
    obj.tasktype = '1'
  }
  if (!obj.targetdata) {
    obj.targetdata = '1'
  }
  if (obj.organids) {
    obj.organids = obj.organids.map(it => it.value).join(',')
  }
  if (obj.shopids) {
    obj.shopids = obj.shopids.map(it => it.value).join(',')
  }
  if (obj.empids) {
    obj.empids = obj.empids.join(',')
  }
  return obj
}

export const generatorChartsData = res => {
  res.tasksendChart1 = [
    ['发送数', res.tasksend_reports.sendinfo.num],
    ['', res.tasksend_reports.totalnum - res.tasksend_reports.sendinfo.num]
  ]
  res.tasksendChart2 = [
    ['超时发送数', res.tasksend_reports.expsendinfo.num],
    ['', res.tasksend_reports.totalnum - res.tasksend_reports.expsendinfo.num]
  ]
  res.tasksendChart3 = [
    ['未发送数', res.tasksend_reports.unsendinfo.num],
    ['', res.tasksend_reports.totalnum - res.tasksend_reports.unsendinfo.num]
  ]
  res.tasktab_reports.chartData = [
    ['问卷', res.tasktab_reports.answerper],
    ['患教', res.tasktab_reports.patientper],
    ['嘱托', res.tasktab_reports.careper]
  ]
  return res
}
