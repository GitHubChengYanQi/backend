export const defaultSearchObj = {
  planId: [],
  planStatus: '',
  planType: '',
  reportIndex: '7',
  reportTrack: []
}
export const defaultSearchObj2 = {
  planId: [],
  range1: '1',
  range2: [],
  status: '0',
  reportIndex: '7',
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
    dataIndex: 'date',
    align: 'center'
  },
  {
    title: '随访方案名称',
    width: 150,
    align: 'center',
    dataIndex: 'ownerName',
    scopedSlots: { customRender: 'name' }
  },
  {
    slots: { title: 'customName' },
    width: 120,
    align: 'center',
    dataIndex: 'departName'
  },
  {
    title: '使用方案用户数',
    width: 120,
    align: 'center',
    dataIndex: 'parentDepart'
  },
  {
    title: '方案使用次数',
    width: 180,
    align: 'center',
    dataIndex: 'createTime'
  },
  {
    title: '方案预警次数',
    width: 200,
    align: 'center',
    dataIndex: 'tagList'
  },
  {
    title: '方案完成次数',
    width: 120,
    align: 'center',
    dataIndex: 'memberNum'
  }
]

export const tableColunms2 = [
  {
    title: '时间',
    width: 120,
    dataIndex: 'date',
    align: 'center'
  },
  {
    title: '片区名称',
    width: 120,
    dataIndex: 'ownerName',
    align: 'center',
    scopedSlots: { customRender: 'name' }
  },
  {
    slots: { title: 'customName' },
    width: 120,
    dataIndex: 'date',
    align: 'center'
  },
  {
    title: '任务发送数',
    width: 120,
    dataIndex: 'date',
    align: 'center'
  },
  {
    title: '超时发送数',
    width: 120,
    dataIndex: 'date',
    align: 'center'
  },
  {
    title: '任务发送率',
    width: 120,
    dataIndex: 'date',
    align: 'center'
  },
  {
    title: '任务完成率',
    width: 120,
    dataIndex: 'date',
    align: 'center'
  },
  {
    title: '随访用户数',
    width: 120,
    dataIndex: 'date',
    align: 'center'
  },
  {
    title: '随访用户比例',
    width: 120,
    dataIndex: 'date',
    align: 'center'
  },
  {
    title: '预警次数',
    width: 120,
    dataIndex: 'date',
    align: 'center'
  }
]

export const taskRange1SelectOptions = [
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

export const taskStatusSelectOptions = [
  {
    label: '全部',
    value: '0'
  },
  {
    label: '未开始',
    value: '1'
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
