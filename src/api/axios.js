import axios from 'axios'
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'
export const login = (obj) => {
  return axios.post('login', obj)
    .then((result) => {
      return result.data
    })
}
