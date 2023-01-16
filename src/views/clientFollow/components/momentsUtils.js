import moment from 'moment'

export const defaultLinkObj = {
  title: '',
  url: '',
  desc: '',
  pic: {}
}
export const defaultLibraryObj = {
  temporaryStroageArr: [],
  selectArr: []
}
// 是否为一个地址
export const isUrl = (val) => {
  // eslint-disable-next-line no-useless-escape
  const str = /^(http|https):\/\/[\S]+$/
  const reg = new RegExp(str)
  return reg.test(val)
}
// 获取媒体库对应type
export const getLibraryMediaType = (t) => {
  let str = ''
  if (t === 1) {
    str = 'text'
  } else if (t === 2) {
    str = 'photo'
  } else if (t === 5) {
    str = 'video'
  } else if (t === 3) {
    str = 'link'
  }
  return str
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

// 获取正确的媒体数据格式
/*
  to 时 转化请求需要对象，form时，返回需要的结构
*/
export const getMediaData = (reqType, { data = {}, mediaType, photos = [], videoUrl = '', linkObj = {} }) => {
  if (reqType === 'to') {
    let type
    let files
    let link = {}
    if (mediaType === 'photo') {
      type = 1
      files = photos.map((it) => it.path)
    } else if (mediaType === 'video') {
      type = 2
      files = [videoUrl.path]
    } else if (mediaType === 'link') {
      type = 3
      files = [linkObj.pic.path]
      link = {
        web_url: linkObj.url,
        web_title: linkObj.title,
        web_text: linkObj.desc
      }
      if (linkObj.radarLink === '1') {
        link.web_is_radar = '1'
        link.radar_channel_txt = linkObj.radarName
      }
    }
    return JSON.stringify({ type, files, ...link })
  } else if (reqType === 'from') {
    const { type, files = [], ...link } = data
    let isDev = true
    if (files[0]) {
      isDev = files[0].indexOf('https://yfscrm.oss-cn-beijing.aliyuncs.com') !== -1
    }
    const startLen = isDev ? 43 : 44
    let mediaType, mediaData, target
    if (type === 1) {
      mediaType = 'photo'
      target = 'photos'
      mediaData = files.map((it) => ({
        url: it,
        path: it.slice(startLen, it.indexOf('?'))
      }))
    } else if (type === 2) {
      mediaType = 'video'
      target = 'videoUrl'
      const item = files[0]
      mediaData = {
        url: item,
        path: item.slice(startLen, item.indexOf('?'))
      }
    } else if (type === 3) {
      mediaType = 'link'
      target = 'modalLinkObj'
      const item = files[0]
      mediaData = {
        title: link.web_title,
        url: link.web_url,
        desc: link.web_text,
        pic: {
          url: item,
          path: item.slice(startLen, item.indexOf('?'))
        }
      }
      if (link.web_is_radar === '1') {
        mediaData.radarLink = '1'
        mediaData.radarName = link.radar_channel_txt
      }
    }
    return { mediaType, mediaData, target }
  }
}

export const returnLabelJSONData = (labels) => {
  return JSON.stringify(labels.map(({ id, name }) => ({ id, name })))
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
      data: []
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
      data: []
    }
  ]
}

export const returnChartData = (data) => {
  const xName = []; const xData = []
  for (let i = data.length; i--; i >= 0) {
    const item = data[i]
    xName.unshift(item.cday)
    xData.unshift(item.num)
  }
  return { xName, xData }
}

export const generateMediaJSON = (ls) => {

}
