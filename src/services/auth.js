import axios from './index'
import authHeader from '../auth/authHeader'

export default {
  login (userData) {
    return axios.post(process.env.VUE_APP_API_URL + '/login', userData, { headers: authHeader(), validateStatus: false })
  },
  register (userData) {
    return axios.post('/api/register', userData)
  },
  logout () {
    return axios.post(process.env.VUE_APP_API_URL + '/logout', {}, { headers: authHeader(), validateStatus: false })
  }
}
