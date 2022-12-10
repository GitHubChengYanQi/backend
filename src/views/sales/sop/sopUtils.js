export const defaultLinkObj = {
  title: '',
  url: '',
  desc: '',
  pic: ''
}

export const defaultMiniObj = {
  appid: '',
  path: '',
  desc: '',
  pic: ''
}

export const defaultLibraryObj = {
  temporaryStroageArr: [],
  selectArr: []
}

export const include1TypeSelectOptions = [
  {
    value: 'AllIn',
    label: '包含所有'
  },
  {
    value: 'In',
    label: '包含'
  },
  {
    value: 'NotIn',
    label: '不包含'
  },
  {
    value: 'IsNull',
    label: '为空'
  },
  {
    value: 'IsNotNull',
    label: '不为空'
  }
]

export const include2TypeSelectOptions = [
  {
    value: 'In',
    label: '包含'
  },
  {
    value: 'NotIn',
    label: '不包含'
  },
  {
    value: 'IsNull',
    label: '为空'
  },
  {
    value: 'IsNotNull',
    label: '不为空'
  }
]
// 1.未跟进 2.跟进中 3.已拒绝 4.已成交 5.已复购
export const include2TargetSelectOptions = [
  {
    value: '1',
    label: '未跟进'
  },
  {
    value: '2',
    label: '跟进中'
  },
  {
    value: '3',
    label: '已拒绝'
  },
  {
    value: '4',
    label: '已成交'
  },
  {
    value: '5',
    label: '已复购'
  }
]

export const handleBtnArr = [
  {
    name: '文本',
    type: 'text'
  },
  {
    name: '图片',
    type: 'image'
  },
  {
    name: '视频',
    type: 'video'
  },
  {
    name: '链接',
    type: 'link'
  },
  {
    name: '素材库',
    type: 'library'
  },
  {
    name: '互动雷达',
    type: 'radar'
  },
  {
    name: '小程序',
    type: 'embed'
  }
]

// 当前时间再延迟 N 分钟
const SEND_TASK_MIN_MINS = 3
export const getNowDate = (type) => {
  const date = new Date()
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  let day = date.getDate()
  let hour = date.getHours()
  let minute = date.getMinutes()

  minute = minute + SEND_TASK_MIN_MINS
  if (minute > 60) {
    minute -= 60
    hour += 1
    if (hour > 24) {
      hour -= 24
      day += 1
    }
  }

  hour = hour < 10 ? '0' + hour : hour
  minute = minute < 10 ? '0' + minute : minute

  if (!type) {
    return `${year}-${month}-${day} ${hour}:${minute}`
  } else if (type === 'hours') {
    return `${hour}:${minute}`
  }
}
// 是否为一个地址
export const isUrl = (val) => {
  // eslint-disable-next-line no-useless-escape
  const str = /^(http|https):\/\/[\S]+$/
  const reg = new RegExp(str)
  return reg.test(val)
}
// 返回一个数字范围
export const numRange = (start, end) => {
  const result = []
  for (let i = start; i < end; i++) {
    result.push(i)
  }
  return result
}
// 生成接口需要的type
export const generaType = (type) => {
  if (type === '0') {
    return 'General'
  } else if (type === '1') {
    return 'Activity'
  } else if (type === '2') {
    return 'Regular'
  } else if (type === '3') {
    return 'Friend'
  } else if (type === '4') {
    return 'Birthday'
  } else if (type === '5') {
    return 'Cluster'
  }
}
// 转换任务列表的值
export const transformTaskItemEntry = (data, type = 'to') => {
  return data.map((it) => {
    const obj = { type: it.type }
    if (it.type === 'text') {
      if (type === 'to') {
        obj.textData = it.content
      } else {
        obj.content = it.textData
      }
    } else if (it.type === 'image' || it.type === 'video') {
      if (type === 'to') {
        obj.mediaId = it.content
      } else {
        obj.content = it.mediaId
      }
    } else if (it.type === 'link') {
      if (type === 'to') {
        obj.linkTitle = it.content.title
        obj.linkAddress = it.content.url
        obj.linkDescribe = it.content.desc
        obj.linkFace = it.content.pic
      } else {
        obj.content = {
          title: it.linkTitle,
          url: it.linkAddress,
          desc: it.linkDescribe,
          pic: it.linkFace
        }
      }
    } else if (it.type === 'embed') {
      if (type === 'to') {
        obj.embedId = it.content.appid
        obj.embedPath = it.content.path
        obj.embedDescribe = it.content.desc
        obj.embedFace = it.content.pic
      } else {
        obj.content = {
          appid: it.embedId,
          path: it.embedPath,
          desc: it.embedDescribe,
          pic: it.embedFace
        }
      }
    }
    return obj
  })
}
// 返回需要被禁止的时间 date-picker为Boolean time-picker为Array
export const disabledBeforeDate = (e = null, type) => {
  const date = new Date()
  let arr = []
  if (type === 'date') {
    return e.valueOf() < date.valueOf()
  } else if (type === 'hour') {
    const hour = date.getHours()
    arr = numRange(0, 24).splice(0, hour)
  } else if (type === 'time') {
    // isToday-判断是否为当天 是，就进行disabled，否则不进行处理
    const nowTime = e.valueOf()
    const nowDate = new Date(new Date().toLocaleDateString()).getTime()
    const dateTime = 1000 * 60 * 60 * 24
    const isToday = dateTime - Math.abs(nowTime - nowDate) > 0

    const hour = date.getHours()
    const minute = date.getMinutes() + SEND_TASK_MIN_MINS
    const nowHour = new Date(nowTime).getHours()
    return (
      isToday && {
        disabledHours: () => numRange(0, 24).splice(0, hour),
        disabledMinutes: () => (nowHour === hour ? numRange(0, 60).splice(0, minute > 60 ? 60 : minute) : [])
      }
    )
    // const hour = date.getHours()
    // arr = numRange(0, 24).splice(0, hour)
  } else if (type === 'minute') {
    if (e === date.getHours()) {
      const minute = date.getMinutes() + SEND_TASK_MIN_MINS
      arr = numRange(0, 59).splice(0, minute > 60 ? 60 : minute)
    }
  }
  return arr
}

// 生成date title
export const generateDateTitle = (item, pageType) => {
  let title = ''
  if (['0', '1', '5'].includes(pageType)) {
    title = item.date
  } else if (['2', '3'].includes(pageType)) {
    if (item.dateArr) {
      if (item.dateType === 1) {
        const [hour, min] = item.dateArr[0]
        title = `当天${hour}小时${min}分钟后送达`
      } else {
        const [day, time] = item.dateArr[1]
        title = `第${day}天${time}发送`
      }
    }
  } else {
    const dateTypeTxt = item.dateType === '1' ? '生日当天' : item.dateType === '2' ? '生日提前' : '生日过后'
    title = `${dateTypeTxt}${item.dateType === '1' ? '' : item.date + '天'} ${item.time}发送`
  }
  return title
}

// 返回页面的title
export const returnPageTitle = (typeTxt, type) => {
  switch (type) {
    case '0':
      document.title = `${typeTxt}群发助手SOP`
      break
    case '1':
      document.title = `${typeTxt}群发活动SOP`
      break
    case '2':
      document.title = `${typeTxt}定期提醒SOP`
      break
    case '3':
      document.title = `${typeTxt}新增好友SOP`
      break
    case '4':
      document.title = `${typeTxt}生日SOP`
      break
    case '5':
      document.title = `${typeTxt}群SOP`
      break
    default:
      document.title = `${typeTxt}SOP`
      break
  }
}

// 转换SOP详情的值
export const transformTargetData = (pageType, data, type = 'to') => {
  if (type === 'to') {
    let target = []
    if (pageType === '0') {
      if (data.selectUserType !== 1) return target
      target = [
        {
          relate: true,
          operate: 'In',
          labelObjs: data.selectTagList
        }
      ]
    } else if (['1', '2', '4'].includes(pageType)) {
      if (data.selectUserType !== 1) return target
      const relate = data.filterUserObj.mode === '1'
      target = data.filterUserObj.list.map((item) => {
        const obj = {
          relate,
          operate: item.include,
          targetType: item.type
        }
        // 标签
        if (item.type === '1') {
          obj.labelObjs = item.target || []
        } else {
          // obj.followUpStatus = item.target ? item.target.join(',') : ''
          if (pageType === '2') {
            obj.followUpStatus = item.target ? item.target.join(',') : ''
          } else {
            obj.followUpStatus = item.target || ''
          }
        }
        return obj
      })
    }
    return target
  } else {
    if (pageType === '0') {
      return { labelObjs: data.length ? data[0].labelObjs : [] }
    } else if (['1', '2', '4'].includes(pageType)) {
      const obj = {}
      if (pageType === '1') {
        obj.mode = '1'
      } else {
        obj.mode = data[0].relate ? '1' : '2'
      }
      obj.list = data.map((item) => ({
        type: item.targetType,
        include: item.operate,
        target: item.targetType === '2' ? (item.followUpStatus ? item.followUpStatus.split(',') : []) : item.labelObjs
      }))
      return obj
    }
  }
}

export const transformTaskDate = (pageType, data, type = 'to') => {
  if (['0', '1', '5'].includes(pageType)) {
    return type === 'to' ? data.date : data.occur
  } else if (['2', '3'].includes(pageType)) {
    if (type === 'to') {
      // eslint-disable-next-line prefer-const
      let [day, times] = data.dateArr[data.dateType - 1]
      if (data.dateType === 1) {
        if (times < 10) {
          times = '0' + times
        }
        times = '00:' + times
      }
      return `${day}D${times}`
    } else {
      const dateArr = [
        [0, 2],
        [1, getNowDate('hours')]
      ]
      // eslint-disable-next-line prefer-const
      let [day, times] = data.occur.split('D')
      let dateType = 2
      if (+day === 0) {
        times = +times.split(':')[1]
        dateType = 1
      }
      dateArr[dateType - 1] = [day, times]
      return { dateArr, dateType }
    }
  } else {
    // 生日SOP
    if (type === 'to') {
      let day = 0
      if (data.dateType === '2') {
        day = '-' + data.date
      } else if (data.dateType === '3') {
        day = data.date
      }
      return `${day}D${data.time}`
    } else {
      const defaultObj = {
        dateType: '1',
        date: 1,
        time: getNowDate('hours')
      }
      const [day, time] = data.occur.split('D')
      if (+day < 0) {
        defaultObj.dateType = '2'
        defaultObj.date = Math.abs(day)
      } else if (+day > 0) {
        defaultObj.dateType = '3'
        defaultObj.date = Math.abs(day)
      }
      defaultObj.time = time
      return defaultObj
    }
  }
}

// 转换素材库内选中的值
export const transformLibraryData = (item) => {
  let generateObj = {}
  if (item.type_id === 1) {
    // 文本
    generateObj = {
      type: 'text',
      data: item.content.content
    }
  } else if (item.type_id === 2) {
    generateObj = {
      type: 'image',
      data: {
        imgUrl: item.content.imageFullPath,
        mediaName: item.content.imageName
      }
    }
  } else if (item.type_id === 5) {
    generateObj = {
      type: 'video',
      data: {
        videoUrl: item.content.videoFullPath,
        mediaName: item.content.videoName
      }
    }
  } else if (item.type_id === 3) {
    generateObj = {
      type: 'link',
      data: {
        desc: item.content.description,
        pic: item.content.imageFullPath,
        title: item.content.maintitle,
        url: item.content.imageLink
      }
    }
  } else if (item.type_id === 6) {
    generateObj = {
      type: 'embed',
      data: {
        desc: item.content.title,
        appid: item.content.appid,
        path: item.content.page,
        pic: item.content.imageFullPath
      }
    }
  }
  return generateObj
}
