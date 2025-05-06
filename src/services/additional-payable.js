import axios from './index'
import authHeader from '../auth/authHeader'

export default {
  createAdditionalPayable (data) {
    return axios.post(process.env.VUE_APP_API_URL + '/additional-payable', data, { headers: authHeader() })
  },
  getAdditionalPayablesByActivity (id) {
    return axios.get(process.env.VUE_APP_API_URL + '/activity/additional-payables/' + id, { headers: authHeader() })
  },
  deleteAdditionalPayable (id) {
    return axios.delete(process.env.VUE_APP_API_URL + `/additional-payable/${id}`, { headers: authHeader() })
  }
}
