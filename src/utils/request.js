import axios from 'axios'
import store from '@/store'
import storage from 'store'
import router from '@/router'
import message from 'ant-design-vue/es/message'
import notification from 'ant-design-vue/es/notification'
import { VueAxios } from './axios'

// 创建 axios 实例
const request = axios.create({
  // API 请求的默认前缀
  baseURL: process.env.VUE_APP_API_BASE_URL,
  timeout: 30000 // 请求超时时间
})

const newRequest = axios.create({
  // API 请求的默认前缀
  baseURL: process.env.VUE_APP_API_BASE_URL,
  timeout: 30000 // 请求超时时间
})

const fileRequest = axios.create({
  // API 请求的默认前缀
  baseURL: process.env.VUE_APP_API_BASE_URL,
  timeout: 30000 // 请求超时时间
})

// 异常拦截处理器
const errorHandler = (error) => {
  if (error.response) {
    const data = error.response.data
    const status = error.response.status
    if (status === 401) {
      message.error(data.msg)
      store.dispatch('Logout').then(() => {
        router.push({ path: '/login' })
      })
    } else if (status === 422 && data.code === 200001) {
      const arr = JSON.parse(JSON.parse(data.msg).txt)
      const id = JSON.parse(data.msg).id
      for (let i = 0; i < arr.length; i++) {
        ;(function (a) {
          setTimeout(() => {
            if (
              router.history.current.path === '/wxCustomer/edit' ||
              router.history.current.path === '/wxCustomer/add'
            ) {
              notification.error({
                key: 'key' + a,
                message: '更新错误',
                description: arr[a],
                // duration: null,
                placement: 'bottomRight',
                bottom: '50px'
              })
            } else {
              notification.error({
                key: 'key' + a,
                message: '更新错误',
                description: arr[a],
                // duration: null,
                placement: 'bottomRight',
                bottom: '50px',
                btn: (h) => {
                  return h(
                    'a-button',
                    {
                      props: {
                        type: 'primary',
                        size: 'small'
                      },
                      on: {
                        click: () => {
                          router.push({
                            path: '/wxCustomer/edit',
                            query: {
                              id
                            }
                          })
                        }
                      }
                    },
                    '编辑'
                  )
                }
              })
            }
          }, 400 * i)
        })(i)
      }
    } else {
      console.log(data, '请求')
      if (data.type === 'application/json') {
      } else {
        message.error(`${data.msg || 'error'}`)
      }
    }
  } else {
    message.error(error.message || '请求出错，请稍后重试！')
  }
  return Promise.reject(error)
}
const requestInterceptor = (config) => {
  const token = storage.get('ACCESS_TOKEN')
  // 如果 token 存在
  // 让每个请求携带自定义 token 请根据实际情况自行修改
  if (token) {
    config.headers['Accept'] = `application/json`
    config.headers.Authorization = token
  }
  return config
}
// request interceptor
request.interceptors.request.use(requestInterceptor, errorHandler)

// response interceptor
request.interceptors.response.use((response) => {
  // 内部code为200为通过，否则其余都是错误code
  if (response.data.code && response.data.code !== 200) {
    errorHandler({ response })
    return Promise.reject(response.data.msg)
  }
  return response.data
}, errorHandler)

newRequest.interceptors.request.use(requestInterceptor, errorHandler)
// response interceptor
newRequest.interceptors.response.use((response) => {
  return response.data
}, errorHandler)

fileRequest.interceptors.request.use(requestInterceptor, errorHandler)
// response interceptor
fileRequest.interceptors.response.use((response) => {
  return response.data
  // const filename = sessionStorage.getItem('fileName') + '.' + (response.headers['content-disposition']).split('.')[1]
  // sessionStorage.removeItem('fileName')
  // const blob = new Blob([response.data], {
  //   type: 'application/octet-stream'
  // })
  // // 将blob对象转为一个URL
  // var blobURL = window.URL.createObjectURL(blob)
  // // 创建一个a标签
  // var tempLink = document.createElement('a')
  // // 隐藏a标签
  // tempLink.style.display = 'none'
  // // 设置a标签的href属性为blob对象转化的URL
  // tempLink.href = blobURL
  // // 给a标签添加下载属性
  // tempLink.setAttribute('download', filename)
  // if (typeof tempLink.download === 'undefined') {
  //   tempLink.setAttribute('target', '_blank')
  // }
  // // 将a标签添加到body当中
  // document.body.appendChild(tempLink)
  // // 启动下载
  // tempLink.click()
  // // 下载完毕删除a标签
  // document.body.removeChild(tempLink)
  // window.URL.revokeObjectURL(blobURL)
  // message.success('导出成功~')
}, errorHandler)

const installer = {
  vm: {},
  install (Vue) {
    Vue.use(VueAxios, request)
  }
}

export default request

export { installer as VueAxios, request as axios, newRequest, fileRequest }
