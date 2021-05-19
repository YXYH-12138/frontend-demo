import axios from 'axios'
// import token from "@/utils/token"
// import { Message } from "element-ui"

const instance = axios.create({
  // baseURL: '/api'
  baseURL: 'http://121.40.117.96:6509'
  // baseURL: 'http://192.168.0.108:8080'
})

const request = config => {
  // config.headers.Authorization = token.getToken()
  if (config.method === 'post' && !config.data) {
    config.data = {}
  }
  return config
}

const response = response => {
  // const code = response.data.code
  // if (code === 401) {
  //   token.clearToken()
  //   const { hash, href } = window.location
  //   if (!href.includes('redirect')) {
  //     Message.warning('登录已失效')
  //     window.location.href = `#/login?redirect=${hash.substring(1)}`
  //   }
  // }
  return response.data
}

instance.interceptors.request.use(request, error => {
  return Promise.reject(error)
})

instance.interceptors.response.use(response, error => {
  return Promise.reject(error)
})

export default instance
