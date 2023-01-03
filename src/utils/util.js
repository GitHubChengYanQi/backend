export function timeFix () {
  const time = new Date()
  const hour = time.getHours()
  return hour < 9 ? '早上好' : hour <= 11 ? '上午好' : hour <= 13 ? '中午好' : hour < 20 ? '下午好' : '晚上好'
}

export function isIE () {
  const bw = window.navigator.userAgent
  const compare = (s) => bw.indexOf(s) >= 0
  const ie11 = (() => 'ActiveXObject' in window)()
  return compare('MSIE') || ie11
}

export const createValidate = (callback, value, message) => {
  if (!value) {
    return callback(new Error(message))
  } else {
    callback()
  }
}
export const createFunc = (func, change) => {
  return {
    validator: func,
    trigger: change || 'blur'
  }
}

/**
 * 计算字节长度
 * @param {*} str
 */
export function getLength (str) {
  let realLength = 0
  const len = str.length
  let charCode = -1
  for (var i = 0; i < len; i++) {
    charCode = str.charCodeAt(i)
    if (charCode >= 0 && charCode <= 128) {
      realLength += 1
    } else {
      realLength += 3
    }
  }
  return realLength
}

/**
 * 过滤指定字符
 * @param {*} str
 */
export function removeXss (str) {
  str = str.replace(/<\/?[^>]*>/g, '')
  var keyWordArr = [
    'alert',
    'function',
    'href',
    'javascript',
    'onabort',
    'onblur',
    'onchange',
    'onclick',
    'ondblclick',
    'onerror',
    'onfocus',
    'onkeydown',
    'onkeypress',
    'onkeyup',
    'onload',
    'onmousedown',
    'onmousemove',
    'onmouseout',
    'onmouseover',
    'onmouseup',
    'onreset',
    'onresize',
    'onselect',
    'onsubmit',
    'onunload',
    'script',
    'break',
    'window',
    'open',
    'close',
    'status',
    'confirm',
    'prompt',
    'document',
    'action',
    'background',
    'codebase',
    'dynsrc',
    'lowsrc',
    'cookie',
    'var',
    'date',
    'math',
    'new',
    'this',
    'focus'
  ]
  for (var i in keyWordArr) {
    var reg = new RegExp(keyWordArr[i], 'ig')
    str = str.replace(reg, '')
  }
  return str
}

/**
 * @param obj
 * @description 深拷贝
 */
export function deepClone (o1, o2) {
  for (const k in o2) {
    if (typeof o2[k] === 'object') {
      o1[k] = {}
      deepClone(o1[k], o2[k])
    } else {
      o1[k] = o2[k]
    }
  }
}

/**
 * @param {Array | Object} target
 * @return {Array | Object}
 * @description 深拷贝 v2
 */
export const deepClonev2 = (target) => {
  let result
  if (typeof target === 'object') {
    if (Array.isArray(target)) {
      result = []
      for (const item of target) {
        result.push(deepClonev2(item))
      }
    } else if (target === null) {
      result = null
    } else if (target.constructor === RegExp) {
      result = target
    } else {
      result = {}
      for (const i in target) {
        result[i] = deepClonev2(target[i])
      }
    }
  } else {
    result = target
  }
  return result
}

/**
 * 数字转大写
 */
export const toChinesNum = (num) => {
  const changeNum = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'] // changeNum[0] = "零"
  const unit = ['', '十', '百', '千', '万']
  num = parseInt(num)
  const getWan = (temp) => {
    const strArr = temp.toString().split('').reverse()
    let newNum = ''
    for (var i = 0; i < strArr.length; i++) {
      newNum = (i == 0 && strArr[i] == 0 ? '' : (i > 0 && strArr[i] == 0 && strArr[i - 1] == 0 ? '' : changeNum[strArr[i]] + (strArr[i] == 0 ? unit[0] : unit[i]))) + newNum
    }
    return newNum
  }
  const overWan = Math.floor(num / 10000)
  let noWan = num % 10000
  if (noWan.toString().length < 4) noWan = '0' + noWan
  return overWan ? getWan(overWan) + '万' + getWan(noWan) : getWan(num)
}

/**
 * 通过时间戳计算时分秒
 */
export const getTimeDifference = (timeDifference) => {
  // 获取时间戳
  var hour = 60 * 60 * 1000
  // 一小时等于的毫秒数
  var min = 60 * 1000
  // 一秒等于的毫秒数
  var h = parseInt(timeDifference / hour)
  // 获取小时部分
  var m = parseInt(timeDifference % hour / min)
  // 获取分钟部分
  var s = parseInt(timeDifference % min / 1000)
  // 获取秒数
  return `${h < 10 ? '0' + h : h}:${m < 10 ? '0' + m : m}:${s < 10 ? '0' + s : s}`
}
