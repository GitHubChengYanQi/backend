import request from '@/utils/request'

/**
 * 下载blob
 * @param {*} url 地址
 * @param {*} param 请求参数
 * @param {*} fileName  下载文件名
 * @param {*} type  它代表了将会被放入到blob中的数组内容的MIME类型
 */
export async function downLoadBlobByParam (url, param, fileName, type = 'application/vnd.ms-excel') {
  const requestParam = {
    params: param,
    responseType: 'blob'
  }
  const response = await request.get(url, requestParam)
  if (response) {
    const blob = new Blob([response], { type })
    callDownLoadByBlob(blob, fileName)
  } else {
    console.log('下载失败')
  }
  return response
}

/**
 * 下载blob对象
 * @param {*} blob blob对象
 * @param {*} fileName 文件名称
 */
export function callDownLoadByBlob (blob, fileName) {
  const eLink = document.createElement('a')

  eLink.download = fileName
  eLink.style.display = 'none'
  eLink.href = URL.createObjectURL(blob)
  document.body.appendChild(eLink)
  eLink.click()
  URL.revokeObjectURL(eLink.href)
  document.body.removeChild(eLink)
}

export function excelExport (res, name) {
  const blob = new Blob([res])// response.data为后端传的流文件
  const downloadFilename = name// 设置导出的文件名  用moment时间插件对文件命名防止每次都是一样的文件名
  if (window.navigator && window.navigator.msSaveOrOpenBlob) {
    // 兼容ie浏览器
    window.navigator.msSaveOrOpenBlob(blob, downloadFilename)
  } else {
    // 谷歌,火狐等浏览器
    const url = window.URL.createObjectURL(blob)
    const downloadElement = document.createElement('a')
    downloadElement.style.display = 'none'
    downloadElement.href = url
    downloadElement.download = downloadFilename
    document.body.appendChild(downloadElement)
    downloadElement.click()
    document.body.removeChild(downloadElement)
    window.URL.revokeObjectURL(url)
  }
}
