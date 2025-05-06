import axios from './index'
import authHeader from '../auth/authHeader'

export default {
  getAllServices (branchId) {
    return axios.get(process.env.VUE_APP_API_URL + '/branch-services?branchId=' + branchId, { headers: authHeader() })
  },
  getAllOtherServices (branchId) {
    return axios.get(process.env.VUE_APP_API_URL + '/other-branch-services?branchId=' + branchId, { headers: authHeader() })
  },
  getCopyOtherServices (data) {
    return axios.post(process.env.VUE_APP_API_URL + '/copy-other-branch-services', data, { headers: authHeader() })
  },
  getAllServicesByPagination (payload) {
    return axios.get(process.env.VUE_APP_API_URL + `/branch-services-paginated?${payload}`, { headers: authHeader() })
  },
  createService (data) {
    return axios.post(process.env.VUE_APP_API_URL + '/services', data, { headers: authHeader() })
  },
  updateService (data) {
    return axios.put(process.env.VUE_APP_API_URL + '/services/' + data.id, data, { headers: authHeader() })
  },
  deleteService (id) {
    return axios.delete(process.env.VUE_APP_API_URL + `/services/${id}`, { headers: authHeader() })
  }
}
