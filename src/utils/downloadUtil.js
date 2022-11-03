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
