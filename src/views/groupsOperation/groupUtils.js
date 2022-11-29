import moment from 'moment'
export const returnLabelJSONData = (labels) => {
  if (!labels.length) return ''
  return JSON.stringify(labels.map(({ id }) => (id)))
}

export const defaultMiniObj = {
  appid: '',
  path: '',
  desc: '',
  pic: {}
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
      name: '新增成员',
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

export const defaultLinkObj = {
  title: '',
  url: '',
  desc: '',
  pic: {}
}
// 是否为一个地址
export const isUrl = (val) => {
  // eslint-disable-next-line no-useless-escape
  const str = /^(http|https):\/\/[\S]+$/
  const reg = new RegExp(str)
  return reg.test(val)
}
export const defaultLibraryObj = {
  temporaryStroageArr: [],
  selectArr: []
}
export function debounce (func, wait, immediate) {
  var timeout, result
  function debounce () {
    var context = this; var args = arguments
    if (timeout) clearTimeout(timeout)
    if (immediate) {
      var callNow = !timeout
      timeout = setTimeout(function () {
        result = func.apply(context, args)
      }, wait)
      if (callNow) result = func.apply(context, args)
    } else {
      timeout = setTimeout(function () {
        result = func.apply(context, args)
      }, wait)
    }
    return result
  }
  debounce.cancel = function () {
    clearTimeout(timeout)
    timeout = null
  }
  return debounce
}

// 获取正确的媒体数据格式
/*
  to 时 转化请求需要对象，form时，返回需要的结构
*/
export const getMediaData = (reqType, data) => {
  if (reqType === 'to') {
    const { content = {}, type } = data
    let t
    let files
    let link = {}
    if (type === 'image') {
      t = 1
      files = [content.path]
    } else if (type === 'embed') {
      t = 4
      files = [content.pic.path]
      link = {
        appid: content.appid,
        app_path: content.path,
        app_text: content.desc
      }
    } else if (type === 'link') {
      t = 3
      files = [content.pic.path]
      link = {
        web_url: content.url,
        web_title: content.title,
        web_text: content.desc
      }
    }
    return JSON.stringify({ type: t, files, ...link })
  } else if (reqType === 'from') {
    const startLen = 43 // 域名长度
    const { type, files, ...link } = data
    let mediaType, mediaData
    if (type === 1) {
      mediaType = 'image'
      mediaData = {
        imgUrl: files[0]
      }
    } else if (type === 3) {
      mediaType = 'link'
      mediaData = {
        title: link.web_title,
        url: link.web_url,
        desc: link.web_text,
        pic: { url: files[0] }
      }
    } else if (type === 4) {
      mediaType = 'embed'
      mediaData = {
        appid: link.appid,
        path: link.app_path,
        desc: link.app_text,
        pic: { url: files[0] }
      }
    }
    return { type: mediaType, content: mediaData }
  }
}

export const trasnfromOptions = (list) => {
  const value = []
  const newL = list.map(it => {
    if (it.checked === '1') {
      value.push(it.id)
    }
    return {
      label: it.sopName,
      value: it.id
    }
  })
  return { list: newL, value }
}
