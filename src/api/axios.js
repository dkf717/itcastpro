import axios from 'axios'
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么?获取token,传递
  // 1.获取token
  var token = localStorage.getItem('itcastpro_key')
  if (token) {
    // 2.在发送请求的时候传递token
    config.headers['Authorization'] = token
  }
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})
export const postaxios = (url, obj) => {
  return axios.post(url, obj)
    .then((result) => {
      return result
    })
}
export const getaxios = (url, obj) => {
  return axios.get(url, obj)
    .then((result) => {
      return result
    })
}
export const putaxios = (url, obj) => {
  return axios.put(url, obj)
    .then((result) => {
      return result
    })
}
export const deleteaxios = (url, obj) => {
  return axios.delete(url, obj)
    .then((result) => {
      return result
    })
}
