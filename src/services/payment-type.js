import axios from './index'
import authHeader from '../auth/authHeader'

export default {
  getAllPaymentTypes () {
    return axios.get(process.env.VUE_APP_API_URL + '/payment-types', { headers: authHeader(), validateStatus: false })
  },
  createPaymentType (data) {
    return axios.post(process.env.VUE_APP_API_URL + '/payment-types', data, { headers: authHeader(), validateStatus: false })
  },
  updatePaymentType (data, id) {
    return axios.put(process.env.VUE_APP_API_URL + `/payment-types/${id}`, data, { headers: authHeader(), validateStatus: false })
  },
  getPaymentTypeById (id) {
    return axios.get(process.env.VUE_APP_API_URL + '/payment-types/' + id, { headers: authHeader(), validateStatus: false })
  }
}
