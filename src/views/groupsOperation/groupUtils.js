import moment from 'moment'
export const returnLabelJSONData = (labels) => {
  return JSON.stringify(labels.map(({ id, name }) => ({ id, name })))
}

// 返回一个数字范围
export const numRange = (start, end) => {
  const result = []
  for (let i = start; i < end; i++) {
    result.push(i)
  }
  return result
}

// 返回需要被禁止的时间 date-picker为Boolean time-picker为Array
export const disabledBeforeDate = (e = null, type, isBack = false) => {
  const date = new Date()
  if (!e) return false
  if (type === 'date') {
    const now = moment().startOf('day').valueOf()
    if (isBack) {
      return e.valueOf() > moment().add(1, 'days').startOf('day')
    } else {
      return e.valueOf() < now
    }
  } else if (type === 'time') {
    // isToday-判断是否为当天 是，就进行disabled，否则不进行处理
    const nowTime = e.valueOf()
    const nowDate = new Date(new Date().toLocaleDateString()).getTime()
    const dateTime = 1000 * 60 * 60 * 24
    const isToday = dateTime - Math.abs(nowTime - nowDate) > 0

    const hour = date.getHours()
    const minute = date.getMinutes()
    const nowHour = new Date(nowTime).getHours()
    if (isBack) {
    } else {
      return (
        isToday && {
          disabledHours: () => numRange(0, 24).splice(0, hour),
          disabledMinutes: () => (nowHour === hour ? numRange(0, 60).splice(0, minute > 60 ? 60 : minute) : [])
        }
      )
    }
  }
}

export const searchDateItemRanges = {
  今天: [moment().startOf('day'), moment().endOf('day')],
  昨天: [moment().add(-1, 'days').startOf('day'), moment().add(-1, 'days').endOf('day')],
  最近七天: [moment().add(-6, 'days').startOf('day'), moment().endOf('day')],
  最近一个月: [moment().add(-1, 'months'), moment()],
  最近三个月: [moment().add(-3, 'months'), moment()],
  最近一年: [moment().add(-1, 'years'), moment()]
}

export const chartDefaultOptions = {
  dataZoom: {
    type: 'inside',
    show: true,
    start: 0,
    end: 100
  },
  tooltip: {
    trigger: 'axis'
  },
  toolbox: {
    feature: {
      saveAsImage: {}
    }
  },
  xAxis: [
    {
      type: 'category',
      boundaryGap: false,
      data: ['11-21', '3:1']
    }
  ],
  yAxis: [
    {
      type: 'value'
    }
  ],
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  series: [
    {
      name: '朋友圈发表量',
      type: 'line',
      lineStyle: {
        color: 'rgb(43 111 253)'
      },
      itemStyle: {
        color: 'rgb(43 111 253)'
      },
      data: [12, 10]
    }
  ]
}

export const returnChartData = (data) => {
  const xName = []
  const xData = []
  for (let i = data.length; i--; i >= 0) {
    const item = data[i]
    xName.unshift(item.cday)
    xData.unshift(item.num)
  }
  return { xName, xData }
}
