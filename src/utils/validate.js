
/**
 * 中文、英文、符号
 * 即不包含数字
 */
export function containsNumber (str) {
  var reg = /\d/
  return reg.test(str)
}

/**
 * 只允许0-100之间,且最大保留4位小数
 */
export function checkNumber (str) {
  var reg = /^100$|^(\d|[1-9]\d)(\.\d{1,4})*$/
  return reg.test(str)
}

/**
 * 英文+下划线
 */
export function checkTitle (str) {
  var reg = /^[A-Za-z_]*$/
  return reg.test(str)
}
