import axios from './index'
import authHeader from '../auth/authHeader'

export default {
  userChangePassword (data) {
    return axios.post(process.env.VUE_APP_API_URL + '/change-password', data, { headers: authHeader(), validateStatus: false })
  },
  userPersonalInfo (data) {
    return axios.post(process.env.VUE_APP_API_URL + '/user-personal-info', data, { headers: authHeader(), validateStatus: false })
  }
}
