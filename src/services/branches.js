import axios from './index'
import authHeader from '../auth/authHeader'

export default {
  getAllBranches () {
    return axios.get(process.env.VUE_APP_API_URL + '/branches', { headers: authHeader() })
  },
  createBranch (data) {
    return axios.post(process.env.VUE_APP_API_URL + '/branches', data, { headers: authHeader() })
  },
  updateBranch (data) {
    return axios.put(process.env.VUE_APP_API_URL + '/branches/' + data.id, data, { headers: authHeader() })
  },
  getAllBranchesByClinic (id) {
    return axios.get(process.env.VUE_APP_API_URL + '/clinic/' + id + '/branches', { headers: authHeader() })
  }
}
