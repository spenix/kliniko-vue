import axios from './index'
import authHeader from '../auth/authHeader'

export default {
  getAllUsers (data) {
    return axios.get(process.env.VUE_APP_API_URL + '/users?patient_id=' + data?.patient_id, { headers: authHeader(), validateStatus: false })
  },
  getAllUserList (data) {
    return axios.get(process.env.VUE_APP_API_URL + `/users-by-paginations?${data}`, { headers: authHeader(), validateStatus: false })
  },
  createUser (data) {
    return axios.post(process.env.VUE_APP_API_URL + '/users', data, { headers: authHeader(), validateStatus: false })
  },
  updateUser (data, id) {
    return axios.put(process.env.VUE_APP_API_URL + `/users/${id}`, data, { headers: authHeader(), validateStatus: false })
  },
  deleteUser (id) {
    return axios.delete(process.env.VUE_APP_API_URL + `/users/${id}`, { headers: authHeader(), validateStatus: false })
  },
  getUserById (id) {
    return axios.get(process.env.VUE_APP_API_URL + '/users/' + id, { headers: authHeader(), validateStatus: false })
  },
  getAllUserDetails () {
    return axios.get(process.env.VUE_APP_API_URL + '/users/user_details', { headers: authHeader(), validateStatus: false })
  }
}
